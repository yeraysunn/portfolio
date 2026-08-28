# Wave Light — fondo animado (Remotion)

Campo de partículas con forma de cinta, iluminado por un foco que
recorre la escena de izquierda a derecha una vez cada bucle. Bucle
perfecto de 20 s: toda la animación depende de `frame / durationInFrames`,
así que el último fotograma enlaza con el primero sin corte.

## Uso

```bash
npm install
npm run studio    # previsualización interactiva
npm run render    # out/wave-light.mp4 (1920x1080, 30 fps, 20 s)
npm run still     # un fotograma suelto
```

## Composiciones

| id                | tamaño      | uso                          |
| ----------------- | ----------- | ---------------------------- |
| `WaveLight`       | 1920 × 1080 | hero / fondo apaisado        |
| `WaveLightSquare` | 1080 × 1080 | redes, tarjetas              |

## Dónde tocar el look

Casi todo el ajuste fino vive en `src/theme.ts`:

- `cool` / `warm` / `hot` — el degradado de color de sombra a luz.
- `light.sigma` — lo duro que es el filo brillante del foco.
- `light.haloSigma` / `haloStrength` — el halo violeta que lo rodea.
- `light.ambient` — cuánto se ve la cinta lejos del foco.
- `light.from` / `light.to` — el recorrido del barrido.
- `bloom` — el volumen de la luz.
- `grain` — intensidad del grano (`opacity` en luces, `shadowOpacity` en sombras).

La forma de la onda está en `src/wave.ts`: `surfaceHeight` (los tres senos),
`lensEnvelope` (la silueta de ojo) y `project` (el ángulo de cámara).

## Nota sobre el render

En un contenedor sin navegador propio, Remotion necesita un Chromium en
modo headless nuevo. Si falla el arranque:

```bash
REMOTION_BROWSER_EXECUTABLE=/ruta/a/chrome-headless-shell npm run render
```
