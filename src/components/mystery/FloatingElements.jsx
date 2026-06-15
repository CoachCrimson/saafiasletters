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

export default function FloatingElements() {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const items = [];
    for (let i = 0; i < 6; i++) {
      items.push({
        id: i,
        type: i % 3 === 0 ? 'feather' : 'butterfly',
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 10 + Math.random() * 15,
        size: 12 + Math.random() * 16,
      });
    }
    setElements(items);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute text-primary/20"
          style={{
            left: `${el.left}%`,
            top: '-20px',
            width: `${el.size}px`,
            height: `${el.size}px`,
            animation: el.type === 'feather'
              ? `feather-fall ${el.duration}s linear ${el.delay}s infinite`
              : `float-butterfly ${el.duration}s ease-in-out ${el.delay}s infinite`,
          }}
        >
          {el.type === 'butterfly' ? BUTTERFLY_SVG : FEATHER_SVG}
        </div>
      ))}
    </div>
  );
}