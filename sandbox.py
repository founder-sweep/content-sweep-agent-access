# Run beside client.py. This creates only a new sandbox organization.
import os
import time
from datetime import datetime, timedelta, timezone
from uuid import uuid4
from client import ContentSweep

client = ContentSweep(os.environ.get("CONTENT_SWEEP_API", "https://contentsweep.ai/api/v1"))
account = client.enroll(body={"name": "Python sandbox example"})["data"]
if account["environment"] != "sandbox":
    raise RuntimeError("Refusing non-sandbox account")
client.token = account["access_token"]
client.purchase(body={"amount_cents": 500}, idempotency_key=str(uuid4()))
holder = client.rights_holder_create(body={"name": "Example holder"})["data"]
work = client.work_create(body={"rights_holder_id": holder["id"], "description": "Example original", "original_url": "https://example.com/original"})["data"]
expiry = (datetime.now(timezone.utc) + timedelta(days=1)).isoformat()
grant = client.delegation_create(body={"rights_holder_id": holder["id"], "work_ids": [work["id"]], "actions": ["search", "investigate", "evidence", "prepare", "submit", "status", "monitor"], "rights_authorized": True, "can_appoint_content_sweep": True, "authorization_reference": "sandbox-example", "attestation_version": "agent-delegation-v1", "expires_at": expiry})["data"]
scope = {"rights_holder_id": holder["id"], "work_id": work["id"], "delegation_id": grant["id"]}

def run(action, values):
    quote = client.quote_create(body={"action": action, "input": {**scope, **values}})["data"]
    operation = client.operation_create(body={"quote_id": quote["id"]}, idempotency_key=str(uuid4()))["data"]
    for _ in range(120):
        current = client.operation_get(params={"id": operation["operation_id"]})["data"]
        if current["status"] == "succeeded":
            return current["result"]
        if current["status"] in ("blocked", "failed"):
            raise RuntimeError(current)
        time.sleep(2)
    raise TimeoutError("Poll the same operation: " + operation["operation_id"])

run("search", {"main_handle": "examplecreator"})
case = run("investigate", {"url": "https://example.com/synthetic-copy"})
evidence = run("evidence", {"case_id": case["case_id"]})
packet = run("prepare", {"case_id": case["case_id"], "evidence_id": evidence["evidence_id"], "good_faith": True, "accurate_and_authorized": True, "infringement_explanation": "Simulated unauthorized copy"})
if not packet.get("ready"):
    raise RuntimeError(packet)
print(run("submit", {"case_id": case["case_id"], "packet_id": packet["packet_id"]}))
print(run("status", {"case_id": case["case_id"], "scenario": "removed"}))
print(run("monitor", {"case_id": case["case_id"], "target_action": "status", "expires_at": expiry, "per_run_limit_cents": 10, "total_limit_cents": 20}))
