import {registerRoot} from 'remotion';
import {RemotionRoot} from './Root';

// Las fuentes se cargan antes de registrar la raíz: si no, el primer
// fotograma se captura con la tipografía de reserva.
import './fonts';

registerRoot(RemotionRoot);
