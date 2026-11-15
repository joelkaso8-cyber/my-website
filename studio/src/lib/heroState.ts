// Shared between the DOM (ScrollTrigger, pointer) and the WebGL loop. Plain mutable refs:
// useFrame reads them every frame without ever touching React state.
export const heroState = {
  progress: 0, // 0 at the top of the hero, 1 when its scroll film has played through
  pointerX: 0, // -1 .. 1
  pointerY: 0, // -1 .. 1
};
