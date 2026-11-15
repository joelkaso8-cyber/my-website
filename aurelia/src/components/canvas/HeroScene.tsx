"use client";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import { heroState } from "@/lib/heroState";
import { Glow, StudioLights, useBrushed, useTravertine } from "./materials";

// The hero sculpture reads as the hotel itself: two travertine arches on a stepped stone plinth, a glass
// pavilion standing inside them, and a brushed-brass sun behind. Scrolling down plays a short film:
// the camera walks in through the arch and turns, the stone courses lift apart like a drawing of how
// the house is built, and the sun sinks behind the wall. Scrolling up plays it back.

const { lerp, damp } = THREE.MathUtils;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

// Arch wall: a stone slab with a round-headed opening, drawn as one outline and extruded.
function archGeometry(w: number, h: number, ow: number, depth: number) {
  const s = new THREE.Shape();
  const r = ow / 2;
  const spring = h / 2 - r - h * 0.14;
  s.moveTo(-w / 2, -h / 2);
  s.lineTo(-r, -h / 2);
  s.lineTo(-r, spring);
  s.absarc(0, spring, r, Math.PI, 0, true);
  s.lineTo(r, -h / 2);
  s.lineTo(w / 2, -h / 2);
  s.lineTo(w / 2, h / 2);
  s.lineTo(-w / 2, h / 2);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3, curveSegments: 48 });
  g.translate(0, 0, -depth / 2);
  return g;
}

function Sculpture({ mobile }: { mobile: boolean }) {
  const group = useRef<THREE.Group>(null);
  const archA = useRef<THREE.Mesh>(null);
  const archB = useRef<THREE.Mesh>(null);
  const glass = useRef<THREE.Group>(null);
  const sun = useRef<THREE.Mesh>(null);
  const steps = useRef<(THREE.Mesh | null)[]>([]);
  const p = useRef(0);
  const { viewport, camera } = useThree();

  const stone = useTravertine(0.42);
  const brushed = useBrushed();
  const arch = useMemo(() => archGeometry(1.9, 2.7, 1.0, 0.34), []);

  const scale = mobile ? Math.min(0.62, viewport.width / 6) : Math.min(0.92, viewport.width / 11.5);
  const baseX = mobile ? 0 : viewport.width * 0.24;
  const baseY = mobile ? viewport.height * 0.26 : -0.1;

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    p.current = damp(p.current, heroState.progress, 5, d);
    const t = ease(p.current);
    const time = state.clock.elapsedTime;
    const g = group.current;
    if (!g || !archA.current || !archB.current || !glass.current || !sun.current) return;

    // Pointer parallax plus the scroll turn
    g.rotation.y = lerp(g.rotation.y, -0.55 + heroState.pointerX * 0.16 + t * 0.85, 0.06);
    g.rotation.x = lerp(g.rotation.x, 0.06 - heroState.pointerY * 0.08 + t * 0.05, 0.06);
    g.position.y = baseY + Math.sin(time * 0.5) * 0.035 * (1 - t);

    // Camera walks in towards the arch
    camera.position.z = lerp(camera.position.z, lerp(7.4, 5.2, t), 0.12);
    camera.position.x = lerp(camera.position.x, heroState.pointerX * 0.25, 0.05);
    camera.position.y = lerp(camera.position.y, lerp(0.2, -0.1, t) - heroState.pointerY * 0.12, 0.05);
    camera.lookAt(baseX * 0.35, baseY * 0.6, 0);

    // Exploded build drawing: courses lift apart, arches open in depth
    steps.current.forEach((m, i) => { if (m) m.position.y = -1.48 - i * 0.16 - t * (i + 1) * 0.12; });
    archA.current.position.set(lerp(-0.35, -0.75, t), 0, lerp(0.4, 0.75, t));
    archB.current.position.set(lerp(0.45, 0.85, t), lerp(0.12, 0.3, t), lerp(-0.55, -1.1, t));
    glass.current.position.set(lerp(0.05, 0.05, t), lerp(-0.62, -0.32, t), lerp(-0.05, 0.15, t));
    glass.current.rotation.y = lerp(0.35, -0.2, t) + Math.sin(time * 0.4) * 0.03;

    // The sun sets behind the back wall
    sun.current.position.set(lerp(0.9, 1.15, t), lerp(1.15, -0.55, t), -1.6);
  });

  return (
    <group ref={group} position={[baseX, baseY, 0]} scale={scale}>
      {/* Stepped stone plinth */}
      {[3.6, 3.2, 2.8].map((w, i) => (
        <mesh key={w} ref={(m) => { steps.current[i] = m; }} position={[0.05, -1.48 - i * 0.16, 0]} receiveShadow>
          <boxGeometry args={[w, 0.14, w * 0.62]} />
          <meshStandardMaterial map={stone} roughness={0.82} color={i === 0 ? "#f4ede2" : "#e9dfcf"} />
        </mesh>
      ))}

      {/* Front and back travertine arches */}
      <mesh ref={archA} geometry={arch}>
        <meshStandardMaterial map={stone} roughness={0.78} color="#f6efe4" />
      </mesh>
      <mesh ref={archB} geometry={arch} scale={0.86}>
        <meshStandardMaterial map={stone} roughness={0.8} color="#e4d8c6" />
      </mesh>

      {/* Glass pavilion: a sunlit room of glass with a brass frame line */}
      <group ref={glass}>
        <RoundedBox args={[0.95, 1.55, 0.95]} radius={0.05} smoothness={5}>
          {mobile ? (
            <meshPhysicalMaterial transmission={1} thickness={0.8} roughness={0.05} ior={1.45} color="#fff6ea" iridescence={0.3} />
          ) : (
            <MeshTransmissionMaterial
              samples={6}
              resolution={512}
              thickness={0.7}
              roughness={0.04}
              ior={1.42}
              chromaticAberration={0.05}
              anisotropicBlur={0.1}
              distortion={0.12}
              distortionScale={0.35}
              temporalDistortion={0.04}
              color="#fff3e2"
              backside
            />
          )}
        </RoundedBox>
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[1.02, 0.04, 1.02]} />
          <meshPhysicalMaterial color="#c8a97e" metalness={1} roughness={0.35} roughnessMap={brushed} clearcoat={0.3} />
        </mesh>
      </group>

      {/* Brushed-brass sun */}
      <mesh ref={sun} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.62, 0.62, 0.05, 96]} />
        <meshPhysicalMaterial color="#c8a97e" metalness={0.75} roughness={0.38} roughnessMap={brushed} clearcoat={0.5} emissive="#8a6a3c" emissiveIntensity={0.55} />
      </mesh>
      {/* Evening glow behind the arches */}
      <Glow position={[0.6, 0.6, -2.2]} scale={6.5} opacity={0.32} />
    </group>
  );
}

export default function HeroScene({ mobile, active, onReady }: { mobile: boolean; active: boolean; onReady: () => void }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={mobile ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.2, 7.4], fov: 32 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.0;
      }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.15} color="#ffe2bd" />
      <directionalLight position={[-3, 4, 3]} intensity={1.4} color="#ffd9a8" />
      <Suspense fallback={null}>
        <StudioLights />
        <Sculpture mobile={mobile} />
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}

function Ready({ onReady }: { onReady: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (!done.current) { done.current = true; requestAnimationFrame(() => requestAnimationFrame(onReady)); }
  });
  return null;
}
