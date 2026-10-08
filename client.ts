// Generated from the Content Sweep OpenAPI contract. Do not edit.
export const routes = {
  "capabilities": {
    "method": "GET",
    "path": "/capabilities"
  },
  "auth_metadata": {
    "method": "GET",
    "path": "/auth-metadata"
  },
  "pricing": {
    "method": "GET",
    "path": "/pricing"
  },
  "enroll": {
    "method": "POST",
    "path": "/enroll"
  },
  "enroll_live": {
    "method": "POST",
    "path": "/enroll/live"
  },
  "account": {
    "method": "GET",
    "path": "/account"
  },
  "exchange_token": {
    "method": "POST",
    "path": "/tokens"
  },
  "rotate_credential": {
    "method": "POST",
    "path": "/credentials/rotate"
  },
  "revoke_credential": {
    "method": "DELETE",
    "path": "/credentials/{id}"
  },
  "prices": {
    "method": "GET",
    "path": "/billing/prices"
  },
  "balance": {
    "method": "GET",
    "path": "/billing/balance"
  },
  "usage": {
    "method": "GET",
    "path": "/billing/usage"
  },
  "purchase": {
    "method": "POST",
    "path": "/billing/purchases"
  },
  "spending_policy": {
    "method": "POST",
    "path": "/billing/policy"
  },
  "rights_holder_create": {
    "method": "POST",
    "path": "/rights-holders"
  },
  "work_create": {
    "method": "POST",
    "path": "/works"
  },
  "delegation_create": {
    "method": "POST",
    "path": "/delegations"
  },
  "delegation_revoke": {
    "method": "DELETE",
    "path": "/delegations/{id}"
  },
  "quote_create": {
    "method": "POST",
    "path": "/quotes"
  },
  "operation_create": {
    "method": "POST",
    "path": "/operations"
  },
  "operation_get": {
    "method": "GET",
    "path": "/operations/{id}"
  },
  "case_get": {
    "method": "GET",
    "path": "/cases/{id}"
  },
  "evidence_get": {
    "method": "GET",
    "path": "/evidence/{id}"
  },
  "packet_get": {
    "method": "GET",
    "path": "/packets/{id}"
  },
  "monitor_get": {
    "method": "GET",
    "path": "/monitors/{id}"
  },
  "monitor_pause": {
    "method": "POST",
    "path": "/monitors/{id}/pause"
  },
  "monitor_resume": {
    "method": "POST",
    "path": "/monitors/{id}/resume"
  },
  "webhook_create": {
    "method": "POST",
    "path": "/webhooks"
  },
  "webhook_revoke": {
    "method": "DELETE",
    "path": "/webhooks/{id}"
  },
  "webhook_deliveries": {
    "method": "GET",
    "path": "/webhooks/deliveries"
  },
  "events": {
    "method": "GET",
    "path": "/events"
  },
  "event_replay": {
    "method": "POST",
    "path": "/events/replay"
  },
  "sandbox_run_create": {
    "method": "POST",
    "path": "/sandbox/runs"
  },
  "sandbox_run_advance": {
    "method": "POST",
    "path": "/sandbox/runs/{id}"
  }
} as const;
export type Operation = keyof typeof routes;
export type Args = { body?: unknown; params?: Record<string, string>; idempotencyKey?: string; paymentAuthorization?: string; signal?: AbortSignal };
export type AgentResponse<T> = { status: number; data: T; headers: Headers };
export class AgentApiError extends Error { constructor(public status: number, public data: unknown, public headers: Headers) { super('Content Sweep HTTP ' + status); } }
export class ContentSweep {
  constructor(public baseUrl = 'https://contentsweep.ai/api/v1', public token?: string, private fetcher: typeof fetch = fetch) {}
  async request<T = Record<string, unknown>>(operation: Operation, args: Args = {}): Promise<AgentResponse<T>> {
    const route = routes[operation];
    const path = route.path.replace(/\{([^}]+)\}/g, (_, name: string) => { const value = args.params?.[name]; if (!value) throw new Error('Missing path parameter: ' + name); return encodeURIComponent(value); });
    const headers = new Headers({ Accept: 'application/json' });
    if (this.token) headers.set('Authorization', 'Bearer ' + this.token);
    if (args.body !== undefined) headers.set('Content-Type', 'application/json');
    if (args.idempotencyKey) headers.set('Idempotency-Key', args.idempotencyKey);
    if (args.paymentAuthorization) headers.set('Payment-Authorization', args.paymentAuthorization);
    const response = await this.fetcher(this.baseUrl.replace(/\/$/, '') + path, { method: route.method, headers, body: args.body === undefined ? undefined : JSON.stringify(args.body), signal: args.signal });
    const data = await response.json();
    if (!response.ok) throw new AgentApiError(response.status, data, response.headers);
    return { status: response.status, data: data as T, headers: response.headers };
  }
  capabilities<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('capabilities', args); }
  auth_metadata<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('auth_metadata', args); }
  pricing<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('pricing', args); }
  enroll<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('enroll', args); }
  enroll_live<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('enroll_live', args); }
  account<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('account', args); }
  exchange_token<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('exchange_token', args); }
  rotate_credential<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('rotate_credential', args); }
  revoke_credential<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('revoke_credential', args); }
  prices<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('prices', args); }
  balance<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('balance', args); }
  usage<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('usage', args); }
  purchase<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('purchase', args); }
  spending_policy<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('spending_policy', args); }
  rights_holder_create<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('rights_holder_create', args); }
  work_create<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('work_create', args); }
  delegation_create<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('delegation_create', args); }
  delegation_revoke<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('delegation_revoke', args); }
  quote_create<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('quote_create', args); }
  operation_create<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('operation_create', args); }
  operation_get<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('operation_get', args); }
  case_get<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('case_get', args); }
  evidence_get<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('evidence_get', args); }
  packet_get<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('packet_get', args); }
  monitor_get<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('monitor_get', args); }
  monitor_pause<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('monitor_pause', args); }
  monitor_resume<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('monitor_resume', args); }
  webhook_create<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('webhook_create', args); }
  webhook_revoke<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('webhook_revoke', args); }
  webhook_deliveries<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('webhook_deliveries', args); }
  events<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('events', args); }
  event_replay<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('event_replay', args); }
  sandbox_run_create<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('sandbox_run_create', args); }
  sandbox_run_advance<T = Record<string, unknown>>(args: Args = {}) { return this.request<T>('sandbox_run_advance', args); }
}
