#!/usr/bin/env node

const SEARXNG_URL = process.env.SEARXNG_URL || "http://localhost:8888";

async function healthCheck() {
  console.log(`Checking SearXNG at ${SEARXNG_URL}...`);

  try {
    const response = await fetch(`${SEARXNG_URL}/healthz`);

    if (response.ok) {
      console.log("✓ SearXNG is running");
      return true;
    }

    // Try search endpoint as fallback
    const searchUrl = new URL("/search", SEARXNG_URL);
    searchUrl.searchParams.append("q", "test");
    searchUrl.searchParams.append("format", "json");

    const searchResponse = await fetch(searchUrl.toString());

    if (searchResponse.ok) {
      console.log("✓ SearXNG is running (search endpoint responded)");
      return true;
    }

    console.error("✗ SearXNG returned error:", searchResponse.status);
    return false;
  } catch (error) {
    console.error("✗ Cannot connect to SearXNG:", error.message);
    console.error("\nTroubleshooting:");
    console.error("1. Verify SearXNG is running");
    console.error("2. Check SEARXNG_URL is correct");
    console.error("3. Try: docker run -d -p 8888:8080 searxng/searxng");
    return false;
  }
}

healthCheck().then((ok) => process.exit(ok ? 0 : 1));
