'use client';

import { useCallback } from 'react';
import { useSpotifyTracks } from '@/hooks/useSpotifyTracks';

interface ApiPanelProps {
  // auth state
  token: string | null;
  loading: boolean;
    
}

const ApiPanel = ({
  token,
  loading
}: ApiPanelProps) => {
  const bringItHome =  "https://open.spotify.com/track/1rxD34LAtkafrMUHqHIV76?si=57ae247bcacb49d4"
}