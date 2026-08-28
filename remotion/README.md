# Animaciones del portfolio (Remotion)

Dos piezas: un fondo de onda de partículas y la animación del campo de
nombre. `npm run studio` las previsualiza las dos.

---

## Wave Light — fondo animado

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

---

## Name Field — tecleo con gravedad

Recreación del campo "Full name" en DOM real (nada de imágenes): la
etiqueta, el icono de persona en SVG, el borde verde de foco, el cursor
y el botón `+ Add`. Alguien escribe "Tony Stark" letra a letra mientras
la caja se balancea colgada de la gravedad.

```bash
npm run render:field    # out/name-field.mp4 (1920x1080, 30 fps, 8 s)
```

Dos detalles que sostienen la animación:

- **`src/physics.ts`** — péndulo amortiguado con impulsos. La caja cae al
  entrar, la gravedad la frena, y *cada pulsación le mete un empujón*
  lateral del que tiene que recuperarse. No hay ni una curva de easing
  escrita a mano: todo el movimiento sale de integrar la simulación.
  Se integra la línea de tiempo entera de golpe y se cachea, porque
  Remotion renderiza los fotogramas en paralelo y fuera de orden: un
  estado que dependiera del fotograma anterior daría saltos.
- **`src/typing.ts`** — el ritmo del tecleo. Un intervalo constante entre
  letras delata la animación, así que las mayúsculas cuestan un shift, el
  espacio corta la palabra y el resto lleva un jitter determinista.

La sombra reacciona a la altura y el cursor deja de parpadear mientras se
escribe, como en un editor real.

La fuente (Poppins) está autoalojada en `public/fonts/`: la versión de
Google Fonts depende de la red en cada render.

---

## Nota sobre el render

En un contenedor sin navegador propio, Remotion necesita un Chromium en
modo headless nuevo. Si falla el arranque:

```bash
REMOTION_BROWSER_EXECUTABLE=/ruta/a/chrome-headless-shell npm run render
```
