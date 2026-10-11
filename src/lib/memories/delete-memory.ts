import { supabase } from "@/src/lib/supabase";

export interface DeleteMemoryParams {
  memoryId: string;
  imagePath?: string | null;
}

export async function deleteMemory({
  memoryId,
  imagePath,
}: DeleteMemoryParams): Promise<void> {
  // 1. Remove storage file if photo memory
  if (imagePath) {
    try {
      await supabase.storage.from("memories").remove([imagePath]);
    } catch (err) {
      console.warn("[memories] Storage file removal warning:", err);
    }
  }

  // 2. Remove row from database (reactions cascade automatically)
  const { error } = await supabase
    .from("memories")
    .delete()
    .eq("id", memoryId);

  if (error) {
    throw new Error(`Failed to delete memory: ${error.message}`);
  }
}
