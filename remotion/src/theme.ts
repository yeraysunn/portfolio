/**
 * Paleta y parámetros de la escena. Todo en un sitio para poder
 * afinar el look sin tocar la matemática de la onda.
 */
export const theme = {
  // Fondo casi negro con una pizca de violeta, no negro puro:
  // el negro puro mata el degradado del bloom.
  background: '#05030a',

  // Color del campo de partículas en reposo -> color bajo el foco de luz.
  cool: [104, 56, 214] as const,
  warm: [186, 158, 255] as const,
  hot: [240, 233, 255] as const,

  grid: {
    cols: 460,
    rows: 150,
  },

  light: {
    // Foco duro: el filo brillante que recorre la cresta.
    sigma: 0.11,
    // Halo ancho: mantiene el violeta vivo alrededor del foco.
    haloSigma: 0.42,
    haloStrength: 0.34,
    // Recorre la escena de izquierda a derecha una vez por bucle.
    // Empieza y acaba fuera de plano para que el bucle no dé un salto.
    from: -0.35,
    to: 1.35,
    // Luz base: sin ella la cinta desaparece cuando el foco está lejos.
    ambient: 0.34,
  },

  bloom: {
    blur: 26,
    strength: 0.6,
  },

  grain: {
    tiles: 8,
    size: 320,
    opacity: 0.14,
    // Elevación mínima de los negros para que la sombra no quede plana.
    shadowOpacity: 0.03,
  },
} as const;
