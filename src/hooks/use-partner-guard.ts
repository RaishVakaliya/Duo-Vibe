import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/src/context/auth-context";
import { getPartnerId } from "@/src/lib/quiz/pending-sessions";
import { supabase } from "@/src/lib/supabase";
import { getCoupleKey } from "@/src/lib/couple/get-couple-key";

import type { User } from "@supabase/supabase-js";

export interface PartnerGuardState {
  isLoading: boolean;
  hasPartner: boolean;
  partnerId: string | null;
  partnerName: string | null;
  coupleKey: string | null;
  user: User | null;
  userId: string | null;
  refresh: () => void;
}

export function usePartnerGuard(): PartnerGuardState {
  const { user, hasPartner: authHasPartner } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [resolvedPartnerId, setResolvedPartnerId] = useState<string | null>(null);
  const [partnerName, setPartnerName] = useState<string | null>(null);
  const [coupleKey, setCoupleKey] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!user || !authHasPartner) {
      setIsLoading(false);
      setResolvedPartnerId(null);
      setPartnerName(null);
      setCoupleKey(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    async function resolve() {
      if (!user) return;

      try {
        const pId = await getPartnerId(user.id);
        if (!pId || cancelled) {
          if (!cancelled) setIsLoading(false);
          return;
        }

        // Fetch partner's display name
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", pId)
          .maybeSingle();

        if (cancelled) return;

        setResolvedPartnerId(pId);
        setPartnerName(profile?.full_name?.trim() ?? null);
        setCoupleKey(getCoupleKey(user.id, pId));
      } catch (err) {
        console.warn("[usePartnerGuard] Failed to resolve partner:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    resolve();

    return () => {
      cancelled = true;
    };
  }, [user, authHasPartner, tick]);

  return {
    isLoading,
    hasPartner: authHasPartner && resolvedPartnerId !== null,
    partnerId: resolvedPartnerId,
    partnerName,
    coupleKey,
    user,
    userId: user?.id ?? null,
    refresh,
  };
}
