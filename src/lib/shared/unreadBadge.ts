import { supabase } from '@/src/lib/supabase';
import { createRealtimeChannel } from '@/src/lib/realtime/create-realtime-channel';
import { useEffect, useState, useRef } from 'react';

export function useUnreadBadge(coupleKey: string | null, userId: string | null) {
  const [count, setCount] = useState(0);
  const lastFetchRef = useRef(0);

  useEffect(() => {
    if (!coupleKey || !userId) return;

    const fetchCount = async () => {
      const now = Date.now();
      if (now - lastFetchRef.current < 30_000) return; // 30 s debounce
      lastFetchRef.current = now;
      const { count, error } = await supabase
        .from('chat_messages')
        .select('id', { count: 'exact', head: true })
        .eq('couple_key', coupleKey)
        .neq('sender_id', userId)
        .is('read_at', null);
      if (!error) setCount(count ?? 0);
    };

    fetchCount();

    const unsubscribe = createRealtimeChannel({
      channelName: `chat_badge_${coupleKey}`,
      changes: {
        event: '*',
        table: 'chat_messages',
        filter: `couple_key=eq.${coupleKey}`,
        callback: () => {
          fetchCount();
        },
      },
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [coupleKey, userId]);

  return count;
}
