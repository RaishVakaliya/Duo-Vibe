import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/src/context/auth-context";
import { supabase } from "@/src/lib/supabase";
import { getPartnerId } from "@/src/lib/quiz/pending-sessions";
import { PARTNER_NOTE_FIELDS } from "@/src/data/partnerNoteFields";
import {
  fetchPartnerNotes,
  savePartnerNote,
  clearPartnerNote,
  scheduleAboutThemReminders,
  cancelAboutThemReminders,
} from "@/src/lib/about-them";

export function useAboutThem() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState<string | null>(null);
  const [failedSave, setFailedSave] = useState<{
    key: string;
    value: unknown;
  } | null>(null);

  // Fetch partner name
  useEffect(() => {
    let isMounted = true;
    async function loadPartner() {
      if (!user) return;
      try {
        const pId = await getPartnerId(user.id);
        if (pId && isMounted) {
          const { data } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", pId)
            .maybeSingle();
          if (data?.full_name && isMounted) {
            setPartnerName(data.full_name);
          }
        }
      } catch (e) {
        console.warn("Could not load partner name:", e);
      }
    }
    loadPartner();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Fetch notes on mount
  const loadNotes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await fetchPartnerNotes();
    if (!error) {
      setNotes(data);

      // Reschedule reminders on app launch if birthday or anniversary is set
      if (data.birthday) {
        scheduleAboutThemReminders("birthday", data.birthday as string, partnerName);
      }
      if (data.anniversary) {
        scheduleAboutThemReminders("anniversary", data.anniversary as string, partnerName);
      }
    }
    setLoading(false);
  }, [partnerName]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Save note optimistically
  const handleSave = useCallback(
    async (fieldKey: string, value: unknown) => {
      // 1. Optimistic update
      setNotes((prev) => ({ ...prev, [fieldKey]: value }));
      setSavingKey(fieldKey);
      setFailedSave(null);

      // 2. Persist
      const res = await savePartnerNote(fieldKey, value);
      setSavingKey(null);

      if (!res.success) {
        // Save failed: store failed state for retry
        setFailedSave({ key: fieldKey, value });
        return;
      }

      // Success
      setSavedKey(fieldKey);
      setTimeout(() => {
        setSavedKey((current) => (current === fieldKey ? null : current));
      }, 2000);

      // If date field, schedule reminders
      if (fieldKey === "birthday" || fieldKey === "anniversary") {
        await scheduleAboutThemReminders(
          fieldKey,
          value as string,
          partnerName,
        );
      }
    },
    [partnerName],
  );

  // Clear note
  const handleClear = useCallback(
    async (fieldKey: string) => {
      setNotes((prev) => {
        const next = { ...prev };
        delete next[fieldKey];
        return next;
      });
      setSavingKey(fieldKey);
      setFailedSave(null);

      const res = await clearPartnerNote(fieldKey);
      setSavingKey(null);

      if (!res.success) {
        setFailedSave({ key: fieldKey, value: null });
        return;
      }

      setSavedKey(fieldKey);
      setTimeout(() => {
        setSavedKey((current) => (current === fieldKey ? null : current));
      }, 2000);

      if (fieldKey === "birthday" || fieldKey === "anniversary") {
        await cancelAboutThemReminders(fieldKey);
      }
    },
    [],
  );

  // Retry failed save
  const retryFailedSave = useCallback(async () => {
    if (!failedSave) return;
    const { key, value } = failedSave;
    if (value === null) {
      await handleClear(key);
    } else {
      await handleSave(key, value);
    }
  }, [failedSave, handleClear, handleSave]);

  // Calculate filled count
  const filledCount = useMemo(() => {
    return PARTNER_NOTE_FIELDS.filter((f) => {
      const v = notes[f.key];
      if (v === undefined || v === null) return false;
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === "string") return v.trim().length > 0;
      return true;
    }).length;
  }, [notes]);

  const totalCount = PARTNER_NOTE_FIELDS.length;

  return {
    notes,
    loading,
    savingKey,
    savedKey,
    failedSave,
    partnerName,
    filledCount,
    totalCount,
    handleSave,
    handleClear,
    retryFailedSave,
    reloadNotes: loadNotes,
  };
}
