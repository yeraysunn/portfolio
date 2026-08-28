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

const TEXT = 'Tony Stark';
const TYPING_START = 34;

const ui = {
  page: '#FFFFFF',
  label: '#3F3F46',
  border: '#E4E4E9',
  borderFocus: '#5BC48D',
  focusRing: 'rgba(91, 196, 141, 0.16)',
  icon: '#A1A1AA',
  value: '#18181B',
  helper: '#B4B4BC',
  addText: '#27272A',
  caret: '#18181B',
} as const;

/** Icono de persona del campo, redibujado como SVG. */
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

export const NameField: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const keystrokes = useMemo(() => buildKeystrokes(TEXT, TYPING_START), []);

  // La simulación completa se calcula una sola vez: Remotion renderiza
  // los fotogramas en paralelo, así que no puede haber estado acumulado
  // entre uno y el siguiente.
  const motion = useMemo(
    () =>
      simulate({
        frames: durationInFrames,
        fps,
        impulses: keystrokes.map((k) => k.frame),
      }),
    [durationInFrames, fps, keystrokes],
  );

  const {x, y, rotation} = motion[Math.min(frame, motion.length - 1)];

  const typed = visibleCount(keystrokes, frame);
  const value = TEXT.slice(0, typed);
  const lastStroke = keystrokes[typed - 1];
  const finished = typed === TEXT.length;

  // El campo recibe el foco justo antes de la primera letra.
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

  // La sombra responde a la altura: cuando la caja sube se separa del
  // fondo y la sombra se abre y se aclara.
  const lift = -y;
  const shadowBlur = 34 + lift * 0.55;
  const shadowY = 16 + lift * 0.32;
  const shadowAlpha = Math.max(0.03, 0.1 - lift * 0.0004);

  // Entrada: sube la opacidad mientras la caja aún está cayendo.
  const appear = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: ui.page,
        fontFamily: FONT_FAMILY,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 1500,
          opacity: appear,
          transform: `translate(${x}px, ${y}px) rotate(${rotation}rad)`,
          // El pivote está muy por encima del encuadre: la caja cuelga
          // de él, no gira sobre su propio centro.
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
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              border: `2.5px solid ${focus > 0.5 ? ui.borderFocus : ui.border}`,
              boxShadow: `0 ${shadowY}px ${shadowBlur}px rgba(24,24,27,${shadowAlpha})${
                focus > 0 ? `, 0 0 0 ${focus * 5}px ${ui.focusRing}` : ''
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
                  backgroundColor: ui.caret,
                  opacity: caretVisible ? 1 : 0,
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
              backgroundColor: '#FFFFFF',
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
          First and last name only - e.g. John Smith. Add as many people as you
          like.
        </div>
      </div>
    </AbsoluteFill>
  );
};
