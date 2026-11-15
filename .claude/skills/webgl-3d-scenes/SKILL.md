---
name: webgl-3d-scenes
description: Build 60fps interactive Three.js and React Three Fiber scenes, glossy procedural 3D sculptures, GLB model loaders, and mouse-parallax camera/object lerping.
---

# WebGL 3D scenes (React Three Fiber)

Use this for any Three.js centrepiece. Reference: `studio/src/components/canvas/HeroScene.tsx` and how
`studio/src/components/sections/Hero.tsx` mounts it.

## The 3D must show something concrete
Joel rejects abstract or unclear 3D (a low-poly valley map was "too unclear"). The sculpture should read as
the subject at a glance: the product, the place, the client's website on a device, a recognisable object.

## Isolation and loading
- One scene per file in `components/canvas/`, starting with `"use client"`.
- Mount it with `next/dynamic(() => import(...), { ssr: false })` from a client section, after the poster and
  headline have painted (small `setTimeout`, longer on phones).
- Skip the canvas entirely (poster stays) when: reduced motion, `navigator.connection.saveData`, or no WebGL:
  ```ts
  const c = document.createElement("canvas"); const ok = !!(c.getContext("webgl2") || c.getContext("webgl"));
  ```
- Wrap it in an error boundary that renders `null`, so a GPU failure leaves the poster.
- Fade the canvas in only after its first frame (a `<Ready>` child inside `<Suspense>` calls `onReady` from `useFrame`).

```tsx
<Canvas
  dpr={mobile ? [1, 1.5] : [1, 2]}
  gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
  camera={{ position: [0, 0, 6.2], fov: 32 }}
  frameloop={onScreen ? "always" : "never"}   // IntersectionObserver on the section
  onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; }}
  aria-hidden="true"
>
  <Suspense fallback={null}><StudioLights /><Sculpture /><Ready onReady={onReady} /></Suspense>
</Canvas>
```

## 60fps rules
- Never call `setState` inside `useFrame`. Mutate refs (`mesh.current.rotation.y = …`).
- Share DOM → WebGL values through a plain module object, not React state:
  ```ts
  export const heroState = { progress: 0, pointerX: 0, pointerY: 0 };
  window.addEventListener("pointermove", (e) => { heroState.pointerX = e.clientX / innerWidth * 2 - 1; … }, { passive: true });
  ```
- Clamp delta: `const d = Math.min(dt, 0.05)`. Smooth with `THREE.MathUtils.damp(cur, target, 6, d)` (frame-rate
  independent) or `lerp(cur, target, 0.06)`.
- Memoise geometries and materials (`useMemo`), reuse textures, keep draw calls low, no per-frame allocation
  (`new THREE.Vector3()` belongs outside `useFrame`).
- At most one `MeshTransmissionMaterial` (it re-renders the scene); use `meshPhysicalMaterial` with
  `transmission` on phones and for secondary glass.
- Consider drei `<PerformanceMonitor>` to drop dpr on weak GPUs; pause offscreen with `frameloop="never"`.

## Mouse parallax
```ts
useFrame((_, dt) => {
  g.rotation.y = lerp(g.rotation.y, -0.42 + heroState.pointerX * 0.22 + t * 0.55, 0.06);
  g.rotation.x = lerp(g.rotation.x, 0.08 - heroState.pointerY * 0.12, 0.06);
  camera.position.x = lerp(camera.position.x, heroState.pointerX * 0.3, 0.05); // optional camera drift
});
```
Keep angles small (under ~15°). Fit to the viewport: `const { viewport } = useThree()`; scale and offset the
group so the headline column stays clear (push right on desktop, up on phones).

## Studio lighting without network
`<Environment preset="studio" />` downloads an HDR from a CDN at runtime. Prefer a Lightformer rig:
```tsx
<Environment resolution={256} frames={1}>
  <Lightformer intensity={2.2} position={[0, 5, -2]} rotation-x={Math.PI / 2} scale={[10, 3, 1]} />
  <Lightformer intensity={1.4} position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[4, 6, 1]} />
  <Lightformer intensity={1.1} position={[5, 0.5, 2]} rotation-y={-Math.PI / 2} scale={[3, 5, 1]} color="#ffd9bf" />
  <Lightformer form="ring" intensity={1.6} position={[2, 2, 4]} scale={1.6} />
</Environment>
```
If an HDR is wanted, put it in `/public/hdr/` and use `<Environment files="/hdr/studio.hdr" />`.

## Procedural sculptures (when no .glb is provided)
Never leave a broken asset. Build from primitives:
- **Refractive glass:** `RoundedBox` + `MeshTransmissionMaterial` (`thickness 0.5, roughness 0.03, ior 1.42,
  chromaticAberration 0.06, anisotropicBlur 0.12, distortion 0.18, iridescence 0.5, backside`).
- **Polished metal:** `meshPhysicalMaterial` (`metalness 1, roughness 0.2, clearcoat 0.6`) in the accent colour.
- **Screens / images:** a rounded `ShapeGeometry` with UVs remapped to 0..1 and `meshBasicMaterial map={tex} toneMapped={false}`,
  textures from `useTexture` with `colorSpace = SRGBColorSpace`.
- Others: `torusKnotGeometry`, `icosahedronGeometry` with vertex noise, `ExtrudeGeometry` from a logo `Shape`,
  `TubeGeometry` along a `CatmullRomCurve3` for ribbons.
- Scroll-driven "exploded view": interpolate each layer's position/rotation with an eased `progress` (`1 - (1 - p)^3`).

## GLB models
```tsx
import { useGLTF } from "@react-three/drei";
function Model(props: JSX.IntrinsicElements["group"]) {
  const { scene } = useGLTF("/models/object.glb");   // Draco: useGLTF(url, true)
  return <primitive object={scene} {...props} />;
}
useGLTF.preload("/models/object.glb");
```
Compress with `npx gltf-transform optimize in.glb out.glb --compress draco --texture-compress webp`; target
under 1.5 MB on desktop, a lighter file for phones. Keep the procedural version as the Suspense fallback.

## Poster and checks
- Render a still of the scene (Playwright screenshot with the text hidden) to `/public/hero-poster.webp` and a
  phone crop `hero-poster-m.webp`; it sits under the canvas with `fetchpriority="high"`.
- Test: desktop and 375px, reduced motion (no canvas, poster visible), scroll down and back up (scene reverses),
  tab away and back (no runaway frames), `npm run build` with zero errors.
