// Copies deploy-time files into the build output for GitHub Pages.
import { copyFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const buildDir = path.join(root, "build");

// CNAME for the custom domain (kernelcon.org)
const cname = path.join(root, "CNAME");
if (existsSync(cname)) {
  copyFileSync(cname, path.join(buildDir, "CNAME"));
  console.log("[postbuild] copied CNAME -> build/CNAME");
} else {
  console.warn("[postbuild] CNAME not found at project root; skipping");
}
