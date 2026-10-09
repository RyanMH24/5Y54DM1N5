import type { NextConfig } from "next";

// `npm run build:static` sets STATIC_EXPORT (and BASE_PATH) to emit a plain
// HTML/JS site in `out/` that can be hosted from a sub-folder, e.g. on GitHub
// Pages. Regular `dev`/`build` are unaffected.
const staticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  experimental: {
    useTypeScriptCli: false,
  },
  ...(staticExport && {
    output: "export",
    basePath,
    trailingSlash: true,
    images: { unoptimized: true },
  }),
};

export default nextConfig;
