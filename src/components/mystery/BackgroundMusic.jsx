import { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const YOUTUBE_ID = 'E_Q2SjUELvA';

export default function BackgroundMusic() {
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  const createPlayer = useCallback(() => {
    if (playerRef.current || !containerRef.current) return;
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
          setReady(true);
        },
      },
    });
  }, []);

  useEffect(() => {
    // Create a div outside React's tree to avoid DOM conflicts
    const el = document.createElement('div');
    el.id = 'bg-music-container';
    el.style.cssText = 'position:fixed;bottom:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none;z-index:0;';
    document.body.appendChild(el);
    containerRef.current = el;

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        createPlayer();
      };

      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
    }

    return () => {
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch {}
        playerRef.current = null;
      }
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, [createPlayer]);

  const toggleMute = () => {
    if (!playerRef.current || !ready) return;
    if (muted) {
      playerRef.current.unMute();
    } else {
      playerRef.current.mute();
    }
    setMuted(!muted);
  };

  return (
    <button
      onClick={toggleMute}
      className={`fixed bottom-4 left-4 z-50 w-9 h-9 rounded-full border flex items-center justify-center transition-all backdrop-blur-sm ${
        ready
          ? 'bg-card/80 border-border/50 hover:bg-card cursor-pointer'
          : 'bg-card/40 border-border/30 cursor-default opacity-40'
      }`}
      title={!ready ? 'Loading...' : muted ? 'Unmute music' : 'Mute music'}
    >
      {muted ? (
        <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />
      ) : (
        <Volume2 className="w-3.5 h-3.5 text-primary" />
      )}
    </button>
  );
}