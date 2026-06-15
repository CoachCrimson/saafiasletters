import { useMemo } from 'react';

const FEATHERS = [
  'https://pngimg.com/uploads/feather/feather_PNG109993.png',
  'https://pngimg.com/uploads/feather/feather_PNG109997.png',
  'https://pngimg.com/uploads/feather/feather_PNG109995.png',
  'https://pngimg.com/uploads/feather/feather_PNG109994.png',
  'https://pngimg.com/uploads/feather/feather_PNG109992.png',
  'https://pngimg.com/uploads/feather/feather_PNG109991.png',
  'https://pngimg.com/uploads/feather/feather_PNG109990.png',
  'https://pngimg.com/uploads/feather/feather_PNG109989.png',
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateElements() {
  const elements = [];
  const count = 16;

  for (let i = 0; i < count; i++) {
    const src = pick(FEATHERS);
    const size = 26 + Math.random() * 42;
    const duration = 14 + Math.random() * 26;
    const delay = Math.random() * duration;
    const left = 3 + Math.random() * 90;
    const topStart = -(5 + Math.random() * 30);
    const xDrift = (Math.random() - 0.5) * 80;
    const rotation = 120 + Math.random() * 600;
    const opacity = 0.18 + Math.random() * 0.28;

    elements.push({
      id: i,
      src,
      size,
      left,
      topStart,
      duration,
      delay,
      xDrift,
      rotation,
      opacity,
    });
  }
  return elements;
}

export default function FloatingElements() {
  const elements = useMemo(() => generateElements(), []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {elements.map((el) => {
        const anim = `ff-${el.id}`;
        const glow = `fg-${el.id}`;

        return (
          <div key={el.id}>
            <style>{`
              @keyframes ${anim} {
                0% {
                  transform: translateY(0) translateX(0) rotate(0deg);
                  opacity: 0;
                }
                8% { opacity: ${el.opacity}; }
                30% {
                  transform: translateX(${el.xDrift * 0.25}px) translateY(20vh) rotate(${el.rotation * 0.2}deg);
                  opacity: ${el.opacity};
                }
                55% {
                  transform: translateX(${el.xDrift * 0.55}px) translateY(50vh) rotate(${el.rotation * 0.5}deg);
                  opacity: ${el.opacity * 0.9};
                }
                80% {
                  transform: translateX(${el.xDrift * 0.8}px) translateY(75vh) rotate(${el.rotation * 0.8}deg);
                  opacity: ${el.opacity};
                }
                100% {
                  transform: translateX(${el.xDrift}px) translateY(105vh) rotate(${el.rotation}deg);
                  opacity: 0;
                }
              }
              @keyframes ${glow} {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.1) drop-shadow(0 0 3px rgba(255,255,255,0.08)); }
              }
            `}</style>
            <div
              className="absolute"
              style={{
                left: `${el.left}%`,
                top: `${el.topStart}%`,
                width: el.size,
                height: el.size,
                opacity: 0,
                animation: `${anim} ${el.duration}s ${el.delay}s ease-in-out infinite, ${glow} ${el.duration * 0.4}s ${el.delay + 1}s ease-in-out infinite`,
              }}
            >
              <img
                src={el.src}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}