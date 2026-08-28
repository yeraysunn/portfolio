import React, {useMemo} from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {FONT_FAMILY} from './fonts';
import {simulate} from './physics';
import {buildKeystrokes, visibleCount} from './typing';

/**
 * El campo "Full name" dentro de un marco redondeado, escribiéndose
 * letra a letra y cayéndose al final.
 *
 * La escena se adapta al lienzo: la tarjeta está diseñada a un ancho
 * fijo y se escala al hueco interior del marco, así que la misma pieza
 * sirve en cuadrado y en vertical sin tocar una sola medida.
 */

const TEXT = 'Tony Stark';
const TYPING_START = 34;
/** Fotograma en el que se corta el hilo y la caja se va por abajo. */
const RELEASE = 150;

/** Ancho al que están pensadas todas las medidas de la tarjeta. */
const CARD_WIDTH = 1500;

const ui = {
  /** Fuera del marco. */
  backdrop: '#E8E8EC',
  /** Dentro del marco. */
  surface: '#FFFFFF',
  frame: '#17171B',
  label: '#3F3F46',
  border: '#E4E4E9',
  borderFocus: '#5BC48D',
  focusRing: 'rgba(91, 196, 141, 0.16)',
  icon: '#A1A1AA',
  value: '#18181B',
  helper: '#B4B4BC',
  addText: '#27272A',
} as const;

const PersonIcon: React.FC = () => (
  <svg width={33} height={33} viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="7.6" r="3.9" stroke={ui.icon} strokeWidth={1.7} />
    <path
      d="M4.6 20.2c0-3.7 3.3-6.1 7.4-6.1s7.4 2.4 7.4 6.1"
      stroke={ui.icon}
      strokeWidth={1.7}
      strokeLinecap="round"
    />
  </svg>
);

export const NameFieldScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, durationInFrames} = useVideoConfig();

  const keystrokes = useMemo(() => buildKeystrokes(TEXT, TYPING_START), []);

  // La simulación completa se calcula una sola vez. Remotion renderiza
  // los fotogramas en paralelo y fuera de orden, así que no puede haber
  // estado acumulado entre uno y el siguiente.
  const motion = useMemo(
    () =>
      simulate({
        frames: durationInFrames,
        fps,
        impulses: keystrokes.map((k) => k.frame),
        release: RELEASE,
      }),
    [durationInFrames, fps, keystrokes],
  );

  const {x, y, rotation} = motion[Math.min(frame, motion.length - 1)];

  const typed = visibleCount(keystrokes, frame);
  const value = TEXT.slice(0, typed);
  const lastStroke = keystrokes[typed - 1];
  const finished = typed === TEXT.length;

  // --- Marco -----------------------------------------------------------
  // Todo se deriva del ancho del lienzo, así que el marco conserva sus
  // proporciones tanto en 1080x1080 como en 1080x1920.
  const inset = width * 0.038;
  const borderWidth = width * 0.0145;
  const radius = width * 0.062;
  const innerWidth = width - inset * 2 - borderWidth * 2;

  // La tarjeta ocupa el 92 % del hueco: el aire a los lados es lo que
  // hace que el marco se lea como marco y no como recorte.
  const scale = (innerWidth * 0.92) / CARD_WIDTH;

  // --- Campo -----------------------------------------------------------
  const focus = interpolate(
    frame,
    [TYPING_START - 12, TYPING_START - 2],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

  // Mientras se escribe el cursor va fijo, como en un editor real.
  // Solo parpadea cuando la mano se detiene.
  const sinceLastKey = lastStroke ? frame - lastStroke.frame : -1;
  const idle = !lastStroke || sinceLastKey > 16;
  const blinkOn = Math.floor(frame / 16) % 2 === 0;
  const caretVisible = focus > 0.4 && (idle ? blinkOn : true);

  // El foco se pierde en el momento en que la caja se suelta.
  const lit = frame < RELEASE ? focus : 0;

  // La sombra responde a la altura: cuando la caja sube se separa del
  // fondo y la sombra se abre y se aclara.
  const lift = -y;
  const shadowBlur = 34 + lift * 0.55;
  const shadowY = 16 + lift * 0.32;
  const shadowAlpha = Math.max(0.03, 0.1 - lift * 0.0004);

  const appear = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{backgroundColor: ui.backdrop, fontFamily: FONT_FAMILY}}
    >
      <div
        style={{
          position: 'absolute',
          inset,
          backgroundColor: ui.surface,
          border: `${borderWidth}px solid ${ui.frame}`,
          borderRadius: radius,
          // Recorta la caída: la caja no se desvanece, se va por debajo
          // del borde del marco.
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 ${width * 0.02}px ${width * 0.06}px rgba(23,23,27,0.14)`,
        }}
      >
        {/*
          El escalado y el péndulo van en capas distintas a propósito.
          El pivote del péndulo está muy por encima de la caja, y escalar
          respecto a ese mismo punto arrastraría la tarjeta fuera del
          centro del marco. Fuera se escala, dentro se balancea.
        */}
        <div
          style={{
            width: CARD_WIDTH,
            flex: 'none',
            transform: `scale(${scale})`,
          }}
        >
          <div
            style={{
              opacity: appear,
              // La simulación ya entrega coordenadas resueltas: colgada
              // arrastra la posición desde el pivote lejano; suelta rota
              // sobre el centro de la caja. No hacen falta transform-origin
              // especiales: aquí siempre es el centro.
              transform: `translate(${x}px, ${y}px) rotate(${rotation}rad)`,
            }}
          >
            <div
              style={{
                fontSize: 27,
                fontWeight: 500,
                color: ui.label,
                letterSpacing: -0.1,
                marginBottom: 20,
              }}
            >
              Full name - first and last only
            </div>

            <div style={{display: 'flex', gap: 30, alignItems: 'stretch'}}>
              <div
                style={{
                  flex: 1,
                  height: 118,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 26,
                  paddingLeft: 38,
                  backgroundColor: ui.surface,
                  borderRadius: 20,
                  border: `2.5px solid ${lit > 0.5 ? ui.borderFocus : ui.border}`,
                  boxShadow: `0 ${shadowY}px ${shadowBlur}px rgba(24,24,27,${shadowAlpha})${
                    lit > 0 ? `, 0 0 0 ${lit * 5}px ${ui.focusRing}` : ''
                  }`,
                }}
              >
                <PersonIcon />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 38,
                    color: ui.value,
                    letterSpacing: -0.2,
                    whiteSpace: 'pre',
                  }}
                >
                  {value}
                  <span
                    style={{
                      display: 'inline-block',
                      width: 2.5,
                      height: 44,
                      marginLeft: 2,
                      backgroundColor: ui.value,
                      opacity: caretVisible && frame < RELEASE ? 1 : 0,
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  width: 250,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  backgroundColor: ui.surface,
                  borderRadius: 20,
                  border: `2.5px solid ${ui.border}`,
                  boxShadow: `0 ${shadowY}px ${shadowBlur}px rgba(24,24,27,${shadowAlpha})`,
                  fontSize: 33,
                  fontWeight: 500,
                  color: ui.addText,
                  // El botón se activa cuando el campo ya tiene un nombre
                  // completo: antes no hay nada que añadir.
                  opacity: finished ? 1 : 0.72,
                }}
              >
                <span style={{fontSize: 38, fontWeight: 400}}>+</span>
                <span>Add</span>
              </div>
            </div>

            <div
              style={{
                marginTop: 22,
                fontSize: 25,
                color: ui.helper,
                letterSpacing: -0.1,
              }}
            >
              First and last name only - e.g. John Smith. Add as many people as
              you like.
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
