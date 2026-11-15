"use client";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { decanterState } from "@/lib/heroState";
import { Glow, StudioLights, useBrushed, useTravertine } from "./materials";

// A hand-blown glass decanter on a brass coaster and a travertine block. It turns with the scroll
// through the tasting menu, and the wine inside changes colour and level with each course's pairing.

const { damp } = THREE.MathUtils;

// Decanter silhouette as (radius, height) points, spun on a lathe.
const PROFILE: [number, number][] = [
  [0.0, -1.0], [0.62, -1.0], [0.9, -0.92], [1.02, -0.7], [1.0, -0.4], [0.86, -0.12],
  [0.56, 0.18], [0.27, 0.42], [0.2, 0.62], [0.19, 1.05], [0.23, 1.2], [0.27, 1.26],
];

function Decanter({ mobile, tints }: { mobile: boolean; tints: string[] }) {
  const group = useRef<THREE.Group>(null);
  const wine = useRef<THREE.Mesh>(null);
  const wineMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const p = useRef(0);
  const colors = useMemo(() => tints.map((c) => new THREE.Color(c)), [tints]);
  const stone = useTravertine(0.6);
  const brushed = useBrushed();
  const { viewport } = useThree();
  // Fit the decanter and its block inside the column, whatever its width.
  const fit = Math.min(mobile ? 0.62 : 0.78, viewport.width / 3.6, viewport.height / 4.4);

  const glassGeo = useMemo(() => new THREE.LatheGeometry(PROFILE.map(([r, y]) => new THREE.Vector2(r, y)), 96), []);
  // Wine fills the lower bulb, slightly inside the glass wall.
  const wineGeo = useMemo(() => {
    const pts = PROFILE.slice(0, 6).map(([r, y]) => new THREE.Vector2(Math.max(0, r - 0.05), y + 0.04));
    pts.push(new THREE.Vector2(0, -0.12 + 0.04));
    const g = new THREE.LatheGeometry(pts, 64);
    g.translate(0, 0.96, 0); // bottom at y = 0, so scaling the level keeps it on the glass floor
    return g;
  }, []);

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    p.current = damp(p.current, decanterState.progress, 4, d);
    const time = state.clock.elapsedTime;
    if (!group.current || !wine.current || !wineMat.current) return;
    group.current.rotation.y = p.current * Math.PI * 2.2 + time * 0.12;
    group.current.rotation.z = Math.sin(p.current * Math.PI) * 0.06;
    group.current.position.y = Math.sin(time * 0.7) * 0.03;
    // Level drops a little with each glass poured
    wine.current.scale.y = damp(wine.current.scale.y, 1 - decanterState.course * 0.12, 4, d);
    wineMat.current.color.lerp(colors[decanterState.course] ?? colors[0], 0.06);
    wineMat.current.attenuationColor.copy(wineMat.current.color);
  });

  return (
    <group scale={fit} position-y={0.15}>
      <Glow position={[0, 0.1, -2.5]} scale={5.5} opacity={0.5} color="#f0b878" />
      <group ref={group}>
        <mesh geometry={glassGeo}>
          {mobile ? (
            <meshPhysicalMaterial transmission={1} thickness={0.3} roughness={0.03} ior={1.5} color="#fffaf2" side={THREE.DoubleSide} />
          ) : (
            <MeshTransmissionMaterial samples={6} resolution={512} thickness={0.18} roughness={0.02} ior={1.5} chromaticAberration={0.06} anisotropicBlur={0.06} distortion={0.05} color="#fffaf2" backside />
          )}
        </mesh>
        <mesh ref={wine} geometry={wineGeo} position-y={-0.96} scale-y={1}>
          <meshPhysicalMaterial ref={wineMat} color={tints[0]} roughness={0.08} transmission={0.55} thickness={1.2} attenuationDistance={0.6} clearcoat={1} />
        </mesh>
      </group>
      {/* Brass coaster */}
      <mesh position-y={-1.04}>
        <cylinderGeometry args={[1.2, 1.24, 0.06, 96]} />
        <meshPhysicalMaterial color="#c8a97e" metalness={1} roughness={0.3} roughnessMap={brushed} clearcoat={0.4} />
      </mesh>
      {/* Travertine block */}
      <mesh position-y={-1.42}>
        <boxGeometry args={[2.7, 0.7, 2.7]} />
        <meshStandardMaterial map={stone} roughness={0.85} color="#e6d8c2" />
      </mesh>
    </group>
  );
}

export default function DecanterScene({ mobile, active, tints }: { mobile: boolean; active: boolean; tints: string[] }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={mobile ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.6, 6.4], fov: 30 }}
      onCreated={({ gl, camera }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        camera.lookAt(0, -0.2, 0);
      }}
      aria-hidden="true"
    >
      <directionalLight position={[-3, 4, 3]} intensity={1.2} color="#ffd9a8" />
      <Suspense fallback={null}>
        <StudioLights warm={1.3} />
        <Decanter mobile={mobile} tints={tints} />
      </Suspense>
    </Canvas>
  );
}
