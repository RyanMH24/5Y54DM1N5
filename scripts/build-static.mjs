// Builds a static copy of the site into `out/`, served from BASE_PATH.
// Defaults to the sub-folder used on the portfolio's GitHub Pages site.
import { spawnSync } from "node:child_process";

const basePath = process.env.BASE_PATH ?? "/Ryan-M.-Hernandez-Portfolio/5y54dm1n5";

const result = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, STATIC_EXPORT: "1", BASE_PATH: basePath },
});

process.exit(result.status ?? 1);
