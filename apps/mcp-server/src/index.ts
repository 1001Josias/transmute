import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "transmute-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

/**
 * Handler that lists available tools.
 * Exposes a single "hello_world" tool for verification.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "hello_world",
        description: "A simple hello world tool to verify connectivity",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "The name to say hello to",
            },
          },
        },
      },
    ],
  };
});

/**
 * Handler for the hello_world tool.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "hello_world") {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }

  const name = (request.params.arguments?.name as string) || "World";

  return {
    content: [
      {
        type: "text",
        text: `Hello, ${name}! The Transmute MCP server is up and running.`,
      },
    ],
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Transmute MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
