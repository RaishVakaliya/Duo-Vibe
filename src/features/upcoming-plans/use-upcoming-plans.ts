import { useState, useEffect, useMemo, useRef } from "react";
import { Alert } from "react-native";
import { useAuth } from "@/src/context/auth-context";
import { getPartnerId } from "@/src/lib/quiz/pending-sessions";
import { buildCoupleKey } from "@/src/lib/challenge";
import { fetchPartnerNotes } from "@/src/lib/about-them";
import { createResultMemory } from "@/src/lib/memories";
import {
  fetchPlans,
  createPlan,
  deletePlan,
  markPlanDone,
  subscribeToPlans,
  reconcilePlanReminders,
  cancelPlanReminders,
} from "@/src/lib/plans";
import { CouplePlan } from "@/src/types";
import { PlanItem, GroupedPlans } from "./types";
import { AddPlanFormData } from "./components/add-plan-bottom-sheet/types";

export function useUpcomingPlans() {
  const { user, hasPartner } = useAuth();
  const [plans, setPlans] = useState<CouplePlan[]>([]);
  const [localNotes, setLocalNotes] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [coupleKey, setCoupleKey] = useState<string | null>(null);
  const unsubRef = useRef<(() => void) | null>(null);

  // 1. Resolve coupleKey and subscribe
  useEffect(() => {
    let isMounted = true;
    async function init() {
      if (!user || !hasPartner) {
        setLoading(false);
        return;
      }

      try {
        const partnerId = await getPartnerId(user.id);
        if (!partnerId || !isMounted) {
          setLoading(false);
          return;
        }

        const cKey = buildCoupleKey(user.id, partnerId);
        if (!isMounted) return;
        setCoupleKey(cKey);

        // Load plans
        const res = await fetchPlans(cKey);
        if (res.data && isMounted) {
          setPlans(res.data);
          reconcilePlanReminders(res.data);
        }

        // Load local About Them notes
        const notesRes = await fetchPartnerNotes();
        if (notesRes.data && isMounted) {
          setLocalNotes(notesRes.data);
        }

        // Realtime subscribe
        if (unsubRef.current) unsubRef.current();
        unsubRef.current = subscribeToPlans({
          coupleKey: cKey,
          onPlanChange: async () => {
            const updated = await fetchPlans(cKey);
            if (updated.data && isMounted) {
              setPlans(updated.data);
              reconcilePlanReminders(updated.data);
            }
          },
        });
      } catch (err) {
        console.warn("Error initializing upcoming plans:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    init();

    return () => {
      isMounted = false;
      if (unsubRef.current) {
        unsubRef.current();
      }
    };
  }, [user, hasPartner]);

  // 2. Generate local-only birthday & anniversary plans
  const localPlans = useMemo<PlanItem[]>(() => {
    const list: PlanItem[] = [];
    const now = new Date();

    if (localNotes.birthday && typeof localNotes.birthday === "string") {
      const bDate = new Date(localNotes.birthday);
      if (!isNaN(bDate.getTime())) {
        let nextB = new Date(
          now.getFullYear(),
          bDate.getMonth(),
          bDate.getDate(),
          9,
          0,
          0,
        );
        if (nextB.getTime() < now.getTime()) {
          nextB = new Date(
            now.getFullYear() + 1,
            bDate.getMonth(),
            bDate.getDate(),
            9,
            0,
            0,
          );
        }
        list.push({
          id: "local_birthday",
          couple_key: coupleKey || "",
          created_by: user?.id || "",
          title: "Partner's Birthday 🎂",
          kind: "birthday",
          starts_at: nextB.toISOString(),
          all_day: true,
          note: "Set in your private About Them notes",
          done_at: null,
          created_at: now.toISOString(),
          is_local_only: true,
        });
      }
    }

    if (localNotes.anniversary && typeof localNotes.anniversary === "string") {
      const aDate = new Date(localNotes.anniversary);
      if (!isNaN(aDate.getTime())) {
        let nextA = new Date(
          now.getFullYear(),
          aDate.getMonth(),
          aDate.getDate(),
          9,
          0,
          0,
        );
        if (nextA.getTime() < now.getTime()) {
          nextA = new Date(
            now.getFullYear() + 1,
            aDate.getMonth(),
            aDate.getDate(),
            9,
            0,
            0,
          );
        }
        list.push({
          id: "local_anniversary",
          couple_key: coupleKey || "",
          created_by: user?.id || "",
          title: "Our Anniversary 💕",
          kind: "anniversary",
          starts_at: nextA.toISOString(),
          all_day: true,
          note: "Set in your private About Them notes",
          done_at: null,
          created_at: now.toISOString(),
          is_local_only: true,
        });
      }
    }

    return list;
  }, [localNotes, coupleKey, user]);

  // 3. Merged and Grouped plans
  const grouped = useMemo<GroupedPlans>(() => {
    const allItems: PlanItem[] = [...plans, ...localPlans].sort(
      (a, b) =>
        new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
    );

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime();
    const endOfToday = startOfToday + 24 * 60 * 60 * 1000;
    const endOfWeek = startOfToday + 7 * 24 * 60 * 60 * 1000;

    const done: PlanItem[] = [];
    const active: PlanItem[] = [];

    allItems.forEach((p) => {
      if (p.done_at) {
        done.push(p);
      } else {
        active.push(p);
      }
    });

    const nextPlan: PlanItem | null = active[0] ?? null;
    const remainingActive = active.slice(1);

    const today: PlanItem[] = [];
    const thisWeek: PlanItem[] = [];
    const later: PlanItem[] = [];

    remainingActive.forEach((p) => {
      const t = new Date(p.starts_at).getTime();
      if (t < endOfToday) {
        today.push(p);
      } else if (t < endOfWeek) {
        thisWeek.push(p);
      } else {
        later.push(p);
      }
    });

    return {
      nextPlan,
      today,
      thisWeek,
      later,
      done,
    };
  }, [plans, localPlans]);

  // 4. Handlers
  const handleAddPlan = async (form: AddPlanFormData) => {
    if (!coupleKey || !user) return;
    const optimistic: CouplePlan = {
      id: `temp_${Date.now()}`,
      couple_key: coupleKey,
      created_by: user.id,
      title: form.title,
      kind: form.kind,
      starts_at: form.date.toISOString(),
      all_day: form.allDay,
      note: form.note || null,
      done_at: null,
      created_at: new Date().toISOString(),
    };

    setPlans((prev) => [...prev, optimistic]);

    const res = await createPlan({
      coupleKey,
      userId: user.id,
      title: form.title,
      kind: form.kind,
      startsAt: form.date.toISOString(),
      allDay: form.allDay,
      note: form.note,
    });

    if (res.data) {
      setPlans((prev) =>
        prev.map((p) => (p.id === optimistic.id ? res.data! : p)),
      );
      reconcilePlanReminders([...plans, res.data]);
    } else {
      // Revert optimistic on error
      setPlans((prev) => prev.filter((p) => p.id !== optimistic.id));
      Alert.alert("Error", res.error || "Could not create plan");
    }
  };

  const handleToggleDone = async (planId: string, currentDone: boolean) => {
    const nextDone = !currentDone;
    setPlans((prev) =>
      prev.map((p) =>
        p.id === planId
          ? {
              ...p,
              done_at: nextDone ? new Date().toISOString() : null,
            }
          : p,
      ),
    );

    if (nextDone) {
      await cancelPlanReminders(planId);
    }

    const res = await markPlanDone(planId, nextDone);
    if (res.error) {
      // Revert
      setPlans((prev) =>
        prev.map((p) =>
          p.id === planId
            ? { ...p, done_at: currentDone ? new Date().toISOString() : null }
            : p,
        ),
      );
    }
  };

  const handleDeletePlan = async (planId: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== planId));
    await cancelPlanReminders(planId);

    const res = await deletePlan(planId);
    if (res.error) {
      Alert.alert("Error", res.error || "Could not delete plan");
    }
  };

  const handleSaveToMemories = async (plan: PlanItem) => {
    if (!coupleKey || !user) return;
    try {
      await createResultMemory({
        coupleKey,
        userId: user.id,
        title: plan.title,
        note: plan.note || `Celebrated our plan together!`,
        memoryDate: plan.starts_at.split("T")[0],
        payload: {
          plan_id: plan.id,
          kind: plan.kind,
        },
      });
      Alert.alert(
        "Memory Saved! ✨",
        `"${plan.title}" has been preserved in your shared Memories hub.`,
      );
    } catch {
      Alert.alert(
        "Notice",
        "Could not save directly to memories. Please try from the Memories tab.",
      );
    }
  };

  return {
    loading,
    hasPartner,
    user,
    grouped,
    handleAddPlan,
    handleToggleDone,
    handleDeletePlan,
    handleSaveToMemories,
  };
}
