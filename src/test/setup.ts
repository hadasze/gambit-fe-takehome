import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// Explicit since vitest's `globals` option is off (test files import
// describe/it/expect themselves) — without this, each test's render()
// output would pile up in the DOM instead of being torn down.
afterEach(cleanup);

// @xyflow/react (used by the Graph component) measures its container with
// ResizeObserver, which jsdom doesn't implement. A no-op stub is enough for
// it to mount and render in tests without an actual layout engine.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
}
