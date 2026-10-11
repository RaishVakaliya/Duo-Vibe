import { supabase } from "@/src/lib/supabase";

export interface ToggleReactionParams {
  memoryId: string;
  userId: string;
  hasReacted: boolean;
}

export async function toggleReaction({
  memoryId,
  userId,
  hasReacted,
}: ToggleReactionParams): Promise<boolean> {
  if (hasReacted) {
    // Remove reaction
    const { error } = await supabase
      .from("memory_reactions")
      .delete()
      .eq("memory_id", memoryId)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to remove reaction: ${error.message}`);
    }
    return false;
  } else {
    // Add reaction
    const { error } = await supabase
      .from("memory_reactions")
      .insert({
        memory_id: memoryId,
        user_id: userId,
      });

    if (error) {
      throw new Error(`Failed to add reaction: ${error.message}`);
    }
    return true;
  }
}
