import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement ResizeObserver; stub it so components that use it
// (e.g. CurriculumPath) can mount in tests. No layout to observe in jsdom
// anyway, so a no-op is sufficient.
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
