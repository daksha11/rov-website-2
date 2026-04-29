const SAMPLE_DIM = 96;

function rgbToHex(r: number, g: number, b: number): string {
  const h = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`.toUpperCase();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawToCanvas(
  img: HTMLImageElement
): { ctx: CanvasRenderingContext2D; w: number; h: number } | null {
  const aspect = img.width / img.height || 1;
  const w = aspect >= 1 ? SAMPLE_DIM : Math.round(SAMPLE_DIM * aspect);
  const h = aspect >= 1 ? Math.round(SAMPLE_DIM / aspect) : SAMPLE_DIM;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, w, h);
  return { ctx, w, h };
}

export async function pickPixelFromLogo(
  src: string,
  nx: number,
  ny: number
): Promise<string | null> {
  try {
    const img = await loadImage(src);
    const drawn = drawToCanvas(img);
    if (!drawn) return null;
    const { ctx, w, h } = drawn;
    const x = Math.max(0, Math.min(w - 1, Math.round(nx * w)));
    const y = Math.max(0, Math.min(h - 1, Math.round(ny * h)));
    const [r, g, b, a] = Array.from(ctx.getImageData(x, y, 1, 1).data);
    if (a < 16) return null;
    return rgbToHex(r, g, b);
  } catch {
    return null;
  }
}

export async function extractDominantColors(
  src: string,
  count = 5
): Promise<string[]> {
  try {
    const img = await loadImage(src);
    const drawn = drawToCanvas(img);
    if (!drawn) return [];
    const { ctx, w, h } = drawn;
    const { data } = ctx.getImageData(0, 0, w, h);

    const buckets = new Map<number, { r: number; g: number; b: number; n: number }>();
    const STEP = 24;
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a < 200) continue;
      const r = data[i],
        g = data[i + 1],
        b = data[i + 2];
      const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      if (max < 24) continue;
      if (min > 235) continue;
      const key =
        Math.floor(r / STEP) * 1024 +
        Math.floor(g / STEP) * 32 +
        Math.floor(b / STEP);
      const cur = buckets.get(key);
      if (cur) {
        cur.r += r;
        cur.g += g;
        cur.b += b;
        cur.n += 1;
      } else {
        buckets.set(key, { r, g, b, n: 1 });
      }
    }

    const ranked = [...buckets.values()]
      .map((c) => ({
        r: c.r / c.n,
        g: c.g / c.n,
        b: c.b / c.n,
        n: c.n,
      }))
      .sort((a, b) => b.n - a.n);

    const kept: { r: number; g: number; b: number }[] = [];
    for (const c of ranked) {
      const dup = kept.some((k) => {
        const dr = k.r - c.r,
          dg = k.g - c.g,
          db = k.b - c.b;
        return Math.sqrt(dr * dr + dg * dg + db * db) < 50;
      });
      if (!dup) kept.push(c);
      if (kept.length >= count) break;
    }

    return kept.map((c) => rgbToHex(c.r, c.g, c.b));
  } catch {
    return [];
  }
}
