// window and document
export const body = document.body;
export const innerHeight = window.innerHeight;

// Accessibility
export const wantsReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// Width to change widow scrolling event for phone
export const respondWidth = 1408;
