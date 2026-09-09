# Sustituir la home de yeraysun.com (repo yeraysunn/portfolio)

Tu repo sirve desde la RAIZ. La home actual es `index.html` (tu CV) y las
subpaginas son `biografia.html`, `estudios.html`, `idiomas.html`,
`experiencia.html`, `ia.html`, que usan `uploads/` y `_ds/classical-.../`.

Por eso este paquete usa `m7-assets/` y `m7-uploads/`: NO pisa nada de lo que
ya tienes. Lo unico que se sustituye es `index.html`, y antes se renombra a
`cv.html` para poder volver atras en 30 segundos.

## Contenido
- `index.html`      -> nueva home
- `m7-assets/`      -> imagenes de galeria y poster
- `m7-uploads/`     -> fotos y videos

## Para revertir
Renombra `cv.html` de nuevo a `index.html` en GitHub. Vercel redespliega solo.
