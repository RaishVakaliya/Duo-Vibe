import { decode } from "base64-arraybuffer";
import { supabase } from "@/src/lib/supabase";
import { Memory } from "@/src/types";
import { setCachedSignedUrl } from "./signed-url-cache";
import { notifyPartnerOfMemory } from "./notify-partner";

export interface CreatePhotoMemoryInput {
  coupleKey: string;
  userId: string;
  title: string;
  note?: string;
  memoryDate: string; // YYYY-MM-DD
  imageUri: string;
  imageBase64?: string;
}

export async function createPhotoMemory({
  coupleKey,
  userId,
  title,
  note,
  memoryDate,
  imageUri,
  imageBase64,
}: CreatePhotoMemoryInput): Promise<Memory> {
  // 1. Process image data into ArrayBuffer without native modules
  let arrayBuffer: ArrayBuffer;

  if (imageBase64) {
    arrayBuffer = decode(imageBase64);
  } else {
    // Fallback: fetch blob from local file URI and convert to ArrayBuffer
    const response = await fetch(imageUri);
    const blob = await response.blob();
    arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert image blob to ArrayBuffer"));
        }
      };
      reader.onerror = () =>
        reject(reader.error || new Error("FileReader error"));
      reader.readAsArrayBuffer(blob);
    });
  }

  // 2. Generate unique memory ID and storage path
  const memoryId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    },
  );
  const imagePath = `${coupleKey}/${memoryId}.jpg`;

  // 3. Upload file to Supabase storage private bucket 'memories'
  const { error: uploadError } = await supabase.storage
    .from("memories")
    .upload(imagePath, arrayBuffer, {
      contentType: "image/jpeg",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  // 4. Insert row into public.memories table
  const { data: insertedRow, error: insertError } = await supabase
    .from("memories")
    .insert({
      id: memoryId,
      couple_key: coupleKey,
      created_by: userId,
      kind: "photo",
      title: title.trim(),
      note: note?.trim() || null,
      memory_date: memoryDate,
      image_path: imagePath,
      payload: null,
    })
    .select()
    .single();

  // 5. Rollback storage file if database insert fails
  if (insertError || !insertedRow) {
    await supabase.storage.from("memories").remove([imagePath]);
    throw new Error(
      `Failed to save memory: ${insertError?.message || "Unknown error"}`,
    );
  }

  // 6. Obtain signed URL and cache it
  let signedUrl: string | null = null;
  try {
    const { data: signedData } = await supabase.storage
      .from("memories")
      .createSignedUrl(imagePath, 3600);
    if (signedData?.signedUrl) {
      signedUrl = signedData.signedUrl;
      setCachedSignedUrl(imagePath, signedUrl);
    }
  } catch {
    // Non-fatal, fetch-memories will resolve signed URL later
  }

  // 7. Notify partner
  notifyPartnerOfMemory(userId, title.trim(), memoryId).catch(() => { });

  return {
    id: insertedRow.id,
    couple_key: insertedRow.couple_key,
    created_by: insertedRow.created_by,
    kind: "photo",
    title: insertedRow.title,
    note: insertedRow.note,
    memory_date: insertedRow.memory_date,
    image_path: insertedRow.image_path,
    image_url: signedUrl,
    payload: null,
    created_at: insertedRow.created_at,
    reactions_count: 0,
    has_reacted: false,
  };
}
