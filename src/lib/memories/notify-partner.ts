import { supabase } from "@/src/lib/supabase";
import { getPartnerId } from "@/src/lib/quizSession";
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
        title: "New Memory \uD83D\uDCF8",
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
