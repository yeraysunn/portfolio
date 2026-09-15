import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {
  continueRender,
  delayRender,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {theme} from './theme';
import {buildGrainTiles} from './grain';
import {lensEnvelope, project, surfaceHeight, TAU} from './wave';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const mixColor = (
  a: readonly [number, number, number],
  b: readonly [number, number, number],
  t: number,
) =>
  [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t)),
  ] as const;

export const WaveLight: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grainTiles = useMemo(
    () => buildGrainTiles(theme.grain.tiles, theme.grain.size),
    [],
  );

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const {cols, rows} = theme.grid;
      const progress = frame / durationInFrames;
      const t = progress * TAU;

      // ---- Fondo -------------------------------------------------------
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.fillStyle = theme.background;
      ctx.fillRect(0, 0, width, height);

      // ---- Foco que barre de izquierda a derecha ------------------------
      const lightX = lerp(theme.light.from, theme.light.to, progress) * width;
      const sigma = theme.light.sigma * width;
      const halo = theme.light.haloSigma * width;

      // ---- Campo de partículas -----------------------------------------
      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < cols; i++) {
        const u = (i / (cols - 1)) * 2 - 1;
        const envelope = lensEnvelope(u);

        // Fuera de la lente no hay cinta que dibujar.
        if (envelope <= 0.001) continue;

        for (let j = 0; j < rows; j++) {
          const v = (j / (rows - 1)) * 2 - 1;

          const h = surfaceHeight(u, v, t) * envelope;
          const {x, y, depth} = project(u, v, h, envelope, width, height);

          if (x < -40 || x > width + 40 || y < -40 || y > height + 40) continue;

          // Distancia al foco -> cuánta luz recibe este punto.
          // Dos gaussianas: el filo duro que marca la cresta y un halo
          // ancho que mantiene el violeta vivo a su alrededor.
          const d = (x - lightX) / sigma;
          const dh = (x - lightX) / halo;
          const beam = Math.exp(-d * d);
          const glow = Math.exp(-dh * dh);
          const lit = Math.min(
            1,
            theme.light.ambient +
              theme.light.haloStrength * glow +
              (1 - theme.light.ambient) * beam,
          );

          // Los bordes de la lente se disuelven, el centro tiene cuerpo.
          const body = Math.pow(envelope, 0.75);

          // La profundidad separa los planos: el fondo cae en intensidad.
          const depthFade = 0.35 + 0.65 * depth;

          const intensity = lit * body * depthFade;
          if (intensity < 0.012) continue;

          // Un solo gradiente de color de frío -> cálido -> blanco lila.
          const color =
            intensity < 0.55
              ? mixColor(theme.cool, theme.warm, intensity / 0.55)
              : mixColor(theme.warm, theme.hot, (intensity - 0.55) / 0.45);

          const alpha = Math.min(1, intensity * 0.85);
          const size = depth > 0.72 && beam > 0.35 ? 2 : 1.35;

          ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${alpha})`;
          ctx.fillRect(x, y, size, size);
        }
      }

      // ---- Bloom -------------------------------------------------------
      // Copia desenfocada del propio lienzo sumada encima. Es lo que
      // convierte los puntos sueltos en luz con volumen.
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = theme.bloom.strength;
      ctx.filter = `blur(${theme.bloom.blur}px)`;
      ctx.drawImage(ctx.canvas, 0, 0);
      ctx.filter = 'none';
      ctx.globalAlpha = 1;

      // ---- Viñeta ------------------------------------------------------
      ctx.globalCompositeOperation = 'source-over';
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.15,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75,
      );
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(0.62, 'rgba(0,0,0,0.28)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.82)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      // ---- Grano -------------------------------------------------------
      const tile = grainTiles[frame % grainTiles.length];
      if (tile) {
        const pattern = ctx.createPattern(tile, 'repeat');
        if (pattern) {
          ctx.fillStyle = pattern;

          // Dos pasadas. `overlay` da el grano en las zonas iluminadas
          // pero respeta el negro, así que las sombras quedarían planas:
          // la segunda pasada aditiva es la que les pone textura.
          ctx.globalCompositeOperation = 'overlay';
          ctx.globalAlpha = theme.grain.opacity;
          ctx.fillRect(0, 0, width, height);

          ctx.globalCompositeOperation = 'lighter';
          ctx.globalAlpha = theme.grain.shadowOpacity;
          ctx.fillRect(0, 0, width, height);

          ctx.globalAlpha = 1;
          ctx.globalCompositeOperation = 'source-over';
        }
      }
    },
    [frame, durationInFrames, width, height, grainTiles],
  );

  // El fotograma no está listo hasta que el canvas está pintado.
  const handle = useMemo(() => delayRender(`wave-frame-${frame}`), [frame]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      draw(ctx);
    }
    continueRender(handle);
  }, [draw, handle]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{width: '100%', height: '100%', display: 'block'}}
    />
  );
};
