import { cpSync, mkdirSync, existsSync, rmSync, writeFileSync } from "fs";
import { join, dirname, basename } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const apiSrc = join(root, "api");
const apiDest = join(dist, "api");

if (!existsSync(dist)) {
  console.error("dist/ missing — run vite build first");
  process.exit(1);
}

if (existsSync(apiDest)) rmSync(apiDest, { recursive: true, force: true });
cpSync(apiSrc, apiDest, {
  recursive: true,
  filter: (src) => {
    const name = basename(src);
    // skip sqlite runtime files
    if (name.endsWith(".sqlite") || name.endsWith(".sqlite-journal")) return false;
    return true;
  },
});

mkdirSync(join(apiDest, "data"), { recursive: true });
writeFileSync(join(apiDest, "data", ".gitkeep"), "");
console.log("Copied api/ → dist/api/");
