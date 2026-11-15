import type { NextConfig } from "next";

// Static export: plain files that deploy to Netlify or GitHub Pages with no server.
// Photos come from images.unsplash.com. remotePatterns allows that host for next/image;
// the components use plain <img> with Unsplash's own resizing (w, q, auto=format), so no optimiser is needed.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com", pathname: "/**" }],
  },
};

export default nextConfig;
