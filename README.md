# SearXNG MCP Server

Privacy-focused web search for Model Context Protocol using [SearXNG](https://github.com/searxng/searxng) metasearch engine.

**By [FussyMonkey.dev](https://fussymonkey.dev)**

## Features

- 🔒 **Privacy-focused** - No tracking, self-hosted search
- 🌐 **Meta-search** - Aggregates 70+ search engines
- 🚀 **Fast & lightweight** - Minimal dependencies
- 🎯 **Flexible filtering** - Categories, languages, time ranges
- 🔑 **No API keys** - Works with your own SearXNG instance
- ⚡ **MCP native** - Built for Model Context Protocol

## Quick Start

### 1. Install SearXNG

Using Docker (recommended):

```bash
docker run -d -p 8888:8080 searxng/searxng
```

Or see [SearXNG installation docs](https://docs.searxng.org/admin/installation.html) for other methods.

### 2. Install the MCP Server

```bash
npm install -g @fussymonkey-dev/searxng-mcp-server
```

### 3. Configure Your MCP Client

Add to your MCP settings (e.g., Claude Desktop, Cline, etc.):

```json
{
  "mcpServers": {
    "searxng": {
      "command": "searxng-mcp-server",
      "env": {
        "SEARXNG_URL": "http://localhost:8888"
      }
    }
  }
}
```

## Configuration

Environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `SEARXNG_URL` | SearXNG instance URL | `http://localhost:8888` |
| `SEARXNG_MAX_RESULTS` | Max results per search (1-50) | `10` |
| `SEARXNG_TIMEOUT` | Request timeout (ms) | `30000` |
| `SEARXNG_CATEGORIES` | Default categories (comma-separated) | `general` |
| `SEARXNG_SAFESEARCH` | Safe search level (0-2) | `0` |

## Usage

The server provides one tool:

### `search_web`

Search the web using SearXNG.

**Parameters:**
- `query` (required) - Search query
- `max_results` (optional) - Number of results (1-50)
- `categories` (optional) - Array of categories: `general`, `news`, `images`, `videos`, `files`, `music`, `science`, `social_media`
- `language` (optional) - Language code (e.g., `en`, `es`, `fr`)
- `time_range` (optional) - Filter by time: `day`, `week`, `month`, `year`

**Example:**

```
Search for "machine learning tutorials" with news from the past week
```

## Docker Compose Setup

See [`examples/docker-compose.yml`](examples/docker-compose.yml) for a complete setup with SearXNG and the MCP server.

## Development

```bash
# Clone the repo
git clone https://github.com/fussymonkey-dev/searxng-mcp-server
cd searxng-mcp-server

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Run locally
npm start

# Run tests
npm test
```

## Troubleshooting

**Connection errors?**
- Verify SearXNG is running: `curl http://localhost:8888`
- Check `SEARXNG_URL` environment variable
- Run health check: `npm run health-check`

**Timeout errors?**
- Increase `SEARXNG_TIMEOUT`
- Check SearXNG instance performance
- Reduce `max_results`

**Empty results?**
- Try different search categories
- Check SearXNG engine configuration
- Verify engines are enabled in SearXNG settings

## Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create a feature branch
3. Keep code clean, DRY, and KISS
4. Submit a PR

## License

MIT - See [LICENSE](LICENSE)

## Credits

Created by [FussyMonkey.dev](https://fussymonkey.dev)

Built with:
- [SearXNG](https://github.com/searxng/searxng) - Privacy-respecting metasearch engine
- [Model Context Protocol SDK](https://github.com/modelcontextprotocol/sdk) - MCP TypeScript SDK

---

**Questions or issues?** Open an issue on [GitHub](https://github.com/fussymonkey-dev/searxng-mcp-server/issues)
