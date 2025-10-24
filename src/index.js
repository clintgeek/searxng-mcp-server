#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Configuration
const CONFIG = {
  url: process.env.SEARXNG_URL || "http://localhost:8888",
  maxResults: parseInt(process.env.SEARXNG_MAX_RESULTS || "10"),
  timeout: parseInt(process.env.SEARXNG_TIMEOUT || "30000"),
  categories: process.env.SEARXNG_CATEGORIES?.split(",") || ["general"],
  safeSearch: parseInt(process.env.SEARXNG_SAFESEARCH || "0"),
};

// Server instance
const server = new Server(
  {
    name: "searxng-search",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Execute search query against SearXNG
 */
async function search(query, options = {}) {
  const url = new URL("/search", CONFIG.url);
  url.searchParams.append("q", query);
  url.searchParams.append("format", "json");
  url.searchParams.append("safesearch", options.safeSearch ?? CONFIG.safeSearch);

  if (options.categories?.length) {
    url.searchParams.append("categories", options.categories.join(","));
  }

  if (options.language) {
    url.searchParams.append("language", options.language);
  }

  if (options.timeRange) {
    url.searchParams.append("time_range", options.timeRange);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CONFIG.timeout);

  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "SearXNG-MCP-Server/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Search request timed out");
    }
    throw new Error(`Search failed: ${error.message}`);
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Format search results for display
 */
function formatResults(data, maxResults) {
  const results = (data.results || []).slice(0, maxResults);

  return results.map((result, index) => {
    const parts = [
      `${index + 1}. **${result.title}**`,
      `   ${result.url}`,
      `   ${result.content || result.snippet || "No description available"}`,
    ];

    if (result.publishedDate) {
      parts.push(`   Published: ${result.publishedDate}`);
    }

    return parts.join("\n");
  }).join("\n\n");
}

/**
 * Register available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "search_web",
      description: "Search the web using SearXNG privacy-focused metasearch engine. Returns relevant results with titles, URLs, and content snippets.",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query (natural language or keywords)",
          },
          max_results: {
            type: "number",
            description: `Maximum results to return (1-50, default: ${CONFIG.maxResults})`,
            minimum: 1,
            maximum: 50,
            default: CONFIG.maxResults,
          },
          categories: {
            type: "array",
            description: "Search categories (e.g., general, news, images, videos, files, science)",
            items: { type: "string" },
          },
          language: {
            type: "string",
            description: "Language code (e.g., en, es, fr, de)",
          },
          time_range: {
            type: "string",
            description: "Time range filter",
            enum: ["day", "week", "month", "year"],
          },
        },
        required: ["query"],
      },
    },
  ],
}));

/**
 * Handle tool execution
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "search_web") {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }

  const { query, max_results, categories, language, time_range } = request.params.arguments || {};

  if (!query?.trim()) {
    throw new Error("Query is required");
  }

  const maxResults = Math.min(Math.max(max_results || CONFIG.maxResults, 1), 50);

  const data = await search(query, {
    categories,
    language,
    timeRange: time_range,
  });

  const formatted = formatResults(data, maxResults);
  const searchUrl = `${CONFIG.url}/search?q=${encodeURIComponent(query)}`;

  return {
    content: [
      {
        type: "text",
        text: `# Search Results: "${query}"\n\nFound ${data.results?.length || 0} results:\n\n${formatted}\n\n---\nView in browser: ${searchUrl}`,
      },
    ],
  };
});

/**
 * Start server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("SearXNG MCP Server running");
  console.error(`SearXNG instance: ${CONFIG.url}`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
