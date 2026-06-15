import { useMemo } from 'react';

const BUTTERFLIES = [
  'https://pngimg.com/uploads/butterfly/butterfly_PNG103843.png',
  'https://pngimg.com/uploads/butterfly/butterfly_PNG103842.png',
  'https://pngimg.com/uploads/butterfly/butterfly_PNG103841.png',
  'https://pngimg.com/uploads/butterfly/butterfly_PNG103840.png',
  'https://pngimg.com/uploads/butterfly/butterfly_PNG103837.png',
  'https://pngimg.com/uploads/butterfly/butterfly_PNG103836.png',
];

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

const MOONS = [
  'https://pngimg.com/uploads/moon/moon_PNG51.png',
  'https://pngimg.com/uploads/moon/moon_PNG50.png',
  'https://pngimg.com/uploads/moon/moon_PNG49.png',
  'https://pngimg.com/uploads/moon/moon_PNG47.png',
  'https://pngimg.com/uploads/moon/moon_PNG46.png',
  'https://pngimg.com/uploads/moon/moon_PNG45.png',
  'https://pngimg.com/uploads/moon/moon_PNG44.png',
];

const SNAKES = [
  'https://pngimg.com/uploads/snake/snake_PNG4087.png',
  'https://pngimg.com/uploads/snake/snake_PNG4086.png',
  'https://pngimg.com/uploads/snake/snake_PNG4085.png',
  'https://pngimg.com/uploads/snake/snake_PNG4082.png',
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateElements() {
  const elements = [];
  const count = 35;

  for (let i = 0; i < count; i++) {
    const roll = Math.random();
    let type, src, size, duration, delay;

    if (roll < 0.18) {
      // Falling feather — drift down from above
      type = 'feather';
      src = pick(FEATHERS);
      size = 30 + Math.random() * 50;
      duration = 12 + Math.random() * 22;
      delay = Math.random() * duration;
    } else if (roll < 0.40) {
      // Butterfly — gentle float
      type = 'butterfly';
      src = pick(BUTTERFLIES);
      size = 40 + Math.random() * 50;
      duration = 10 + Math.random() * 18;
      delay = Math.random() * duration;
    } else if (roll < 0.62) {
      // Moon — slow rotation drift
      type = 'moon';
      src = pick(MOONS);
      size = 28 + Math.random() * 36;
      duration = 14 + Math.random() * 22;
      delay = Math.random() * duration;
    } else if (roll < 0.84) {
      // Snake — horizontal slither
      type = 'snake';
      src = pick(SNAKES);
      size = 60 + Math.random() * 100;
      duration = 10 + Math.random() * 16;
      delay = Math.random() * duration;
    } else {
      // Extra feather — more falling feathers for variety
      type = 'feather';
      src = pick(FEATHERS);
      size = 20 + Math.random() * 40;
      duration = 10 + Math.random() * 20;
      delay = Math.random() * duration;
    }

    const left = Math.random() * 92;
    const topStart = type === 'feather' ? -(5 + Math.random() * 25) : 10 + Math.random() * 80;
    const xDrift = (Math.random() - 0.5) * 100;
    const rotation = type === 'feather'
      ? 90 + Math.random() * 540
      : type === 'moon'
        ? (Math.random() - 0.5) * 30
        : type === 'snake'
          ? 0
          : (Math.random() - 0.5) * 25;

    const opacity = type === 'moon'
      ? 0.25 + Math.random() * 0.35
      : type === 'snake'
        ? 0.15 + Math.random() * 0.22
        : 0.2 + Math.random() * 0.30;

    elements.push({
      id: i,
      type,
      src,
      size,
      left,
      topStart,
      duration,
      delay,
      xDrift,
      rotation,
      opacity,
      flip: type === 'snake' && Math.random() > 0.5,
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
        const glow = `fg-${el.id}`;
        const isFeather = el.type === 'feather';
        const isSnake = el.type === 'snake';
        const isMoon = el.type === 'moon';

        return (
          <div key={el.id}>
            <style>{`
              @keyframes ${anim} {
                0% {
                  transform: translateY(0) translateX(0) rotate(${isFeather ? '0deg' : '0deg'});
                  opacity: ${isFeather ? 0 : isSnake ? 0 : el.opacity};
                }
                ${isFeather ? `10% { opacity: ${el.opacity}; }` : ''}
                ${isSnake
                  ? `20% { transform: translateX(${el.xDrift * 0.15}px) scaleY(${el.flip ? '-1' : '1'}); opacity: ${el.opacity}; }
                     40% { transform: translateX(${el.xDrift * 0.4}px) translateY(${el.topStart > 50 ? '-8px' : '8px'}) scaleY(${el.flip ? '1' : '-1'}); }
                     60% { transform: translateX(${el.xDrift * 0.6}px) translateY(${el.topStart > 50 ? '6px' : '-6px'}) scaleY(${el.flip ? '-1' : '1'}); }
                     80% { transform: translateX(${el.xDrift * 0.8}px) translateY(${el.topStart > 50 ? '-4px' : '4px'}) scaleY(${el.flip ? '1' : '-1'}); opacity: ${el.opacity}; }`
                  : `25% { transform: translateX(${el.xDrift * 0.3}px) translateY(${isFeather ? '25vh' : '-10px'}) rotate(${isMoon ? el.rotation * 0.3 : isFeather ? el.rotation * 0.2 : el.rotation * 0.5}deg); opacity: ${el.opacity}; }
                     50% { transform: translateX(${el.xDrift * 0.5}px) translateY(${isFeather ? '45vh' : '-16px'}) rotate(${isMoon ? el.rotation * 0.6 : isFeather ? el.rotation * 0.5 : el.rotation * 0.8}deg); opacity: ${el.opacity * 0.9}; }
                     75% { transform: translateX(${el.xDrift * 0.75}px) translateY(${isFeather ? '70vh' : '-12px'}) rotate(${isMoon ? el.rotation * 0.85 : isFeather ? el.rotation * 0.75 : el.rotation * 1}deg); opacity: ${el.opacity}; }`
                }
                100% {
                  transform: translateX(${el.xDrift}px) translateY(${isFeather ? '105vh' : isSnake ? '0px' : '-25px'}) rotate(${isMoon ? el.rotation : isFeather ? el.rotation : el.rotation}deg);
                  opacity: ${isFeather ? 0 : isSnake ? 0 : el.opacity * 0.3};
                }
              }
              @keyframes ${glow} {
                0%, 100% { filter: brightness(1) drop-shadow(0 0 0px transparent); }
                50% { filter: brightness(1.15) ${isMoon ? 'drop-shadow(0 0 8px rgba(251,191,36,0.3))' : 'drop-shadow(0 0 4px rgba(255,255,255,0.1))'}; }
              }
            `}</style>
            <div
              className="absolute"
              style={{
                left: `${el.left}%`,
                top: `${el.topStart}%`,
                width: el.size,
                height: el.size,
                opacity: isFeather ? 0 : el.opacity,
                animation: `${anim} ${el.duration}s ${el.delay}s ease-in-out infinite, ${glow} ${el.duration * 0.6}s ${el.delay + 0.7}s ease-in-out infinite`,
              }}
            >
              <img
                src={el.src}
                alt=""
                className="w-full h-full object-contain"
                style={{
                  transform: el.flip ? 'scaleX(-1)' : undefined,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}