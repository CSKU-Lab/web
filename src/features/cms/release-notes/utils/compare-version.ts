/**
 * Compare two `a.b.c` semver-ish strings numerically.
 * Pre-release / build tags are ignored (only the numeric core is compared).
 * Returns -1 if a < b, 1 if a > b, 0 if equal.
 */
export function compareVersion(a: string, b: string): number {
  const parse = (v: string) =>
    v
      .split("-")[0]
      .split(".")
      .map((n) => parseInt(n, 10) || 0);

  const pa = parse(a);
  const pb = parse(b);
  const len = Math.max(pa.length, pb.length);

  for (let i = 0; i < len; i++) {
    const da = pa[i] ?? 0;
    const db = pb[i] ?? 0;
    if (da > db) return 1;
    if (da < db) return -1;
  }
  return 0;
}
