"use client";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial, RoundedBox, useTexture } from "@react-three/drei";
import { heroState } from "@/lib/heroState";

// The hero sculpture: a website taken apart in glass. A desktop screen of a real site, a refractive
// glass slab, and a glass phone carrying the same site. Scrolling down fans the layers apart like an
// exploded technical drawing; scrolling up plays it back. The pointer tilts the whole piece.

const { lerp, damp } = THREE.MathUtils;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

function Screen({ url, w, h, radius }: { url: string; w: number; h: number; radius: number }) {
  const tex = useTexture(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  // A rounded-rectangle plane so the screenshot has the same corners as its glass.
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    const x = -w / 2, y = -h / 2, r = radius;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    const g = new THREE.ShapeGeometry(s, 12);
    const uv = g.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) - x) / w, (uv.getY(i) - y) / h);
    return g;
  }, [w, h, radius]);
  return (
    <mesh geometry={geo}>
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

function Sculpture({ mobile }: { mobile: boolean }) {
  const group = useRef<THREE.Group>(null);
  const desk = useRef<THREE.Group>(null);
  const slab = useRef<THREE.Group>(null);
  const phone = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const p = useRef(0);

  // Fit: a little smaller on narrow screens, pushed right on desktop so the headline has room.
  const scale = mobile ? Math.min(0.72, viewport.width / 5.4) : Math.min(1.12, viewport.width / 9.5);
  const baseX = mobile ? 0 : viewport.width * 0.17;
  const baseY = mobile ? viewport.height * 0.3 : 0;

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    p.current = damp(p.current, heroState.progress, 6, d);
    const t = ease(p.current);
    const time = state.clock.elapsedTime;
    const g = group.current;
    if (!g || !desk.current || !slab.current || !phone.current || !ring.current) return;

    // Pointer parallax, lerped so it glides.
    g.rotation.y = lerp(g.rotation.y, -0.42 + heroState.pointerX * 0.22 + t * 0.55, 0.06);
    g.rotation.x = lerp(g.rotation.x, 0.08 - heroState.pointerY * 0.12 + t * 0.12, 0.06);
    g.position.y = baseY + Math.sin(time * 0.6) * 0.04 * (1 - t);

    // Exploded view: layers separate in depth and sideways as the film plays.
    desk.current.position.set(lerp(0, -0.45, t), lerp(0, 0.12, t), lerp(-0.25, -1.3, t));
    slab.current.position.set(lerp(0.15, 0.25, t), lerp(-0.05, -0.05, t), lerp(0.05, 0.1, t));
    slab.current.rotation.z = lerp(-0.04, 0.1, t);
    phone.current.position.set(lerp(1.15, 1.55, t), lerp(-0.42, -0.5, t), lerp(0.45, 1.05, t));
    phone.current.rotation.y = lerp(-0.18, -0.55, t);
    phone.current.rotation.z = lerp(0.05, -0.04, t);
    ring.current.rotation.x = time * 0.25 + t * 1.4;
    ring.current.rotation.y = time * 0.18;
    ring.current.position.set(lerp(-1.55, -1.8, t), lerp(-0.95, -1.05, t), lerp(0.6, 0.9, t));
  });

  return (
    <group ref={group} position={[baseX, baseY, 0]} scale={scale}>
      {/* Desktop screen with a thin glass bezel */}
      <group ref={desk}>
        <RoundedBox args={[3.4, 2.2, 0.06]} radius={0.06} smoothness={4}>
          <meshPhysicalMaterial color="#1a1a1f" roughness={0.25} metalness={0.6} clearcoat={1} clearcoatRoughness={0.1} />
        </RoundedBox>
        <group position={[0, 0, 0.035]}>
          <Screen url="/work/kaso-ervehe-desk.webp" w={3.28} h={2.05} radius={0.05} />
        </group>
      </group>

      {/* Refractive slab: the "glass" layer between design and device */}
      <group ref={slab}>
        <RoundedBox args={[2.5, 1.6, 0.16]} radius={0.08} smoothness={6}>
          {mobile ? (
            <meshPhysicalMaterial transmission={1} thickness={0.6} roughness={0.04} ior={1.45} iridescence={0.6} iridescenceIOR={1.3} color="#f1e9df" />
          ) : (
            <MeshTransmissionMaterial
              samples={6}
              resolution={512}
              thickness={0.55}
              roughness={0.03}
              ior={1.42}
              chromaticAberration={0.06}
              anisotropicBlur={0.12}
              distortion={0.18}
              distortionScale={0.4}
              temporalDistortion={0.06}
              iridescence={0.5}
              iridescenceIOR={1.25}
              color="#f3ece4"
              backside
            />
          )}
        </RoundedBox>
      </group>

      {/* Glass phone with the mobile version of the same site */}
      <group ref={phone}>
        <RoundedBox args={[0.82, 1.68, 0.1]} radius={0.1} smoothness={6}>
          <meshPhysicalMaterial color="#121216" roughness={0.18} metalness={0.7} clearcoat={1} />
        </RoundedBox>
        <group position={[0, 0, 0.055]}>
          <Screen url="/work/kaso-ervehe-phone.webp" w={0.74} h={1.6} radius={0.07} />
        </group>
        <RoundedBox args={[0.86, 1.72, 0.04]} radius={0.1} smoothness={6} position={[0, 0, 0.09]}>
          <meshPhysicalMaterial transmission={1} thickness={0.2} roughness={0.02} ior={1.5} clearcoat={1} color="#ffffff" transparent opacity={0.9} />
        </RoundedBox>
      </group>

      {/* A small copper ring: the one accent in the scene */}
      <mesh ref={ring}>
        <torusGeometry args={[0.32, 0.05, 32, 96]} />
        <meshPhysicalMaterial color="#cf8a5c" metalness={1} roughness={0.22} clearcoat={0.6} />
      </mesh>
    </group>
  );
}

// Studio lighting built from light panels, so nothing is fetched from a CDN at runtime.
function StudioLights() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer intensity={2.2} position={[0, 5, -2]} rotation-x={Math.PI / 2} scale={[10, 3, 1]} />
      <Lightformer intensity={1.4} position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[4, 6, 1]} />
      <Lightformer intensity={1.1} position={[5, 0.5, 2]} rotation-y={-Math.PI / 2} scale={[3, 5, 1]} color="#ffd9bf" />
      <Lightformer form="ring" intensity={1.6} position={[2, 2, 4]} scale={1.6} color="#e9efe9" />
      <Lightformer intensity={0.5} position={[0, -4, 0]} rotation-x={-Math.PI / 2} scale={[10, 10, 1]} color="#3c4a40" />
    </Environment>
  );
}

export default function HeroScene({ mobile, active, onReady }: { mobile: boolean; active: boolean; onReady: () => void }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={mobile ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6.2], fov: 32 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <StudioLights />
        <Sculpture mobile={mobile} />
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}

// Mounted inside Suspense, so it only runs once textures are in: then the poster can fade out.
function Ready({ onReady }: { onReady: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (!done.current) { done.current = true; requestAnimationFrame(() => requestAnimationFrame(onReady)); }
  });
  return null;
}
