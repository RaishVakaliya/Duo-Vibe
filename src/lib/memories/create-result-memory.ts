import { supabase } from "@/src/lib/supabase";
import { Memory } from "@/src/types";
import { notifyPartnerOfMemory } from "./notify-partner";
import { Json } from "@/src/types/database";

export interface CreateResultMemoryInput {
  coupleKey: string;
  userId: string;
  title: string;
  note?: string;
  memoryDate?: string; // Defaults to current date YYYY-MM-DD
  payload: Record<string, unknown>;
}

export async function createResultMemory({
  coupleKey,
  userId,
  title,
  note,
  memoryDate,
  payload,
}: CreateResultMemoryInput): Promise<Memory> {
  const dateStr = memoryDate || new Date().toISOString().split("T")[0];

  const { data: insertedRow, error } = await supabase
    .from("memories")
    .insert({
      couple_key: coupleKey,
      created_by: userId,
      kind: "result",
      title: title.trim(),
      note: note?.trim() || null,
      memory_date: dateStr,
      image_path: null,
      payload: payload as unknown as Json,
    })
    .select()
    .single();

  if (error || !insertedRow) {
    throw new Error(`Failed to save result memory: ${error?.message || "Unknown error"}`);
  }

  notifyPartnerOfMemory(userId, title.trim(), insertedRow.id).catch(() => {});

  return {
    id: insertedRow.id,
    couple_key: insertedRow.couple_key,
    created_by: insertedRow.created_by,
    kind: "result",
    title: insertedRow.title,
    note: insertedRow.note,
    memory_date: insertedRow.memory_date,
    image_path: null,
    image_url: null,
    payload: (insertedRow.payload as Record<string, unknown>) ?? payload,
    created_at: insertedRow.created_at,
    reactions_count: 0,
    has_reacted: false,
  };
}
