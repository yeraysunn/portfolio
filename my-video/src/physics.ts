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
  /**
   * Escala instantánea 0–1. Baja a ~0.96 en el golpe de cada tecla y
   * rebota a 1. Permite animar un "squeeze" sin cálculos extra fuera.
   */
  scale: number;
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
const FREE_FALL = 3400;
/** Tirón del hilo al romperse, en rad/s. Más alto = giro más brusco al inicio. */
const SNAP = 0.32;
/** Par residual al caer: controla cuánto se voltea la caja mientras baja. */
const TUMBLE = 0.48;
/** Fracción de velocidad horizontal que se hereda al soltarse. */
const DRIFT_INHERIT = 0.08;

// --- Squeeze de tecla -----------------------------------------------
// Cuando llega un impulso la escala baja en un pulso corto y rebota.
const SQUEEZE_AMOUNT = 0.038;  // cuánto encoge (0.038 → min scale 0.962)
const SQUEEZE_DECAY  = 14;     // fotogramas hasta que la escala vuelve a 1

export const simulate = ({
  frames,
  fps,
  impulses,
  release,
}: PhysicsOptions): PhysicsState[] => {
  const dt = 1 / (fps * SUBSTEPS);
  const impulseSet = new Set(impulses);

  // Estado del péndulo: la caja entra desde más arriba y con más ladeo
  // para que el primer balanceo sea más visible.
  let angle = -0.14;
  let angleVel = 0.07;     // empujón inicial → sale balanceando desde el primer frame
  let y = -240;
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

  // Squeeze: rastro de los últimos impulsos para calcular la escala.
  // Guardamos el fotograma de cada impulso y superponemos todos los
  // pulsos activos (en la práctica no se solapan porque el tipeo es lento).
  const impulseFrames: number[] = [];

  const out: PhysicsState[] = [];

  for (let frame = 0; frame < frames; frame++) {
    const released = release !== undefined && frame >= release;

    if (frame === release) {
      // Congelamos la posición colgada y desde ahí cae.
      fallX = x + PIVOT * Math.sin(angle);
      fallY = y + PIVOT * (1 - Math.cos(angle));
      spin = angle * TILT;
      spinVel = SNAP;
      // Solo heredamos una fracción pequeña de la deriva horizontal.
      driftVel = xVel * DRIFT_INHERIT;
    }

    if (impulseSet.has(frame) && !released) {
      // El dedo golpea la tecla: la caja se va hacia un lado y baja.
      // El signo alterna para que el balanceo no se acumule en un solo lado.
      const dir = frame % 2 === 0 ? 1 : -1;
      angleVel += dir * 0.13;
      yVel     += 32;
      xVel     += dir * 6;
      impulseFrames.push(frame);
    }

    for (let s = 0; s < SUBSTEPS; s++) {
      if (released) {
        fallVel  += FREE_FALL * dt;
        fallY    += fallVel  * dt;
        spinVel  += TUMBLE   * dt;
        spin     += spinVel  * dt;
        fallX    += driftVel * dt;
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
      angle    += angleVel * dt;

      const yAcc = -BOB_STIFFNESS * y - BOB_DAMPING * yVel;
      yVel += yAcc * dt;
      y    += yVel * dt;

      const xAcc = -DRIFT_STIFFNESS * x - DRIFT_DAMPING * xVel;
      xVel += xAcc * dt;
      x    += xVel * dt;
    }

    // Squeeze: superponemos todos los pulsos recientes.
    let squeeze = 0;
    for (const kf of impulseFrames) {
      const age = frame - kf;
      if (age >= 0 && age < SQUEEZE_DECAY) {
        const t = age / SQUEEZE_DECAY;
        // Decaimiento en forma de seno: pico al inicio, regresa suave.
        squeeze += SQUEEZE_AMOUNT * Math.sin(t * Math.PI);
      }
    }
    const scale = released ? 1 : 1 - squeeze;

    out.push(
      released
        ? {x: fallX, y: fallY, rotation: spin, scale: 1}
        : {
            x: x + PIVOT * Math.sin(angle),
            y: y + PIVOT * (1 - Math.cos(angle)),
            rotation: angle * TILT,
            scale,
          },
    );
  }

  return out;
};
