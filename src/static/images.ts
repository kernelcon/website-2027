// Central image resolver replacing webpack's dynamic `require(`.../${name}`)`.
// Vite cannot do dynamic require, so we eagerly glob every image under
// static/images and expose lookups by relative subpath.

const modules = import.meta.glob("./images/**/*.{png,jpg,jpeg,JPG,JPEG,gif,svg,webp,avif,bmp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

// Build a map keyed by the path *relative to static/images*, e.g. "speakers/Foo.jpg".
const byRelPath: Record<string, string> = {};
for (const key in modules) {
  // keys look like "./images/speakers/Foo.jpg"
  const rel = key.replace(/^\.\/images\//, "");
  byRelPath[rel] = modules[key];
}

const PLACEHOLDER = "https://placehold.co/150x150?text=?";

/**
 * Resolve an image by its path relative to `static/images`.
 * @param relPath e.g. "speakers/Foo.jpg" or "logos/bar.png"
 */
export function img(relPath: string | undefined | null): string {
  if (!relPath) return PLACEHOLDER;
  const cleaned = relPath.replace(/^\/+/, "");
  return byRelPath[cleaned] ?? PLACEHOLDER;
}

/** Resolve an image living directly in a known subfolder. */
export function imgIn(folder: string, name: string | undefined | null): string {
  if (!name) return PLACEHOLDER;
  return img(`${folder}/${name}`);
}

export { PLACEHOLDER };
