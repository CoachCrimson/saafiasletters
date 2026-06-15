import { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const YOUTUBE_ID = 'E_Q2SjUELvA';

export default function BackgroundMusic() {
  const [muted, setMuted] = useState(true);
  const iframeRef = useRef(null);

  const toggleMute = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const nextMuted = !muted;
    iframe.contentWindow?.postMessage(
      JSON.stringify({
        event: 'command',
        func: nextMuted ? 'mute' : 'unMute',
        args: '',
      }),
      '*'
    );
    setMuted(nextMuted);
  };

  return (
    <>
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&loop=1&playlist=${YOUTUBE_ID}&controls=0&showinfo=0&modestbranding=1&mute=1&enablejsapi=1`}
        className="fixed bottom-0 left-0 w-1 h-1 opacity-0 pointer-events-none z-0"
        allow="autoplay"
        title="Background Music"
      />

      <button
        onClick={toggleMute}
        className="fixed bottom-4 left-4 z-50 w-8 h-8 rounded-full bg-card/80 border border-border/50 flex items-center justify-center hover:bg-card transition-colors backdrop-blur-sm"
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