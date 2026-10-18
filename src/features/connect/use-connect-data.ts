import { useState, useCallback } from "react";
import { usePartnerGuard } from "@/src/hooks/use-partner-guard";
import { fetchPartnerNotes } from "@/src/lib/about-them";
import { PARTNER_NOTE_FIELDS } from "@/src/data/partnerNoteFields";
export function useConnectData() {
  const { hasPartner, user } = usePartnerGuard();
  const [filledNotesCount, setFilledNotesCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

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
    } catch (err) {
      console.warn("Could not load notes stats for Connect hub:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    hasPartner,
    filledNotesCount,
    totalNotesCount,
    loading,
    reloadStats: loadNotesStats,
  };
}
