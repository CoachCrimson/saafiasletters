import { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const YOUTUBE_ID = 'E_Q2SjUELvA';
const SRC = `https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&loop=1&playlist=${YOUTUBE_ID}&controls=0&showinfo=0&modestbranding=1&mute=1&enablejsapi=1`;

export default function BackgroundMusic() {
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(50);
  const [showSlider, setShowSlider] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const iframeRef = useRef(null);
  const volumeRef = useRef(50);

  const postCommand = useCallback((func, args = []) => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: 'command', func, args }),
      '*'
    );
  }, []);

  // Listen for YouTube iframe ready, then unmute and set volume
  useEffect(() => {
    const handler = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.event === 'onReady' && !playerReady) {
          setPlayerReady(true);
          postCommand('unMute');
          postCommand('setVolume', [50]);
          setMuted(false);
        }
      } catch {}
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [playerReady, postCommand]);

  const toggleMute = () => {
    if (muted) {
      postCommand('unMute');
      postCommand('setVolume', [volumeRef.current]);
    } else {
      postCommand('mute');
    }
    setMuted(!muted);
  };

  const handleVolumeChange = (e) => {
    const v = Number(e.target.value);
    volumeRef.current = v;
    setVolume(v);
    if (muted) {
      postCommand('unMute');
      setMuted(false);
    }
    postCommand('setVolume', [v]);
  };

  return (
    <>
      <iframe
        ref={iframeRef}
        src={SRC}
        className="fixed pointer-events-none"
        style={{
          top: '-9999px',
          left: '-9999px',
          width: '200px',
          height: '200px',
          border: 'none',
          zIndex: -1,
        }}
        allow="autoplay"
        title="Background Music"
      />

      <div
        className="fixed bottom-4 left-4 z-50 flex items-center gap-1"
        onMouseEnter={() => setShowSlider(true)}
        onMouseLeave={() => setShowSlider(false)}
      >
        <button
          onClick={toggleMute}
          className="w-9 h-9 rounded-full border border-border/50 bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-all shrink-0"
          title={muted ? 'Unmute music' : 'Mute music'}
        >
          {muted ? (
            <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-primary" />
          )}
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            showSlider || muted ? 'w-24 opacity-100' : 'w-0 opacity-0'
          }`}
        >
          <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border/50 rounded-full px-3 py-2">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1.5 appearance-none bg-muted-foreground/30 rounded-full cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
        </div>
      </div>
    </>
  );
}