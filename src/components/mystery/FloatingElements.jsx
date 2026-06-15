import { useEffect, useState } from 'react';

const BUTTERFLY_SVG = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M12 2C12 2 8 6 4 8C2 9 1 11 2 13C3 15 5 15 7 14C9 13 11 10 12 8C13 10 15 13 17 14C19 15 21 15 22 13C23 11 22 9 20 8C16 6 12 2 12 2Z" />
  </svg>
);

const FEATHER_SVG = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full">
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76zM16 8L2 22M17.5 15H9" />
  </svg>
);

const RAVEN_SVG = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18-.21 0-.41-.06-.57-.18l-7.9-4.44c-.32-.17-.53-.5-.53-.88v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18.21 0 .41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9zM12 4.15L5 8.09v7.82l7 3.94 7-3.94V8.09l-7-3.94z" />
    <path d="M12 12L5 8l7-4 7 4-7 4z" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

export default function FloatingElements() {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const types = ['butterfly', 'butterfly', 'feather', 'feather', 'raven', 'raven'];
    const items = [];
    for (let i = 0; i < 12; i++) {
      items.push({
        id: i,
        type: types[i % types.length],
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 12 + Math.random() * 18,
        size: i >= 8 ? 20 + Math.random() * 24 : 12 + Math.random() * 16,
      });
    }
    setElements(items);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el) => (
        <div
          key={el.id}
          className={`absolute ${el.type === 'raven' ? 'text-foreground/15' : 'text-primary/20'}`}
          style={{
            left: `${el.left}%`,
            top: '-20px',
            width: `${el.size}px`,
            height: `${el.size}px`,
            animation: el.type === 'feather'
              ? `feather-fall ${el.duration}s linear ${el.delay}s infinite`
              : el.type === 'raven'
              ? `float-raven ${el.duration}s ease-in-out ${el.delay}s infinite`
              : `float-butterfly ${el.duration}s ease-in-out ${el.delay}s infinite`,
          }}
        >
          {el.type === 'butterfly' ? BUTTERFLY_SVG : el.type === 'raven' ? RAVEN_SVG : FEATHER_SVG}
        </div>
      ))}
    </div>
  );
}