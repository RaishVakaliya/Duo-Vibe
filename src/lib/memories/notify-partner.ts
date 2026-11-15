import { supabase } from "@/src/lib/supabase";
import { getPartnerId } from "@/src/lib/quiz";
import { sendExpoPushNotification } from "@/src/lib/notifications";

export async function notifyPartnerOfMemory(
  creatorId: string,
  memoryTitle: string,
  memoryId: string,
): Promise<void> {
  try {
    const partnerId = await getPartnerId(creatorId);
    if (!partnerId) return;

    const [{ data: creatorProfile }, { data: partnerProfile }] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("full_name")
          .eq("id", creatorId)
          .maybeSingle(),
        supabase
          .from("profiles")
          .select("push_token")
          .eq("id", partnerId)
          .maybeSingle(),
      ]);

    const creatorName = creatorProfile?.full_name?.trim() || "Your partner";

    if (partnerProfile?.push_token) {
      await sendExpoPushNotification({
        to: partnerProfile.push_token,
        title: "New Memory",
        body: `${creatorName} added a memory: ${memoryTitle}`,
        data: { type: "memory", memoryId },
      });
    }

    supabase.functions
      .invoke("notify-memory", {
        body: {
          memoryId,
          creatorId,
          partnerId,
          title: memoryTitle,
        },
      })
      .catch(() => {});
  } catch (err) {
    console.warn("[memories] Push notification send error:", err);
  }
}

export async function notifyPartnerOfAnniversary(
  updaterId: string,
  anniversaryDate: string,
): Promise<void> {
  try {
    const partnerId = await getPartnerId(updaterId);
    if (!partnerId) return;

    const [{ data: updaterProfile }, { data: partnerProfile }] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("full_name")
          .eq("id", updaterId)
          .maybeSingle(),
        supabase
          .from("profiles")
          .select("push_token")
          .eq("id", partnerId)
          .maybeSingle(),
      ]);

    const updaterName = updaterProfile?.full_name?.trim() || "Your partner";

    if (partnerProfile?.push_token) {
      await sendExpoPushNotification({
        to: partnerProfile.push_token,
        title: "Anniversary Updated",
        body: `${updaterName} set your anniversary date to ${anniversaryDate}!`,
        data: { type: "anniversary", anniversaryDate },
      });
    }
  } catch (err) {
    console.warn("[memories] Push notification send error for anniversary:", err);
  }
}
