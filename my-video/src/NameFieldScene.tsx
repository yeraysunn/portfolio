import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT_FAMILY} from './fonts';
import {simulate} from './physics';
import {buildKeystrokes, visibleCount} from './typing';

/**
 * Tarjeta "Full name" con borde grueso redondeado que entra como
 * péndulo, escribe "Tony Stark" letra a letra y cae hacia abajo.
 *
 * El borde pertenece a la tarjeta: toda la pieza (contenido + marco)
 * se mueve con la misma simulación física. El fondo del lienzo está
 * quieto; el `overflow: hidden` del AbsoluteFill recorta la caída.
 */

const TEXT = 'Tony Stark';
const TYPING_START = 34;
/** Fotograma en el que se corta el hilo y la tarjeta cae. */
const RELEASE = 150;

const ui = {
  backdrop: '#EBEBEF',
  surface: '#FFFFFF',
  /** Color del borde/marco de la tarjeta. */
  frame: '#18181B',
  label: '#3F3F46',
  border: '#E4E4E9',
  borderFocus: '#5BC48D',
  focusRing: 'rgba(91,196,141,0.18)',
  icon: '#A1A1AA',
  value: '#18181B',
  helper: '#B4B4BC',
  addText: '#27272A',
} as const;

const PersonIcon: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
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

  const {x, y, rotation, scale} = motion[Math.min(frame, motion.length - 1)];

  const typed = visibleCount(keystrokes, frame);
  const value = TEXT.slice(0, typed);
  const lastStroke = keystrokes[typed - 1];
  const finished = typed === TEXT.length;

  // ---------- luz / foco ------------------------------------------
  const focus = interpolate(frame, [TYPING_START - 12, TYPING_START - 2], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const lit = frame < RELEASE ? focus : 0;

  // ---------- cursor ----------------------------------------------
  const sinceLastKey = lastStroke ? frame - lastStroke.frame : -1;
  const idle = !lastStroke || sinceLastKey > 16;
  const blinkOn = Math.floor(frame / 16) % 2 === 0;
  const caretVisible = focus > 0.4 && (idle ? blinkOn : true) && frame < RELEASE;

  // ---------- sombra dinámica --------------------------------------
  // Mientras cuelga, la sombra crece cuando la tarjeta sube.
  const lift = Math.max(0, -y);
  const shadowY = 14 + lift * 0.3;
  const shadowBlur = 28 + lift * 0.5;
  const shadowAlpha = Math.max(0.04, 0.11 - lift * 0.0004);

  // ---------- entrada ----------------------------------------------
  const appear = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ---------- métricas de la tarjeta --------------------------------
  // Todo se expresa en fracción del ancho del lienzo para que el mismo
  // TSX sirva en 1080×1080 y en 1080×1920 sin cambiar nada.
  const cardW = width * 0.84;
  const pad = width * 0.044;            // padding interior
  const borderW = width * 0.016;        // grosor del marco
  const radius = width * 0.068;         // radio de la esquina

  // Unidades de los hijos en px directamente (no hay escala CSS)
  const u = cardW / 1000;              // 1 "unidad" = 1 px a 1000 de ancho
  const labelSize = u * 26;
  const fieldH = u * 108;
  const fieldRadius = u * 18;
  const iconSize = u * 30;
  const fieldPad = u * 34;
  const fieldGap = u * 24;
  const textSize = u * 36;
  const caretH = u * 40;
  const addW = u * 224;
  const addSize = u * 30;
  const helperSize = u * 22;
  const rowGap = u * 28;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: ui.backdrop,
        fontFamily: FONT_FAMILY,
        // El AbsoluteFill recorta la tarjeta cuando cae por abajo.
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/*
        Una sola div: el borde/marco ES la tarjeta.
        La transformación física se aplica aquí: todo el contenido
        (texto, inputs, helper) sigue al marco porque está dentro.
        El squeeze de cada tecla se aplica con scale() sobre el mismo
        elemento para que el encogimiento sea relativo a su propio centro.
      */}
      <div
        style={{
          width: cardW,
          flexShrink: 0,
          opacity: appear,
          padding: `${pad}px`,
          backgroundColor: ui.surface,
          border: `${borderW}px solid ${ui.frame}`,
          borderRadius: radius,
          boxShadow: `0 ${shadowY}px ${shadowBlur}px rgba(24,24,27,${shadowAlpha})`,
          // Primero la traslación / giro del péndulo, luego el squeeze
          // puntual de cada tecla. El orden importa: scale se aplica en
          // el sistema de coordenadas ya trasladado, así el centro del
          // encogimiento coincide con el centro visual de la tarjeta.
          transform: `translate(${x}px, ${y}px) rotate(${rotation}rad) scale(${scale})`,
        }}
      >
        {/* Etiqueta */}
        <div
          style={{
            fontSize: labelSize,
            fontWeight: 500,
            color: ui.label,
            letterSpacing: -0.2,
            marginBottom: pad * 0.7,
          }}
        >
          Full name - first and last only
        </div>

        {/* Fila: campo + botón */}
        <div style={{display: 'flex', gap: rowGap, alignItems: 'stretch'}}>
          {/* Campo de texto */}
          <div
            style={{
              flex: 1,
              height: fieldH,
              display: 'flex',
              alignItems: 'center',
              gap: fieldGap,
              paddingLeft: fieldPad,
              backgroundColor: ui.surface,
              borderRadius: fieldRadius,
              border: `2px solid ${lit > 0.5 ? ui.borderFocus : ui.border}`,
              boxShadow: lit > 0
                ? `0 0 0 ${lit * 5}px ${ui.focusRing}`
                : undefined,
            }}
          >
            <PersonIcon size={iconSize} />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: textSize,
                color: ui.value,
                letterSpacing: -0.2,
                whiteSpace: 'pre',
              }}
            >
              {value}
              <span
                style={{
                  display: 'inline-block',
                  width: 2,
                  height: caretH,
                  marginLeft: 2,
                  backgroundColor: ui.value,
                  opacity: caretVisible ? 1 : 0,
                }}
              />
            </div>
          </div>

          {/* Botón + Add */}
          <div
            style={{
              width: addW,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: u * 10,
              backgroundColor: ui.surface,
              borderRadius: fieldRadius,
              border: `2px solid ${ui.border}`,
              fontSize: addSize,
              fontWeight: 500,
              color: ui.addText,
              opacity: finished ? 1 : 0.65,
            }}
          >
            <span style={{fontSize: addSize * 1.15, fontWeight: 400}}>+</span>
            <span>Add</span>
          </div>
        </div>

        {/* Texto de ayuda */}
        <div
          style={{
            marginTop: pad * 0.55,
            fontSize: helperSize,
            color: ui.helper,
            letterSpacing: -0.1,
          }}
        >
          First and last name only - e.g. John Smith. Add as many people as you like.
        </div>
      </div>
    </AbsoluteFill>
  );
};
