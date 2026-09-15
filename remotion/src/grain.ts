/**
 * Grano de película pregenerado. Se crean N teselas con ruido y se
 * rotan por fotograma: el grano "hierve" como en película pero el
 * coste por fotograma es un solo drawImage en vez de pintar ruido
 * píxel a píxel.
 *
 * El PRNG lleva semilla fija a propósito: Remotion renderiza los
 * fotogramas en paralelo y todos tienen que ver las mismas teselas.
 */
const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const buildGrainTiles = (
  count: number,
  size: number,
): HTMLCanvasElement[] => {
  const rand = mulberry32(0x9e3779b9);

  return new Array(count).fill(0).map(() => {
    const tile = document.createElement('canvas');
    tile.width = size;
    tile.height = size;

    const ctx = tile.getContext('2d');
    if (!ctx) return tile;

    const image = ctx.createImageData(size, size);
    const data = image.data;

    for (let i = 0; i < data.length; i += 4) {
      // Ruido gaussiano aproximado (suma de dos uniformes): el grano
      // plano de un solo random() se ve digital, no fotoquímico.
      const n = ((rand() + rand()) / 2 - 0.5) * 2;
      const value = 128 + n * 110;
      data[i] = value;
      data[i + 1] = value;
      data[i + 2] = value;
      data[i + 3] = 255;
    }

    ctx.putImageData(image, 0, 0);
    return tile;
  });
};
