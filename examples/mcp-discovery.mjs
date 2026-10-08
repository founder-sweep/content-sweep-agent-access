import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

// Public discovery only: no enrollment, purchase, paid work, or submission.
const client = new Client({ name: 'content-sweep-discovery-example', version: '1.0.0' });
const transport = new StreamableHTTPClientTransport(new URL('https://contentsweep.ai/api/mcp'));

try {
  await client.connect(transport);
  const { tools } = await client.listTools();
  console.log(JSON.stringify({ endpoint: 'https://contentsweep.ai/api/mcp', tools: tools.map(tool => ({ name: tool.name, description: tool.description })) }, null, 2));
} finally {
  await client.close();
}
