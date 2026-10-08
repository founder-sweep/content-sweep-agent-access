# Content Sweep Agent Access

Official integration examples for the [Content Sweep](https://contentsweep.ai) remote MCP server and REST API, published by Content Sweep LLC.

Agents can search supported sources for suspected text/identity copies, investigate URLs, collect metadata evidence, prepare takedown packets, submit within recorded copyright authority through activated routes, and monitor outcomes within an explicit budget.

This repository contains public clients and connection examples for the hosted service. The enforcement backend runs at Content Sweep.

## Connect with MCP

- Endpoint: **https://contentsweep.ai/api/mcp**
- Transport: **Streamable HTTP**
- Registry name: **ai.contentsweep/agent-access**
- Authentication: **Bearer access token** for private data and execution. Browser OAuth and dynamic client registration are not supported.

Public `initialize`, `tools/list`, and `enroll_agent` let an agent discover the service and obtain a free sandbox account. Configure the returned token through your client's HTTP headers:

```json
{
  "mcpServers": {
    "content-sweep": {
      "url": "https://contentsweep.ai/api/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_CONTENT_SWEEP_ACCESS_TOKEN>"
      }
    }
  }
}
```

Your client must support remote Streamable HTTP and configurable headers; its configuration format may differ. Keep the actual token in its secret storage, outside this repository.

Try public discovery with the official MCP SDK (Node.js 20 or later):

```sh
npm ci
npm run mcp:discover
```

The example lists tools without enrolling, spending credits, or contacting enforcement destinations. Task tools include `find_copies`, `investigate_url`, `capture_evidence`, `prepare_takedown`, `submit_takedown`, `check_status`, and `monitor_case`. Create a quote, pass its ID and an idempotency key to the task tool, then poll `get_operation`.

## Try the free simulated sandbox

```sh
python3 sandbox.py
```

The [Python](sandbox.py) and [TypeScript](sandbox.ts) examples create a new sandbox organization, add simulated credits, register synthetic rights and delegation, and run search through submission, observations, and a bounded daily monitor. They never promote the account to live or spend real money. Sandbox receipts and removals are simulated.

The [integration guide](guide.md) explains enrollment, credentials, quotes, permissions, idempotency, monitoring, and signed webhooks. [client.py](client.py) and [client.ts](client.ts) are generated REST clients; [postman.json](postman.json) and [server.json](server.json) provide importable public metadata.

## Live use and coverage

Live accounts use organization-bound prepaid USD service credits purchased through Stripe MPP card payments. Check current [capabilities](https://contentsweep.ai/api/v1/capabilities), [prices](https://contentsweep.ai/api/v1/pricing), and [terms](https://contentsweep.ai/agent/terms.md) before enrolling. Initial live customers and rights holders are US-based. Automatic replenishment is off by default; stablecoins are not enabled.

Discovery returns suspected matches with source coverage and limitations. It uses text and identity search. Evidence contains metadata only, without screenshots or downloaded media. Recorded, revocable delegation must cover the work and requested action; purchasing credits does not establish copyright authority.

Submission depends on current authority, evidence, funds, and a supported activated destination. A provider receipt proves submission, not removal. Timeouts, blocked requests, login walls, and transient failures are uncertain observations.

## Public references and support

- [Developer documentation](https://contentsweep.ai/developers/agents)
- [OpenAPI](https://contentsweep.ai/api/v1/openapi.json)
- [Agent instructions](https://contentsweep.ai/llms.txt)
- [Verified Glama listing](https://glama.ai/mcp/connectors/ai.contentsweep/agent-access)
- Support: [support@contentsweep.ai](mailto:support@contentsweep.ai)

The MIT license applies to these client examples and documentation. Hosted service access is governed by the linked service terms.
