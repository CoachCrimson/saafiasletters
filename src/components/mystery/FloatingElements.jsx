import { useMemo } from 'react';

function Butterfly({ variant = 0 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M12 12C10 8 6 4 6 4C6 4 4 8 4 10C4 12 6 14 12 19C18 14 20 12 20 10C20 8 18 4 18 4C18 4 14 8 12 12Z" fill="currentColor" opacity={0.5 + variant * 0.15} />
      <path d="M12 12L12 19" stroke="currentColor" strokeWidth="0.5" opacity={0.7 + variant * 0.1} />
      <circle cx="12" cy="12" r="1" fill="currentColor" opacity={0.8 + variant * 0.1} />
    </svg>
  );
}

function Feather({ variant = 0 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M6 22C6 22 10 14 12 12C14 10 18 4 18 4C18 4 14 10 12 12C10 14 6 22 6 22Z" fill="currentColor" opacity={0.4 + variant * 0.2} />
      <path d="M12 12L18 4" stroke="currentColor" strokeWidth="0.5" opacity={0.5 + variant * 0.15} />
      <path d="M11 14L6 22" stroke="currentColor" strokeWidth="0.3" opacity={0.3 + variant * 0.15} />
    </svg>
  );
}

function Raven({ variant = 0 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M12 4C10 4 8 2 8 2C8 2 6 4 8 8C10 6 12 6 12 6C12 6 14 6 16 8C18 4 16 2 16 2C16 2 14 4 12 4Z" fill="currentColor" opacity={0.4 + variant * 0.2} />
      <path d="M8 8C6 10 4 12 4 12C4 12 5 10 6 10C7 10 8 9 8 8Z" fill="currentColor" opacity={0.3 + variant * 0.15} />
      <path d="M16 8C18 10 20 12 20 12C20 12 19 10 18 10C17 10 16 9 16 8Z" fill="currentColor" opacity={0.3 + variant * 0.15} />
      <path d="M12 6L12 4" stroke="currentColor" strokeWidth="0.3" opacity={0.4 + variant * 0.15} />
    </svg>
  );
}

function Moth() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M12 13C11 10 8 7 8 7C8 7 7 9 7 10.5C7 12.5 8.5 14 12 17C15.5 14 17 12.5 17 10.5C17 9 16 7 16 7C16 7 13 10 12 13Z" fill="currentColor" opacity="0.35" />
      <line x1="12" y1="13" x2="12" y2="17" stroke="currentColor" strokeWidth="0.4" opacity="0.5" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

function Spark() {
  return (
    <svg viewBox="0 0 8 8" fill="none" className="w-full h-full">
      <circle cx="4" cy="4" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="4" cy="4" r="3" fill="currentColor" opacity="0.1" />
    </svg>
  );
}

const TYPES = ['butterfly', 'butterfly', 'butterfly', 'raven', 'raven', 'feather', 'feather', 'moth', 'spark'];
const BUTTERFLY_COLORS = ['#c4b5fd', '#a78bfa', '#e9d5ff', '#fbcfe8', '#bfdbfe'];
const RAVEN_COLORS = ['#94a3b8', '#64748b', '#475569', '#cbd5e1'];
const FEATHER_COLORS = ['#d4c5a9', '#e2d5c1', '#c9b99a', '#b8a88a'];
const MOTH_COLORS = ['#cbd5e1', '#e2e8f0', '#94a3b8'];
const SPARK_COLORS = ['#fbbf24', '#fde68a', '#fcd34d', '#e2e8f0'];

function pickColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function generateElements() {
  const elements = [];
  const count = 30;

  for (let i = 0; i < count; i++) {
    const type = TYPES[Math.floor(Math.random() * TYPES.length)];
    const variant = Math.floor(Math.random() * 3);

    let size, duration, delay;
    let color;

    switch (type) {
      case 'butterfly':
        size = 16 + Math.random() * 28;
        duration = 6 + Math.random() * 10;
        delay = Math.random() * duration;
        color = pickColor(BUTTERFLY_COLORS);
        break;
      case 'raven':
        size = 24 + Math.random() * 32;
        duration = 10 + Math.random() * 16;
        delay = Math.random() * duration;
        color = pickColor(RAVEN_COLORS);
        break;
      case 'feather':
        size = 10 + Math.random() * 22;
        duration = 8 + Math.random() * 20;
        delay = Math.random() * duration;
        color = pickColor(FEATHER_COLORS);
        break;
      case 'moth':
        size = 12 + Math.random() * 18;
        duration = 5 + Math.random() * 12;
        delay = Math.random() * duration;
        color = pickColor(MOTH_COLORS);
        break;
      case 'spark':
        size = 4 + Math.random() * 8;
        duration = 3 + Math.random() * 6;
        delay = Math.random() * duration;
        color = pickColor(SPARK_COLORS);
        break;
      default:
        size = 16;
        duration = 10;
        delay = 0;
        color = '#94a3b8';
    }

    const left = Math.random() * 100;

    // Vary direction: some float up-right, some up-left, some straight up
    const xDrift = (Math.random() - 0.5) * 80;
    const yRise = 60 + Math.random() * 100;

    elements.push({
      id: i,
      type,
      variant,
      size,
      left,
      duration,
      delay,
      xDrift,
      yRise,
      color,
      opacity: type === 'spark' ? 0.2 + Math.random() * 0.3 : 0.12 + Math.random() * 0.28,
    });
  }
  return elements;
}

export default function FloatingElements() {
  const elements = useMemo(() => generateElements(), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((el) => {
        const animName = `float-${el.type}-${el.id}`;
        const driftName = `drift-${el.id}`;

        return (
          <div key={el.id}>
            <style>{`
              @keyframes ${animName} {
                0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); opacity: ${el.opacity * 0.5}; }
                20% { transform: translateY(-${el.yRise * 0.3}px) translateX(${el.xDrift * 0.4}px) rotate(${el.type === 'feather' ? '15deg' : '5deg'}); opacity: ${el.opacity}; }
                50% { transform: translateY(-${el.yRise * 0.65}px) translateX(${el.xDrift * 0.2}px) rotate(${el.type === 'feather' ? '-10deg' : '-3deg'}); opacity: ${el.opacity * 0.7}; }
                75% { transform: translateY(-${el.yRise * 0.85}px) translateX(${el.xDrift * 0.6}px) rotate(${el.type === 'feather' ? '25deg' : '8deg'}); opacity: ${el.opacity}; }
                100% { transform: translateY(-${el.yRise}px) translateX(${el.xDrift}px) rotate(${el.type === 'feather' ? '360deg' : '0deg'}); opacity: 0; }
              }
              @keyframes ${driftName} {
                0%, 100% { transform: translateX(0) scale(1); }
                33% { transform: translateX(${(Math.random() - 0.5) * 20}px) scale(1.05); }
                66% { transform: translateX(${(Math.random() - 0.5) * 20}px) scale(0.95); }
              }
            `}</style>
            <div
              className="absolute"
              style={{
                left: `${el.left}%`,
                bottom: '-10%',
                width: el.size,
                height: el.size,
                color: el.color,
                animation: `${animName} ${el.duration}s ${el.delay}s ease-in-out infinite, ${driftName} ${el.duration * 0.6}s ${el.delay + 0.5}s ease-in-out infinite`,
              }}
            >
              {el.type === 'butterfly' && <Butterfly variant={el.variant} />}
              {el.type === 'feather' && <Feather variant={el.variant} />}
              {el.type === 'raven' && <Raven variant={el.variant} />}
              {el.type === 'moth' && <Moth />}
              {el.type === 'spark' && <Spark />}
            </div>
          </div>
        );
      })}
    </div>
  );
}