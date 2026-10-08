# Generated from the Content Sweep OpenAPI contract. Do not edit.
import json
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from urllib.parse import quote
import re

ROUTES = json.loads("{\"capabilities\":{\"method\":\"GET\",\"path\":\"/capabilities\"},\"auth_metadata\":{\"method\":\"GET\",\"path\":\"/auth-metadata\"},\"pricing\":{\"method\":\"GET\",\"path\":\"/pricing\"},\"enroll\":{\"method\":\"POST\",\"path\":\"/enroll\"},\"enroll_live\":{\"method\":\"POST\",\"path\":\"/enroll/live\"},\"account\":{\"method\":\"GET\",\"path\":\"/account\"},\"exchange_token\":{\"method\":\"POST\",\"path\":\"/tokens\"},\"rotate_credential\":{\"method\":\"POST\",\"path\":\"/credentials/rotate\"},\"revoke_credential\":{\"method\":\"DELETE\",\"path\":\"/credentials/{id}\"},\"prices\":{\"method\":\"GET\",\"path\":\"/billing/prices\"},\"balance\":{\"method\":\"GET\",\"path\":\"/billing/balance\"},\"usage\":{\"method\":\"GET\",\"path\":\"/billing/usage\"},\"purchase\":{\"method\":\"POST\",\"path\":\"/billing/purchases\"},\"spending_policy\":{\"method\":\"POST\",\"path\":\"/billing/policy\"},\"rights_holder_create\":{\"method\":\"POST\",\"path\":\"/rights-holders\"},\"work_create\":{\"method\":\"POST\",\"path\":\"/works\"},\"delegation_create\":{\"method\":\"POST\",\"path\":\"/delegations\"},\"delegation_revoke\":{\"method\":\"DELETE\",\"path\":\"/delegations/{id}\"},\"quote_create\":{\"method\":\"POST\",\"path\":\"/quotes\"},\"operation_create\":{\"method\":\"POST\",\"path\":\"/operations\"},\"operation_get\":{\"method\":\"GET\",\"path\":\"/operations/{id}\"},\"case_get\":{\"method\":\"GET\",\"path\":\"/cases/{id}\"},\"evidence_get\":{\"method\":\"GET\",\"path\":\"/evidence/{id}\"},\"packet_get\":{\"method\":\"GET\",\"path\":\"/packets/{id}\"},\"monitor_get\":{\"method\":\"GET\",\"path\":\"/monitors/{id}\"},\"monitor_pause\":{\"method\":\"POST\",\"path\":\"/monitors/{id}/pause\"},\"monitor_resume\":{\"method\":\"POST\",\"path\":\"/monitors/{id}/resume\"},\"webhook_create\":{\"method\":\"POST\",\"path\":\"/webhooks\"},\"webhook_revoke\":{\"method\":\"DELETE\",\"path\":\"/webhooks/{id}\"},\"webhook_deliveries\":{\"method\":\"GET\",\"path\":\"/webhooks/deliveries\"},\"events\":{\"method\":\"GET\",\"path\":\"/events\"},\"event_replay\":{\"method\":\"POST\",\"path\":\"/events/replay\"},\"sandbox_run_create\":{\"method\":\"POST\",\"path\":\"/sandbox/runs\"},\"sandbox_run_advance\":{\"method\":\"POST\",\"path\":\"/sandbox/runs/{id}\"}}")

class AgentApiError(Exception):
    def __init__(self, status, data, headers):
        super().__init__(f"Content Sweep HTTP {status}")
        self.status, self.data, self.headers = status, data, headers

class ContentSweep:
    def __init__(self, base_url="https://contentsweep.ai/api/v1", token=None, opener=urlopen):
        self.base_url, self.token, self.opener = base_url.rstrip("/"), token, opener

    def request(self, operation, body=None, params=None, idempotency_key=None, payment_authorization=None):
        route = ROUTES[operation]
        params = params or {}
        def substitute(match):
            if match.group(1) not in params:
                raise ValueError("Missing path parameter: " + match.group(1))
            return quote(str(params[match.group(1)]), safe="")
        path = re.sub(r"\{([^}]+)\}", substitute, route["path"])
        headers = {"Accept": "application/json"}
        if self.token: headers["Authorization"] = "Bearer " + self.token
        if body is not None: headers["Content-Type"] = "application/json"
        if idempotency_key: headers["Idempotency-Key"] = idempotency_key
        if payment_authorization: headers["Payment-Authorization"] = payment_authorization
        req = Request(self.base_url + path, data=None if body is None else json.dumps(body).encode(), headers=headers, method=route["method"])
        try:
            with self.opener(req, timeout=30) as response:
                return {"status": response.status, "data": json.load(response), "headers": dict(response.headers)}
        except HTTPError as error:
            raise AgentApiError(error.code, json.load(error), dict(error.headers)) from error

    def capabilities(self, **kwargs):
        return self.request("capabilities", **kwargs)

    def auth_metadata(self, **kwargs):
        return self.request("auth_metadata", **kwargs)

    def pricing(self, **kwargs):
        return self.request("pricing", **kwargs)

    def enroll(self, **kwargs):
        return self.request("enroll", **kwargs)

    def enroll_live(self, **kwargs):
        return self.request("enroll_live", **kwargs)

    def account(self, **kwargs):
        return self.request("account", **kwargs)

    def exchange_token(self, **kwargs):
        return self.request("exchange_token", **kwargs)

    def rotate_credential(self, **kwargs):
        return self.request("rotate_credential", **kwargs)

    def revoke_credential(self, **kwargs):
        return self.request("revoke_credential", **kwargs)

    def prices(self, **kwargs):
        return self.request("prices", **kwargs)

    def balance(self, **kwargs):
        return self.request("balance", **kwargs)

    def usage(self, **kwargs):
        return self.request("usage", **kwargs)

    def purchase(self, **kwargs):
        return self.request("purchase", **kwargs)

    def spending_policy(self, **kwargs):
        return self.request("spending_policy", **kwargs)

    def rights_holder_create(self, **kwargs):
        return self.request("rights_holder_create", **kwargs)

    def work_create(self, **kwargs):
        return self.request("work_create", **kwargs)

    def delegation_create(self, **kwargs):
        return self.request("delegation_create", **kwargs)

    def delegation_revoke(self, **kwargs):
        return self.request("delegation_revoke", **kwargs)

    def quote_create(self, **kwargs):
        return self.request("quote_create", **kwargs)

    def operation_create(self, **kwargs):
        return self.request("operation_create", **kwargs)

    def operation_get(self, **kwargs):
        return self.request("operation_get", **kwargs)

    def case_get(self, **kwargs):
        return self.request("case_get", **kwargs)

    def evidence_get(self, **kwargs):
        return self.request("evidence_get", **kwargs)

    def packet_get(self, **kwargs):
        return self.request("packet_get", **kwargs)

    def monitor_get(self, **kwargs):
        return self.request("monitor_get", **kwargs)

    def monitor_pause(self, **kwargs):
        return self.request("monitor_pause", **kwargs)

    def monitor_resume(self, **kwargs):
        return self.request("monitor_resume", **kwargs)

    def webhook_create(self, **kwargs):
        return self.request("webhook_create", **kwargs)

    def webhook_revoke(self, **kwargs):
        return self.request("webhook_revoke", **kwargs)

    def webhook_deliveries(self, **kwargs):
        return self.request("webhook_deliveries", **kwargs)

    def events(self, **kwargs):
        return self.request("events", **kwargs)

    def event_replay(self, **kwargs):
        return self.request("event_replay", **kwargs)

    def sandbox_run_create(self, **kwargs):
        return self.request("sandbox_run_create", **kwargs)

    def sandbox_run_advance(self, **kwargs):
        return self.request("sandbox_run_advance", **kwargs)
