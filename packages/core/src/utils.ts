export type Vector2 = { x: number; y: number };

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const rand = (min: number, max: number) => Math.random() * (max - min) + min;

export const chance = (p: number) => Math.random() < p;

export function withBasePath(path: string, basePath: string) {
  if (!basePath || basePath === "/") return path;
  const normalizedBase = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${suffix}`;
}
