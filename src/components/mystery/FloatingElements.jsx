import { useMemo } from 'react';

function Butterfly() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M12 12C10 8 6 4 6 4C6 4 4 8 4 10C4 12 6 14 12 19C18 14 20 12 20 10C20 8 18 4 18 4C18 4 14 8 12 12Z" fill="currentColor" opacity="0.6" />
      <path d="M12 12L12 19" stroke="currentColor" strokeWidth="0.5" opacity="0.8" />
      <circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

function Feather() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M6 22C6 22 10 14 12 12C14 10 18 4 18 4C18 4 14 10 12 12C10 14 6 22 6 22Z" fill="currentColor" opacity="0.5" />
      <path d="M12 12L18 4" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <path d="M11 14L6 22" stroke="currentColor" strokeWidth="0.3" opacity="0.4" />
    </svg>
  );
}

function Raven() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M12 4C10 4 8 2 8 2C8 2 6 4 8 8C10 6 12 6 12 6C12 6 14 6 16 8C18 4 16 2 16 2C16 2 14 4 12 4Z" fill="currentColor" opacity="0.5" />
      <path d="M8 8C6 10 4 12 4 12C4 12 5 10 6 10C7 10 8 9 8 8Z" fill="currentColor" opacity="0.4" />
      <path d="M16 8C18 10 20 12 20 12C20 12 19 10 18 10C17 10 16 9 16 8Z" fill="currentColor" opacity="0.4" />
      <path d="M12 6L12 4" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
    </svg>
  );
}

// Pre-built elements pool
const TYPES = ['butterfly', 'feather', 'raven'];

function generateElements() {
  // More elements, more variety
  const count = 15;
  const elements = [];
  for (let i = 0; i < count; i++) {
    const type = TYPES[Math.floor(Math.random() * TYPES.length)];
    const size = type === 'raven' 
      ? 28 + Math.random() * 24 
      : type === 'butterfly' 
        ? 18 + Math.random() * 22 
        : 12 + Math.random() * 20;
    const left = Math.random() * 95;
    const duration = type === 'raven' 
      ? 10 + Math.random() * 14 
      : type === 'butterfly' 
        ? 7 + Math.random() * 12 
        : 10 + Math.random() * 18;
    const delay = Math.random() * duration;
    const driftDelay = Math.random() * 6;
    
    elements.push({
      id: i,
      type,
      size,
      left,
      duration,
      delay,
      driftDelay,
      opacity: 0.15 + Math.random() * 0.25,
    });
  }
  return elements;
}

export default function FloatingElements() {
  const elements = useMemo(() => generateElements(), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute"
          style={{
            left: `${el.left}%`,
            top: '-10%',
            width: el.size,
            height: el.size,
            opacity: el.opacity,
            animation: `float-raven ${el.duration}s ${el.delay}s ease-in-out infinite, drift ${el.driftDelay + 3}s ${el.delay + 1}s ease-in-out infinite`,
            color: el.type === 'butterfly' ? '#c4b5fd' : el.type === 'raven' ? '#94a3b8' : '#d4c5a9',
          }}
        >
          {el.type === 'butterfly' && <Butterfly />}
          {el.type === 'feather' && <Feather />}
          {el.type === 'raven' && <Raven />}
        </div>
      ))}
    </div>
  );
}