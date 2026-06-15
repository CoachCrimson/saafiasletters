import { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const YOUTUBE_ID = 'E_Q2SjUELvA';
const SRC = `https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&loop=1&playlist=${YOUTUBE_ID}&controls=0&showinfo=0&modestbranding=1&mute=1&enablejsapi=1`;

export default function BackgroundMusic() {
  const [muted, setMuted] = useState(true);
  const iframeRef = useRef(null);

  const toggleMute = () => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;

    if (muted) {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'unMute', args: [] }),
        '*'
      );
    } else {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'mute', args: [] }),
        '*'
      );
    }
    setMuted(!muted);
  };

  return (
    <>
      {/* Hidden iframe for background music — sized large enough for the browser to actually load it */}
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

      <button
        onClick={toggleMute}
        className="fixed bottom-4 left-4 z-50 w-9 h-9 rounded-full border border-border/50 bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-all"
        title={muted ? 'Unmute music' : 'Mute music'}
      >
        {muted ? (
          <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <Volume2 className="w-3.5 h-3.5 text-primary" />
        )}
      </button>
    </>
  );
}