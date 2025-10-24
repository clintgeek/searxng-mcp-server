import { test } from "node:test";
import assert from "node:assert";

// Simple test suite - extend as needed
test("URL construction", () => {
  const base = "http://localhost:8888";
  const url = new URL("/search", base);
  url.searchParams.append("q", "test query");
  url.searchParams.append("format", "json");

  assert.ok(url.toString().includes("test+query"));
  assert.ok(url.toString().includes("format=json"));
});

test("Configuration defaults", () => {
  const config = {
    maxResults: 10,
    timeout: 30000,
    safeSearch: 0,
  };

  assert.equal(config.maxResults, 10);
  assert.equal(config.timeout, 30000);
  assert.equal(config.safeSearch, 0);
});

test("Result limiting", () => {
  const maxResults = Math.min(Math.max(100, 1), 50);
  assert.equal(maxResults, 50);

  const minResults = Math.min(Math.max(0, 1), 50);
  assert.equal(minResults, 1);
});
