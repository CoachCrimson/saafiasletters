import { useMemo } from 'react';

function Butterfly({ variant = 0 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M12 12C10 8 6 4 6 4C6 4 4 8 4 10C4 12 6 14 12 19C18 14 20 12 20 10C20 8 18 4 18 4C18 4 14 8 12 12Z" fill="currentColor" opacity={0.6 + variant * 0.15} />
      <path d="M12 12L12 19" stroke="currentColor" strokeWidth="0.5" opacity={0.8 + variant * 0.1} />
      <circle cx="12" cy="12" r="1" fill="currentColor" opacity={0.9 + variant * 0.05} />
    </svg>
  );
}

function Feather({ variant = 0 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M6 22C6 22 10 14 12 12C14 10 18 4 18 4C18 4 14 10 12 12C10 14 6 22 6 22Z" fill="currentColor" opacity={0.5 + variant * 0.18} />
      <path d="M12 12L18 4" stroke="currentColor" strokeWidth="0.5" opacity={0.6 + variant * 0.15} />
      <path d="M11 14L6 22" stroke="currentColor" strokeWidth="0.3" opacity={0.4 + variant * 0.15} />
    </svg>
  );
}

function Moon({ variant = 0 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M20 12A8 8 0 0 1 6.46 6.46A8 8 0 1 0 20 12Z" fill="currentColor" opacity={0.5 + variant * 0.2} />
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="0.4" opacity={0.25 + variant * 0.1} />
    </svg>
  );
}

function Snake({ variant = 0 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path
        d="M3 14C3 14 5 8 7 10C9 12 8 16 6 16C4 16 3 14 3 14ZM6 16C6 16 8 18 10 16C12 14 11 10 13 10C15 10 17 16 19 14C21 12 20 8 19 8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity={0.55 + variant * 0.2}
      />
      <circle cx="19" cy="8" r="2.2" fill="currentColor" opacity={0.7 + variant * 0.15} />
      <circle cx="19" cy="8" r="0.8" fill={variant === 0 ? '#ef4444' : '#f87171'} opacity="0.85" />
    </svg>
  );
}

function Moth() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M12 13C11 10 8 7 8 7C8 7 7 9 7 10.5C7 12.5 8.5 14 12 17C15.5 14 17 12.5 17 10.5C17 9 16 7 16 7C16 7 13 10 12 13Z" fill="currentColor" opacity="0.45" />
      <line x1="12" y1="13" x2="12" y2="17" stroke="currentColor" strokeWidth="0.4" opacity="0.55" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" opacity="0.75" />
    </svg>
  );
}

const BUTTERFLY_COLORS = ['#c4b5fd', '#a78bfa', '#e9d5ff', '#fbcfe8', '#bfdbfe', '#ddd6fe'];
const FEATHER_COLORS = ['#d4c5a9', '#e2d5c1', '#c9b99a', '#b8a88a', '#a3967a'];
const MOON_COLORS = ['#fde68a', '#fbbf24', '#e2e8f0', '#cbd5e1', '#fed7aa'];
const SNAKE_COLORS = ['#6ee7b7', '#34d399', '#2dd4bf', '#818cf8', '#a78bfa', '#67e8f9'];
const MOTH_COLORS = ['#cbd5e1', '#e2e8f0', '#94a3b8', '#f1f5f9'];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateElements() {
  const elements = [];
  const count = 40;

  for (let i = 0; i < count; i++) {
    const roll = Math.random();
    let type, size, duration, delay, color, variant;

    if (roll < 0.20) {
      // Falling feather — start top, drift down
      type = 'feather';
      size = 10 + Math.random() * 26;
      duration = 10 + Math.random() * 20;
      delay = Math.random() * duration;
      color = pick(FEATHER_COLORS);
      variant = Math.floor(Math.random() * 3);
    } else if (roll < 0.42) {
      // Butterfly — gentle float
      type = 'butterfly';
      size = 16 + Math.random() * 28;
      duration = 8 + Math.random() * 16;
      delay = Math.random() * duration;
      color = pick(BUTTERFLY_COLORS);
      variant = Math.floor(Math.random() * 3);
    } else if (roll < 0.62) {
      // Moon — slow rotation drift
      type = 'moon';
      size = 14 + Math.random() * 22;
      duration = 12 + Math.random() * 18;
      delay = Math.random() * duration;
      color = pick(MOON_COLORS);
      variant = Math.floor(Math.random() * 3);
    } else if (roll < 0.82) {
      // Snake — horizontal slither
      type = 'snake';
      size = 18 + Math.random() * 30;
      duration = 9 + Math.random() * 14;
      delay = Math.random() * duration;
      color = pick(SNAKE_COLORS);
      variant = Math.floor(Math.random() * 3);
    } else {
      // Moth — gentle flutter
      type = 'moth';
      size = 10 + Math.random() * 18;
      duration = 7 + Math.random() * 14;
      delay = Math.random() * duration;
      color = pick(MOTH_COLORS);
      variant = 0;
    }

    const left = Math.random() * 94;
    const topStart = type === 'feather' ? -(8 + Math.random() * 30) : 15 + Math.random() * 75;
    const xDrift = (Math.random() - 0.5) * 120;
    const rotation = type === 'feather' ? 180 + Math.random() * 540 : (Math.random() - 0.5) * 40;

    elements.push({
      id: i,
      type,
      variant,
      size,
      left,
      topStart,
      duration,
      delay,
      xDrift,
      rotation,
      color,
      opacity: type === 'moon' ? 0.35 + Math.random() * 0.3 : 0.3 + Math.random() * 0.35,
    });
  }
  return elements;
}

export default function FloatingElements() {
  const elements = useMemo(() => generateElements(), []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {elements.map((el) => {
        const anim = `fe-${el.id}`;
        const drift = `fd-${el.id}`;
        const isFeather = el.type === 'feather';
        const isSnake = el.type === 'snake';

        return (
          <div key={el.id}>
            <style>{`
              @keyframes ${anim} {
                0% {
                  transform: translateY(0) translateX(0) rotate(0deg);
                  opacity: ${isFeather ? 0 : el.opacity};
                }
                ${isFeather ? '10% { opacity: ' + el.opacity + '; }' : ''}
                ${isSnake
                  ? `25% { transform: translateX(${el.xDrift * 0.3}px) translateY(${el.topStart > 40 ? '-10px' : '10px'}); opacity: ${el.opacity}; }
                     50% { transform: translateX(${el.xDrift * 0.6}px) translateY(${el.topStart > 40 ? '6px' : '-6px'}); opacity: ${el.opacity * 0.85}; }
                     75% { transform: translateX(${el.xDrift * 0.85}px) translateY(${el.topStart > 40 ? '-5px' : '5px'}); opacity: ${el.opacity}; }`
                  : `25% { transform: translateX(${el.xDrift * 0.3}px) translateY(${isFeather ? '35vh' : '-8px'}); opacity: ${el.opacity}; }
                     50% { transform: translateX(${el.xDrift * 0.5}px) translateY(${isFeather ? '55vh' : '-14px'}); opacity: ${el.opacity * 0.85}; }
                     75% { transform: translateX(${el.xDrift * 0.75}px) translateY(${isFeather ? '78vh' : '-10px'}); opacity: ${el.opacity}; }`
                }
                100% {
                  transform: translateX(${el.xDrift}px) translateY(${isFeather ? '105vh' : isSnake ? '0px' : '-22px'}) rotate(${el.rotation}deg);
                  opacity: ${isFeather ? 0 : el.opacity * 0.4};
                }
              }
              @keyframes ${drift} {
                0%, 100% { filter: brightness(1); }
                30% { filter: brightness(1.12); }
                60% { filter: brightness(0.92); }
              }
            `}</style>
            <div
              className="absolute"
              style={{
                left: `${el.left}%`,
                top: `${el.topStart}%`,
                width: el.size,
                height: el.size,
                color: el.color,
                animation: `${anim} ${el.duration}s ${el.delay}s ease-in-out infinite, ${drift} ${el.duration * 0.5}s ${el.delay + 1}s ease-in-out infinite`,
              }}
            >
              {el.type === 'butterfly' && <Butterfly variant={el.variant} />}
              {el.type === 'feather' && <Feather variant={el.variant} />}
              {el.type === 'moon' && <Moon variant={el.variant} />}
              {el.type === 'snake' && <Snake variant={el.variant} />}
              {el.type === 'moth' && <Moth />}
            </div>
          </div>
        );
      })}
    </div>
  );
}