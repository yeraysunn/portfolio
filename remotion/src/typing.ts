/**
 * Ritmo de tecleo. Un intervalo constante entre letras delata que es
 * una animación, así que cada tecla lleva su propio retardo: las
 * mayúsculas cuestan un shift, el espacio corta la palabra y el resto
 * flota alrededor de la media con un jitter determinista.
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

export type Keystroke = {
  /** Fotograma en el que aparece esta letra. */
  frame: number;
  char: string;
};

export const buildKeystrokes = (
  text: string,
  startFrame: number,
  seed = 0x5eed,
): Keystroke[] => {
  const rand = mulberry32(seed);
  const strokes: Keystroke[] = [];

  let cursor = startFrame;

  for (const char of text) {
    let delay = 4.4;

    if (char === ' ') {
      // Final de palabra: la mano se recoloca.
      delay = 9;
    } else if (char === char.toUpperCase() && char !== char.toLowerCase()) {
      // Mayúscula: hay un shift de por medio.
      delay = 7.5;
    }

    // ±45 % de variación para que no suene a metrónomo.
    delay *= 0.55 + rand() * 0.9;

    cursor += delay;
    strokes.push({frame: Math.round(cursor), char});
  }

  return strokes;
};

/** Cuántas letras se ven ya en el fotograma dado. */
export const visibleCount = (strokes: Keystroke[], frame: number): number => {
  let n = 0;
  for (const stroke of strokes) {
    if (stroke.frame <= frame) n++;
    else break;
  }
  return n;
};
