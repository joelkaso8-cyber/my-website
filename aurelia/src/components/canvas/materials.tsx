"use client";
import { useMemo } from "react";
import * as THREE from "three";
import type { JSX } from "react";
import { Environment, Lightformer } from "@react-three/drei";

// Travertine drawn on a canvas: warm sand base, horizontal bedding bands and small elongated pores.
// Generated once in the browser, so the stone needs no image download.
export function useTravertine(repeat = 1) {
  return useMemo(() => {
    const size = 512;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const g = c.getContext("2d")!;
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

    g.fillStyle = "#e7ddcd";
    g.fillRect(0, 0, size, size);
    // Bedding bands
    for (let i = 0; i < 70; i++) {
      const y = rnd() * size;
      const h = 1 + rnd() * 9;
      const light = rnd() > 0.5;
      g.fillStyle = light ? `rgba(250,244,232,${0.06 + rnd() * 0.12})` : `rgba(168,148,120,${0.04 + rnd() * 0.08})`;
      g.beginPath();
      g.moveTo(0, y);
      for (let x = 0; x <= size; x += 32) g.lineTo(x, y + Math.sin(x * 0.01 + i) * 3 + (rnd() - 0.5) * 2);
      g.lineTo(size, y + h);
      g.lineTo(0, y + h);
      g.closePath();
      g.fill();
    }
    // Pores: the travertine holes, stretched along the bedding
    for (let i = 0; i < 900; i++) {
      const x = rnd() * size, y = rnd() * size;
      g.fillStyle = `rgba(120,100,78,${0.1 + rnd() * 0.25})`;
      g.beginPath();
      g.ellipse(x, y, 0.6 + rnd() * 3.6, 0.3 + rnd() * 0.9, 0, 0, Math.PI * 2);
      g.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat, repeat);
    tex.anisotropy = 8;
    return tex;
  }, [repeat]);
}

// Brushed brass: fine horizontal streaks used as a roughness map.
export function useBrushed() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256; c.height = 256;
    const g = c.getContext("2d")!;
    g.fillStyle = "#6a6a6a";
    g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 600; i++) {
      const v = 80 + Math.floor(Math.random() * 90);
      g.fillStyle = `rgb(${v},${v},${v})`;
      g.fillRect(Math.random() * 256, Math.random() * 256, 30 + Math.random() * 120, 1);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);
}

// Warm studio light from light panels: nothing is fetched from a CDN at runtime.
export function StudioLights({ warm = 1 }: { warm?: number }) {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer intensity={2.0} position={[0, 5, -2]} rotation-x={Math.PI / 2} scale={[10, 3, 1]} color="#fff4e6" />
      <Lightformer intensity={1.2 * warm} position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[4, 6, 1]} color="#ffd6a8" />
      <Lightformer intensity={1.0} position={[5, 0.5, 2]} rotation-y={-Math.PI / 2} scale={[3, 5, 1]} color="#f3efea" />
      <Lightformer form="ring" intensity={1.8 * warm} position={[2, 2, 4]} scale={1.4} color="#ffc98a" />
      {/* Soft warm panel behind the camera, so brass and glass catch light from the front */}
      <Lightformer intensity={0.9} position={[0, 0.5, 7]} scale={[8, 4, 1]} color="#ffe3bf" />
      <Lightformer intensity={0.5} position={[0, -4, 0]} rotation-x={-Math.PI / 2} scale={[10, 10, 1]} color="#5c422c" />
    </Environment>
  );
}

// A soft radial glow, like a low sun or a candle behind the object. Glass refracts it, so it never
// reads as black against the transparent canvas.
export function Glow({ color = "#e9b97a", opacity = 0.55, ...props }: { color?: string; opacity?: number } & JSX.IntrinsicElements["mesh"]) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.35, "rgba(255,255,255,0.45)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh {...props}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={tex} color={color} transparent opacity={opacity} depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}
