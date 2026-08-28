import {loadFont} from '@remotion/fonts';
import {continueRender, delayRender, staticFile} from 'remotion';

/**
 * Poppins autoalojada. La versión de Google Fonts depende de la red en
 * cada render; estos dos ficheros viven en el repo, así que el
 * resultado es idéntico en cualquier máquina.
 *
 * El delayRender retiene la captura hasta que la fuente está lista: sin
 * él, los primeros fotogramas salen con la tipografía de reserva y el
 * texto baila de ancho a mitad del vídeo.
 */
export const FONT_FAMILY = 'Poppins';

const handle = delayRender('cargando Poppins');

Promise.all([
  loadFont({
    family: FONT_FAMILY,
    url: staticFile('fonts/poppins-400.woff2'),
    weight: '400',
    format: 'woff2',
  }),
  loadFont({
    family: FONT_FAMILY,
    url: staticFile('fonts/poppins-500.woff2'),
    weight: '500',
    format: 'woff2',
  }),
])
  .then(() => continueRender(handle))
  .catch(() => continueRender(handle));
