import type { NextConfig } from "next";

// NEXT_PUBLIC_BASE_PATH is injected by the GitHub Actions workflow.
// Locally it is empty, so the dev server and local builds work without a prefix.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",        // emit static HTML/CSS/JS to `out/`
  trailingSlash: true,     // /example-1  →  out/example-1/index.html
  basePath,                // /user-guide on GitHub Pages, empty locally
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,     // next/image optimization requires a server; not needed here
  },
};

export default nextConfig;
