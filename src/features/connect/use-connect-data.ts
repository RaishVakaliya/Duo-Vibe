import { useState, useCallback } from "react";
import { usePartnerGuard } from "@/src/hooks/use-partner-guard";
import { useSessionAuth } from "@/src/context/auth-context";
import { fetchPartnerNotes } from "@/src/lib/about-them";
import { PARTNER_NOTE_FIELDS } from "@/src/data/partnerNoteFields";
import { supabase } from "@/src/lib/supabase";

export function useConnectData() {
  const { user, hasPartner, partnerId, partnerName } = usePartnerGuard();
  const { userName, avatarUrl } = useSessionAuth();
  const [filledNotesCount, setFilledNotesCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [partnerAvatarUrl, setPartnerAvatarUrl] = useState<string | null>(null);
  const [daysTogether, setDaysTogether] = useState<number>(0);

  const totalNotesCount = PARTNER_NOTE_FIELDS.length;

  const loadNotesStats = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await fetchPartnerNotes();
      const count = PARTNER_NOTE_FIELDS.filter((f) => {
        const v = data[f.key];
        if (v === undefined || v === null) return false;
        if (Array.isArray(v)) return v.length > 0;
        if (typeof v === "string") return v.trim().length > 0;
        return true;
      }).length;
      setFilledNotesCount(count);

      // Fetch partner avatar and days together if we have a partner
      if (hasPartner && partnerId) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", partnerId)
          .maybeSingle();
        if (profile?.avatar_url) setPartnerAvatarUrl(profile.avatar_url);

        // Days together from couples table
        const { data: couple } = await supabase
          .from("couples")
          .select("connected_at")
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
          .eq("status", "connected")
          .maybeSingle();
        if (couple?.connected_at) {
          const diff = Date.now() - new Date(couple.connected_at).getTime();
          setDaysTogether(Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24))));
        }
      }
    } catch (err) {
      console.warn("Could not load notes stats for Connect hub:", err);
    } finally {
      setLoading(false);
    }
  }, [user, hasPartner, partnerId]);

  return {
    hasPartner,
    filledNotesCount,
    totalNotesCount,
    loading,
    reloadStats: loadNotesStats,
    myName: userName,
    myAvatarUrl: avatarUrl,
    partnerName,
    partnerAvatarUrl,
    daysTogether,
  };
}
