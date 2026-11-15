// Shared between the DOM (ScrollTrigger, pointer) and the WebGL loops. Plain mutable values:
// useFrame reads them every frame without touching React state.
export const heroState = { progress: 0, pointerX: 0, pointerY: 0 };
export const decanterState = { progress: 0, course: 0 };
