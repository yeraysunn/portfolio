/**
 * Péndulo amortiguado con impulsos, y caída libre al final.
 *
 * La caja cuelga de un punto por encima del encuadre. Cae al entrar,
 * la gravedad la frena y la devuelve, y cada tecla le mete un empujón
 * que la vuelve a descolocar. En `release` se corta el hilo y solo
 * queda la gravedad. Todo el movimiento sale de aquí: no hay ni una
 * curva de easing escrita a mano.
 *
 * La simulación devuelve ya la transformación lista para pintar
 * (desplazamiento + giro sobre el centro de la caja) en vez del estado
 * crudo del péndulo. Es deliberado: colgada, el giro tiene que arrastrar
 * la caja de lado porque pivota lejos; suelta, tiene que voltear sobre
 * sí misma y bajar recta. Resolver eso con un `transform-origin` fijo
 * en el CSS no se puede — o vale para una fase o para la otra.
 *
 * Se integra la línea de tiempo entera de una vez y se cachea. Remotion
 * renderiza los fotogramas en paralelo y fuera de orden, así que un
 * estado que dependa del fotograma anterior no serviría.
 */
export type PhysicsState = {
  /** Desplazamiento horizontal en px. */
  x: number;
  /** Desplazamiento vertical en px (negativo = arriba). */
  y: number;
  /** Giro sobre el centro de la caja, en radianes. */
  rotation: number;
};

export type PhysicsOptions = {
  frames: number;
  fps: number;
  /** Fotogramas en los que llega un impulso (las pulsaciones). */
  impulses: number[];
  /**
   * Fotograma en el que se corta el hilo. A partir de ahí desaparecen
   * los muelles y solo queda caída libre: la caja se va por abajo.
   */
  release?: number;
};

const SUBSTEPS = 8;

// --- Fase colgada ---------------------------------------------------
// Longitud del hilo imaginario. Cuanto más largo, más lento el vaivén.
const LENGTH = 2.6;
const GRAVITY = 9.81;

const ANGLE_DAMPING = 1.15;
const BOB_STIFFNESS = 42;
const BOB_DAMPING = 5.2;
const DRIFT_STIFFNESS = 26;
const DRIFT_DAMPING = 4.4;

/** Distancia en px al punto del que cuelga la caja. */
const PIVOT = 900;
/**
 * Cuánto del ángulo del péndulo se ve como giro. Por debajo de 1 la
 * caja se mantiene más horizontal de lo que le tocaría, que es lo que
 * la hace parecer pesada en vez de un cartel al viento.
 */
const TILT = 0.42;

// --- Caída libre ----------------------------------------------------
// No es la g real: es la que saca la caja de plano en menos de un
// segundo, que es lo que dura el plano.
const FREE_FALL = 2900;
/** Tirón del hilo al romperse, en rad/s. */
const SNAP = 0.18;
/** Par residual al caer, para que se voltee suavemente. */
const TUMBLE = 0.22;

export const simulate = ({
  frames,
  fps,
  impulses,
  release,
}: PhysicsOptions): PhysicsState[] => {
  const dt = 1 / (fps * SUBSTEPS);
  const impulseSet = new Set(impulses);

  // Estado del péndulo: la caja entra desde arriba y algo ladeada.
  let angle = -0.055;
  let angleVel = 0;
  let y = -150;
  let yVel = 0;
  let x = 0;
  let xVel = 0;

  // Estado de la caída, que arranca en el momento del corte.
  let fallX = 0;
  let fallY = 0;
  let fallVel = 0;
  let spin = 0;
  let spinVel = 0;
  let driftVel = 0;

  const out: PhysicsState[] = [];

  for (let frame = 0; frame < frames; frame++) {
    const released = release !== undefined && frame >= release;

    if (frame === release) {
      // Se congela la posición que tenía colgada y desde ahí cae.
      fallX = x + PIVOT * Math.sin(angle);
      fallY = y + PIVOT * (1 - Math.cos(angle));
      spin = angle * TILT;
      spinVel = SNAP;
      // Descartamos casi toda la deriva horizontal: la caja tiene que
      // caer principalmente hacia abajo. Un rastro mínimo la hace
      // parecer física sin irse de plano.
      driftVel = xVel * 0.08;
    }

    if (impulseSet.has(frame) && !released) {
      // El dedo golpea la tecla: la caja se va hacia un lado y baja.
      // El signo alterna para que el balanceo no se acumule siempre
      // hacia la misma dirección.
      const dir = frame % 2 === 0 ? 1 : -1;
      angleVel += dir * 0.1;
      yVel += 26;
      xVel += dir * 5;
    }

    for (let s = 0; s < SUBSTEPS; s++) {
      if (released) {
        // Hilo cortado: ya no hay nada que devuelva la caja a su sitio.
        // Solo gravedad, la deriva que llevase y un volteo suave.
        fallVel += FREE_FALL * dt;
        fallY += fallVel * dt;
        spinVel += TUMBLE * dt;
        spin += spinVel * dt;
        fallX += driftVel * dt;
        continue;
      }

      const t = (frame + s / SUBSTEPS) / fps;

      // Corriente de aire: un par mínimo que nunca deja el plano quieto.
      const ambient =
        0.1 * Math.sin(t * 0.71) + 0.06 * Math.sin(t * 1.27 + 1.1);

      const angleAcc =
        -(GRAVITY / LENGTH) * Math.sin(angle) -
        ANGLE_DAMPING * angleVel +
        ambient;
      angleVel += angleAcc * dt;
      angle += angleVel * dt;

      const yAcc = -BOB_STIFFNESS * y - BOB_DAMPING * yVel;
      yVel += yAcc * dt;
      y += yVel * dt;

      const xAcc = -DRIFT_STIFFNESS * x - DRIFT_DAMPING * xVel;
      xVel += xAcc * dt;
      x += xVel * dt;
    }

    out.push(
      released
        ? {x: fallX, y: fallY, rotation: spin}
        : {
            // Colgada, el giro arrastra la caja de lado: pivota lejos,
            // así que el ángulo se traduce a desplazamiento.
            x: x + PIVOT * Math.sin(angle),
            y: y + PIVOT * (1 - Math.cos(angle)),
            rotation: angle * TILT,
          },
    );
  }

  return out;
};
