import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const YOUTUBE_ID = 'E_Q2SjUELvA';

export default function BackgroundMusic() {
  const [muted, setMuted] = useState(true);
  const [apiReady, setApiReady] = useState(false);
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Load YouTube IFrame API
    if (window.YT) {
      createPlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode.insertBefore(tag, firstScript);
      window.onYouTubeIframeAPIReady = () => {
        setApiReady(true);
      };
    }
  }, []);

  useEffect(() => {
    if (apiReady && containerRef.current && !playerRef.current) {
      createPlayer();
    }
  }, [apiReady]);

  const createPlayer = () => {
    if (!containerRef.current || playerRef.current) return;
    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId: YOUTUBE_ID,
      playerVars: {
        autoplay: 1,
        loop: 1,
        playlist: YOUTUBE_ID,
        controls: 0,
        showinfo: 0,
        modestbranding: 1,
        iv_load_policy: 3,
      },
      events: {
        onReady: (event) => {
          event.target.playVideo();
          event.target.mute();
        },
      },
    });
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (muted) {
      playerRef.current.unMute();
    } else {
      playerRef.current.mute();
    }
    setMuted(!muted);
  };

  return (
    <>
      <div ref={containerRef} className="fixed bottom-0 left-0 w-1 h-1 opacity-0 pointer-events-none z-0" />

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