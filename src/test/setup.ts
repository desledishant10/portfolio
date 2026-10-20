// Registers jest-dom's matchers (toBeInTheDocument, toHaveAttribute, ...) on
// Vitest's expect, and augments the types.
import '@testing-library/jest-dom/vitest'

// jsdom does not implement scrollIntoView; stub it so components that call it
// (e.g. the command palette keeping its active option in view) do not throw.
// Guarded for the node-environment tests, where there is no DOM.
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {}
}
