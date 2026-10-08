// Run with a TypeScript runner after placing client.ts beside this file.
// Uses only a newly enrolled sandbox organization. Does not enable live features.
import { ContentSweep } from "./client";
import { randomUUID } from "node:crypto";
const client = new ContentSweep(process.env.CONTENT_SWEEP_API ?? "https://contentsweep.ai/api/v1");
const enrollment = (await client.enroll<{ access_token: string; environment: string }>({ body: { name: "Sandbox integration example" } })).data;
if (enrollment.environment !== "sandbox") throw new Error("Refusing non-sandbox account");
client.token = enrollment.access_token;
await client.purchase({ body: { amount_cents: 500 }, idempotencyKey: randomUUID() });
const holder = (await client.rights_holder_create<{ id: string }>({ body: { name: "Example holder" } })).data;
const work = (await client.work_create<{ id: string }>({ body: { rights_holder_id: holder.id, description: "Example work", original_url: "https://example.com/original" } })).data;
const grant = (await client.delegation_create<{ id: string }>({ body: { rights_holder_id: holder.id, work_ids: [work.id], actions: ["search", "investigate", "evidence", "prepare", "submit", "status", "monitor"], rights_authorized: true, can_appoint_content_sweep: true, authorization_reference: "sandbox-example", attestation_version: "agent-delegation-v1", expires_at: new Date(Date.now() + 86400_000).toISOString() } })).data;
const scope = { rights_holder_id: holder.id, work_id: work.id, delegation_id: grant.id };
async function run(action: string, input: Record<string, unknown>) {
  const quote = (await client.quote_create<{ id: string }>({ body: { action, input: { ...scope, ...input } } })).data;
  const operation = (await client.operation_create<{ operation_id: string }>({ body: { quote_id: quote.id }, idempotencyKey: randomUUID() })).data;
  for (let attempt = 0; attempt < 120; attempt++) {
    const current = (await client.operation_get<{ status: string; result: Record<string, unknown>; errorCode: string | null }>({ params: { id: operation.operation_id } })).data;
    if (current.status === "succeeded") return current.result;
    if (["blocked", "failed"].includes(current.status)) throw new Error(JSON.stringify(current));
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  throw new Error("Still pending; poll the same operation ID: " + operation.operation_id);
}
await run("search", { main_handle: "examplecreator" });
const found = await run("investigate", { url: "https://example.com/synthetic-copy" });
const evidence = await run("evidence", { case_id: found.case_id });
const packet = await run("prepare", { case_id: found.case_id, evidence_id: evidence.evidence_id, good_faith: true, accurate_and_authorized: true, infringement_explanation: "Simulated unauthorized copy" });
if (!packet.ready) throw new Error(JSON.stringify(packet));
console.log(await run("submit", { case_id: found.case_id, packet_id: packet.packet_id }));
console.log(await run("status", { case_id: found.case_id, scenario: "removed" }));
// A single absence is not removal. Preserve the returned observation and uncertainty.
console.log(await run("monitor", { case_id: found.case_id, target_action: "status", expires_at: new Date(Date.now() + 86400_000).toISOString(), per_run_limit_cents: 10, total_limit_cents: 20 }));
