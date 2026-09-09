# M7 Lounge — web

Sitio estático de una sola página (Salou y Tarragona).

## Publicar

**GitHub Pages:** sube todo el contenido de esta carpeta a la raíz del repositorio y activa Pages (Settings → Pages → Deploy from branch → `main` / `/root`). El archivo `.nojekyll` ya está incluido.

**Dominio propio (yeraysun.com):** Settings → Pages → Custom domain, y en tu DNS un registro CNAME apuntando a `<usuario>.github.io`.

**Hosting clásico:** sube la carpeta por FTP al directorio público (`public_html`).

## Estructura

- `index.html` — la página
- `support.js`, `image-slot.js` — runtime necesario
- `assets/` — fotos optimizadas
- `uploads/` — vídeos (cabecera y galería) y fotos de cócteles
- `_ds/` — hoja de estilos base

## Notas

- Los vídeos van silenciados y en bucle (requisito de los navegadores para autoplay).
- Los mapas son iframes de Google Maps: necesitan conexión.
- Reservas: enlaces a WhatsApp +34 682 078 809.
