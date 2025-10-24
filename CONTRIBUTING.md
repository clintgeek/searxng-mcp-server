# Contributing

Thanks for your interest in improving SearXNG MCP Server!

## Guidelines

- **Keep it simple** - KISS principle
- **DRY code** - Don't repeat yourself
- **Readable** - Code should be self-documenting
- **Tested** - Add tests for new features
- **Clean commits** - Clear, concise commit messages

## Development

1. Fork and clone the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Test: `npm test`
5. Commit: `git commit -m "Add: feature description"`
6. Push: `git push origin feature/my-feature`
7. Open a Pull Request

## Code Style

- ES modules (not CommonJS)
- Async/await (not callbacks)
- Descriptive variable names
- JSDoc comments for functions
- No unnecessary dependencies

## Testing

```bash
npm test
npm run health-check
```

Test with a real MCP client before submitting.

## Questions?

Open an issue for discussion before major changes.
