/**
 * Péndulo amortiguado con impulsos.
 *
 * La caja cuelga de un punto por encima del encuadre. Cae al entrar,
 * la gravedad la frena y la devuelve, y cada tecla le mete un empujón
 * lateral que la vuelve a descolocar. Todo el movimiento sale de aquí:
 * no hay ni una curva de easing escrita a mano.
 *
 * Se integra la línea de tiempo entera de una vez y se cachea. Remotion
 * renderiza los fotogramas en paralelo y fuera de orden, así que un
 * estado que dependa del fotograma anterior no serviría.
 */
export type PhysicsState = {
  /** Ángulo de balanceo en radianes. */
  angle: number;
  /** Desplazamiento vertical en px (negativo = arriba). */
  y: number;
  /** Deriva horizontal en px. */
  x: number;
};

export type PhysicsOptions = {
  frames: number;
  fps: number;
  /** Fotogramas en los que llega un impulso (las pulsaciones). */
  impulses: number[];
};

const SUBSTEPS = 8;

// Longitud del hilo imaginario. Cuanto más largo, más lento el vaivén.
const LENGTH = 2.6;
const GRAVITY = 9.81;

const ANGLE_DAMPING = 1.15;
const BOB_STIFFNESS = 42;
const BOB_DAMPING = 5.2;
const DRIFT_STIFFNESS = 26;
const DRIFT_DAMPING = 4.4;

export const simulate = ({frames, fps, impulses}: PhysicsOptions): PhysicsState[] => {
  const dt = 1 / (fps * SUBSTEPS);
  const impulseSet = new Set(impulses);

  // Estado inicial: la caja entra desde arriba y ligeramente ladeada.
  let angle = -0.055;
  let angleVel = 0;
  let y = -150;
  let yVel = 0;
  let x = 0;
  let xVel = 0;

  const out: PhysicsState[] = [];

  for (let frame = 0; frame < frames; frame++) {
    if (impulseSet.has(frame)) {
      // El dedo golpea la tecla: la caja se va hacia un lado y baja.
      // El signo alterna para que el balanceo no se acumule siempre
      // hacia la misma dirección.
      const dir = frame % 2 === 0 ? 1 : -1;
      angleVel += dir * 0.1;
      yVel += 26;
      xVel += dir * 5;
    }

    for (let s = 0; s < SUBSTEPS; s++) {
      const t = (frame + s / SUBSTEPS) / fps;

      // Corriente de aire: un par mínimo que nunca deja el plano quieto.
      const ambient =
        0.10 * Math.sin(t * 0.71) + 0.06 * Math.sin(t * 1.27 + 1.1);

      const angleAcc =
        -(GRAVITY / LENGTH) * Math.sin(angle) - ANGLE_DAMPING * angleVel + ambient;
      angleVel += angleAcc * dt;
      angle += angleVel * dt;

      const yAcc = -BOB_STIFFNESS * y - BOB_DAMPING * yVel;
      yVel += yAcc * dt;
      y += yVel * dt;

      const xAcc = -DRIFT_STIFFNESS * x - DRIFT_DAMPING * xVel;
      xVel += xAcc * dt;
      x += xVel * dt;
    }

    out.push({angle, y, x});
  }

  return out;
};
