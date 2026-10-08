# Content Sweep agent integration

Check [capabilities](https://contentsweep.ai/api/v1/capabilities), [authentication](https://contentsweep.ai/api/v1/auth-metadata), [pricing](https://contentsweep.ai/api/v1/pricing) and [OpenAPI](https://contentsweep.ai/api/v1/openapi.json) first. An inactive capability returns a structured error; documentation availability does not imply live activation. API base: `https://contentsweep.ai/api/v1`. MCP: `https://contentsweep.ai/api/mcp`.

## Sandbox quick start

Call `POST /enroll` with JSON `{"name":"My integration"}`. Save the returned access token securely and send `Authorization: Bearer <token>` on private calls. Enrollment returns a **sandbox** organization. Never infer live authority from its credentials or synthetic receipts. Bootstrap credentials expire in 30 days; `POST /tokens` with `{"scopes":["search","status"]}` creates a 15-minute scoped token. Rotate through `POST /credentials/rotate`; rotation invalidates the old root and its children. Revocation is immediate.

Run the complete [TypeScript example](https://contentsweep.ai/agent/sandbox.ts) beside [client.ts](https://contentsweep.ai/agent/client.ts), or [Python example](https://contentsweep.ai/agent/sandbox.py) beside [client.py]. Set `CONTENT_SWEEP_API` to the target API base if needed. The examples only create new sandbox accounts and use simulated funds. They cover search, investigation, evidence, preparation, submission receipts, status and a bounded daily monitor. A worker must be running; a polling timeout means pending, not failure or permission to resubmit. The [Postman collection](https://contentsweep.ai/agent/postman.json) provides the same endpoint set. Fill rights and operation fields from this guide and preserve request keys across retries.

1. `POST /billing/purchases` with `{"amount_cents":500}` and a fresh `Idempotency-Key` adds simulated sandbox funds. No card or live provider is contacted.
2. `POST /rights-holders` with `{"name":"Example owner"}` returns a holder ID. Live enforcement also needs the actual `country_code` and accountable organization identity.
3. `POST /works` with `rights_holder_id`, `description` and `original_url` records the work. Source URLs must be public HTTPS. Add `external_id` for your own reference.
4. `POST /delegations` with the holder ID, `work_ids`, `actions`, `rights_authorized:true`, `can_appoint_content_sweep:true`, `authorization_reference`, `attestation_version:"agent-delegation-v1"` and future `expires_at` records authority. Only assert authority you actually possess. Allowed actions: `search`, `investigate`, `evidence`, `prepare`, `submit`, `status`, `monitor`. Revoke with `DELETE /delegations/{id}`.
5. Every paid action starts with `POST /quotes` containing `{"action":"investigate","input":{"rights_holder_id":"...","work_id":"...","delegation_id":"...","url":"https://example.com/copy"}}`. Inspect its `maximumCents`, `rateVersion`, and `expiresAt`.
6. Execute with `POST /operations`, body `{"quote_id":"..."}`, and `Idempotency-Key`. This reserves the maximum and returns `operation_id`. Poll `GET /operations/{id}` for `queued`, `running`, `succeeded`, `blocked`, or `failed`. Read `result` and `errorCode`. Use the same quote/key when retrying; changed input or quote with an existing key returns 409.

All action inputs include `rights_holder_id`, `work_id`, and `delegation_id`:

| Action | Additional input | Outcome |
| --- | --- | --- |
| `search` | `main_handle` | Suspected text/identity matches, coverage and limitations |
| `investigate` | `url` or an existing `case_id` | Case, metadata evidence, registrar/network facts and cautious attribution |
| `evidence` | `case_id` | Immutable metadata observation and hash |
| `prepare` | `case_id`, `evidence_id`, `good_faith:true`, `accurate_and_authorized:true`, `infringement_explanation`; optional `destination` | Packet readiness, missing fields, blockers or `packet_id` |
| `submit` | `case_id`, `packet_id` | Receipt-backed submission, or a precise blocker/uncertain outcome |
| `status` | `case_id`; sandbox may use `scenario:"removed"` | Timestamped observation; one absence is not verified removal |
| `monitor` | `target_action:"search"` with `main_handle`, or `target_action:"status"` with `case_id`; `expires_at`, `per_run_limit_cents`, `total_limit_cents`; optional `cadence_hours` | Monitor ID; default daily, pauses at budget/authority/funding limits |

Read `/cases/{id}`, `/evidence/{id}`, `/packets/{id}`, `/monitors/{id}` and `/billing/usage` with the owning credential. Polling, balance reads and receipt reads are free. Pause/resume through `/monitors/{id}/pause` and `/resume`; resumption does not expand expiry or total budget. A resumed monitor may provide a replacement `delegation_id`.

## Live accounts and prepaid payment

A sandbox credential can call `POST /enroll/live` with `legal_name`, ISO `country_code`, real `contact_email`, `authorization_reference`, current `terms_version`, `terms_accepted:true` and `authorized_agent:true`. This creates a separate live organization and credential after applicable launch gates; sandbox credentials, balances and cases are not promoted. No sales call or browser signup is a product requirement.

Credits are USD-denominated, integer-cent, organization-bound service credits with no customer-to-customer transfers. Live rates appear only after approval. Purchase minimum is 50 cents; maximum per purchase is 100,000 cents. Card purchases use [Stripe MPP](https://docs.stripe.com/payments/machine/mpp). Keep the account Bearer token in `Authorization`. A purchase may return HTTP 402 with an MPP challenge. Supply the supported card payment token through the MPP client, then repeat the **same purchase request and idempotency key**, putting the resulting credential in `Payment-Authorization`. Credit is granted only after authenticated exact amount/currency/account/environment confirmation. A receipt alone supplied by the client cannot credit an account. The generated clients expose response/error headers for the challenge and receipt; they do not store card funding credentials.

Quotes expire in 15 minutes. Work reserves the maximum atomically. Successful billable operations settle against that reservation; failed or blocked work releases unused credit. An already receipted packet replay costs zero. Uncertain submissions retain their reservation until reconciliation, and must not be resent with a fresh key. Provider refunds/chargebacks produce append-only reversals and freeze unfunded future work. Purchase returns and refund processing remain provider-confirmed, never inferred from a browser redirect.

`POST /billing/policy` sets `daily_limit_cents`, `credential_limit_cents`, and `funding_policy`. Use `funding_policy:null` to leave automatic replenishment off. A bounded opt-in policy has `amountCents`, `thresholdCents`, `dailyMaximumCents`, `expiresAt`, and `mandateReference`. Replenishment is client-driven using `automatic:true` purchases; the service does not retain a reusable card secret. A mandate never replaces copyright delegation.

## MCP

Use a Streamable HTTP client with the same Bearer header. `initialize`, `tools/list` and `enroll_agent` are available without a credential when activated. Provisioned machine tokens are supported; browser OAuth discovery is not implemented. Authenticate every private request. The server checks Host and Origin.

Task tools are `find_copies`, `investigate_url`, `capture_evidence`, `prepare_takedown`, `submit_takedown`, `check_status` and `monitor_case`. Call `create_quote` with the corresponding REST action/input, then give the task tool `quote_id` and `idempotency_key`. Poll with `get_operation`. Account, purchasing, rights registration, delegation/revocation, credential rotation, packet/export, monitor and webhook helpers are discoverable in `tools/list`. Results contain `http_status` and `data`; tool errors do not imply work was submitted.

## Webhooks

Register with `POST /webhooks`, body `{"url":"https://your-public-host.example/events"}`. Save `signing_secret` once. This explicitly opts into outbound events, including sandbox events. Private addresses, unsafe URLs and redirects are rejected. No more than five active endpoints per organization.

Events include a stable `id`, `type`, `created_at`, `environment`, and minimal `data` referencing tenant resources. Types: `operation.completed`, `action.required`, `search.completed`, `matches.found`, `case.changed`, `content.observed`, `monitor.changed`, `submission.outcome`. Verify `Content-Sweep-Signature` (`t=<seconds>,v1=<hex>`) with HMAC-SHA256 over `<seconds>.<exact body>` using the secret, constant-time comparison, and a five-minute timestamp tolerance. Deduplicate on `id`, persist before returning 2xx, and fetch current state for out-of-order events. Never interpret receipt acceptance as removal.

Inspect `/events` and `/webhooks/deliveries`. Eight bounded automatic attempts back off from 30 seconds to one hour. Explicit replay through `/events/replay` takes `event_id` and `webhook_id`, preserves the event ID, and is capped at ten replays. `DELETE /webhooks/{id}` revokes future deliveries. To rotate a receiver secret, create a replacement subscription and revoke the old one; allow already in-flight old deliveries to finish.

## Coverage, privacy and blockers

Discovery is existing text/identity search, not visual similarity. Evidence is metadata-only: no screenshots, thumbnails or downloaded media. Provider lookups, observed facts, customer assertions and inference remain distinct. CDN observations do not identify a hidden origin host. Login walls, timeouts and blocked requests do not establish removal.

Partner holders have no login or creator subscription. Exact cases and evidence require their organization's scoped credentials; public responses omit storage paths and operator reasoning. Evidence follows a 24-month retention period unless held; expired evidence is unavailable. Event data contains references and status, not full case content.

Live enforcement rechecks appointment authority, current delegation and credentials, funding, current partner terms/country treatment and official screening, exact-URL evidence, destination, incidents, privacy/legal restrictions and activated route policy. Ordinary cases within standing authority do not require fresh human approval. Provider identity requirements, disputes, unsupported destinations and human challenges return blockers. Reconcile uncertain delivery against provider evidence before retrying. Contact support with the operation ID when an external dependency requires action; do not send secrets or sensitive evidence in support messages.

Live enrollment accepts the versioned [Agent Access Terms](https://contentsweep.ai/agent/terms.md); read the advertised terms version and country availability before enrollment.
