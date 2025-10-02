// components/SpotifyPlayer.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

interface SpotifyPlayerProps {
  trackId: string;
  width?: string | number;
  height?: string | number;
  theme?: 'dark' | 'light'; // Note: only 'dark' is officially supported
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (IFrameAPI: any) => void;
    SpotifyIFrameAPI?: any;
  }
}

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ 
  trackId, 
  width = '50%', 
  height = '160',
  theme = 'dark'
}) => {
  const embedRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let script = document.querySelector('script[src="https://open.spotify.com/embed/iframe-api/v1"]') as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://open.spotify.com/embed/iframe-api/v1';
      script.async = true;
      document.body.appendChild(script);
    }

    if (!window.onSpotifyIframeApiReady) {
      window.onSpotifyIframeApiReady = (IFrameAPI: any) => {
        window.SpotifyIFrameAPI = IFrameAPI;
        setIsReady(true);
      };
    } else if (window.SpotifyIFrameAPI) {
      setIsReady(true);
    }

    return () => {
      if (controllerRef.current) {
        controllerRef.current.destroy();
        controllerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isReady && embedRef.current && window.SpotifyIFrameAPI && !controllerRef.current) {
      const cleanTrackId = trackId.split('?')[0].trim();
      
      const options = {
        uri: `spotify:track:${cleanTrackId}`,
        width: width,
        height: height,
      };

      const callback = (EmbedController: any) => {
        controllerRef.current = EmbedController;

        EmbedController.addListener('ready', () => {
          console.log('Embed ready');
        });
      };

      window.SpotifyIFrameAPI.createController(embedRef.current, options, callback);
    }
  }, [isReady, trackId, width, height]);

  useEffect(() => {
    if (controllerRef.current && trackId) {
      const cleanTrackId = trackId.split('?')[0].trim();
      controllerRef.current.loadUri(`spotify:track:${cleanTrackId}`);
      setTimeout(() => {
        controllerRef.current?.play();
      }, 300);
    }
  }, [trackId]);

  return (
    <div 
      ref={embedRef} 
      id="spotify-embed"
      className="rounded-lg overflow-hidden shadow-lg" // Add custom styling here
    />
  );
};

export default SpotifyPlayer;