const TAU = Math.PI * 2;

export type Projected = {
  x: number;
  y: number;
  /** Profundidad normalizada 0 (fondo) .. 1 (frente). */
  depth: number;
};

/**
 * Altura de la lámina de onda en el punto (u, v) del plano.
 *
 * u: -1 .. 1 a lo largo del eje largo de la cinta
 * v: -1 .. 1 en profundidad
 * t: fase del bucle, 0 .. TAU
 *
 * Son tres senos con frecuencias no múltiplas entre sí en `u` pero con
 * periodo entero en `t`, así que la animación cierra el bucle exacto
 * mientras la forma nunca se repite a lo largo de la cinta.
 */
export const surfaceHeight = (u: number, v: number, t: number): number => {
  const primary = Math.sin(TAU * (u * 0.78 + v * 0.3) + t);
  const secondary = 0.5 * Math.sin(TAU * (u * 1.34 - v * 0.42) - t * 2);
  const detail = 0.2 * Math.sin(TAU * (u * 2.6 + v * 0.16) + t * 3);
  return primary + secondary + detail;
};

/**
 * Envolvente en forma de lente: la cinta nace y muere en los bordes
 * del plano, que es lo que da la silueta de ojo de la referencia.
 */
export const lensEnvelope = (u: number): number => {
  const e = Math.cos((u * Math.PI) / 2);
  return e * e;
};

/**
 * Cámara casi a ras de la lámina. La compresión fuerte del eje de
 * profundidad es lo que convierte una malla plana en una cinta
 * horizontal en vez de una montaña.
 */
export const project = (
  u: number,
  v: number,
  surface: number,
  envelope: number,
  width: number,
  canvasHeight: number,
): Projected => {
  // Ligera perspectiva: lo cercano se abre, lo lejano se estrecha.
  const persp = 1 + v * 0.08;

  const x = width * 0.5 + (u * 0.99 + v * 0.06) * width * 0.52 * persp;

  // El grosor de la cinta también sigue la lente: fino en las puntas,
  // abierto en el centro. De ahí sale la silueta de ojo.
  const spread = v * canvasHeight * 0.135 * (0.18 + 0.82 * envelope);

  const y =
    canvasHeight * 0.5 -
    surface * canvasHeight * 0.115 +
    spread +
    // Inclinación mínima para que la composición no sea simétrica.
    u * canvasHeight * 0.018;

  return {x, y, depth: (v + 1) / 2};
};

export {TAU};
