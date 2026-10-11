import { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/context/auth-context";
import { fetchPartnerNotes } from "@/src/lib/about-them";
import { PARTNER_NOTE_FIELDS } from "@/src/data/partnerNoteFields";
import { ROUTES } from "@/src/constants/routes";
import { TabItem } from "@/src/components/navigation/bottom-tab-bar";

export function useConnectData() {
  const router = useRouter();
  const { hasPartner, user } = useAuth();
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

  useEffect(() => {
    loadNotesStats();
  }, [loadNotesStats]);

  const handleTabPress = useCallback(
    (_index: number, item: TabItem) => {
      switch (item.id) {
        case "home":
          router.replace(ROUTES.HOME);
          break;
        case "connect":
          break;
        case "chat":
          router.replace(ROUTES.CHAT);
          break;
        case "memories":
          router.replace(ROUTES.MEMORIES);
          break;
        case "profile":
          router.replace(ROUTES.PROFILE);
          break;
      }
    },
    [router],
  );

  return {
    hasPartner,
    filledNotesCount,
    totalNotesCount,
    loading,
    handleTabPress,
    reloadStats: loadNotesStats,
  };
}
