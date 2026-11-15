"use client";
import { Component, useEffect, useState, type ReactNode, type RefObject, createElement, Fragment } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

// Should a WebGL scene run here? Reduced motion, Data Saver or no WebGL keep the still image instead.
export function canRunScene() {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (prefersReducedMotion() || nav.connection?.saveData) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch { return false; }
}

// True while the element is on (or near) the screen, so canvases stop drawing when out of view.
export function useOnScreen(ref: RefObject<Element | null>, margin = "200px") {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return on;
}

// If WebGL throws, whatever sits underneath (poster, photo) simply stays.
export class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : createElement(Fragment, null, this.props.children); }
}
