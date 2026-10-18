import { supabase } from '@/src/lib/supabase';
import { createRealtimeChannel } from '@/src/lib/realtime/create-realtime-channel';
import { useEffect, useState } from 'react';

type PartnerProfile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
};

// Simple in‑memory cache with 10‑minute TTL
const cache: { data?: PartnerProfile; expiresAt?: number } = {};

export function usePartnerProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<PartnerProfile | null>(null);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }

    // Return cached value if fresh
    if (cache.data && cache.expiresAt && cache.expiresAt > Date.now()) {
      setProfile(cache.data);
      return;
    }

    // Initial fetch (select only needed columns)
    supabase
      .from('profiles')
      .select('id, full_name, avatar_url, updated_at')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) {
          cache.data = data as PartnerProfile;
          cache.expiresAt = Date.now() + 10 * 60 * 1000; // 10 min
          setProfile(cache.data);
        }
      });

    // Realtime updates for this profile
    const unsubscribe = createRealtimeChannel({
      channelName: `profiles_${userId}`,
      changes: {
        event: '*',
        table: 'profiles',
        filter: `id=eq.${userId}`,
        callback: (payload) => {
          if (payload.new) {
            cache.data = payload.new as PartnerProfile;
            cache.expiresAt = Date.now() + 10 * 60 * 1000;
            setProfile(cache.data);
          }
        },
      },
    });

    return () => {
      // Clean up realtime channel
      if (unsubscribe) unsubscribe();
    };
  }, [userId]);

  return profile;
}
