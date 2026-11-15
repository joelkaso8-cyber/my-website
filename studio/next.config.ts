import type { NextConfig } from "next";

// Static export: the site is plain files, so it deploys to Netlify or GitHub Pages with no server.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
