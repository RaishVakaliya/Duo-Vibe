import * as ImageManipulator from "expo-image-manipulator";
import { decode } from "base64-arraybuffer";
import { supabase } from "@/src/lib/supabase";
import { setCachedSignedUrl } from "@/src/lib/memories/signed-url-cache";

export interface UploadChatImageResult {
  storagePath: string;
  localUri: string;
}

/**
 * Compresses an image with expo-image-manipulator (max width 1080, JPEG quality 0.7),
 * converts to ArrayBuffer, and uploads to the private Supabase Storage bucket 'chat-images'.
 * Stores only {couple_key}/{message_id}.jpg path in the message row.
 */
export async function uploadChatImage(
  imageUri: string,
  coupleKey: string,
  messageId: string,
): Promise<UploadChatImageResult> {
  // 1. Compress with expo-image-manipulator (max width 1080, JPEG quality 0.7)
  const manipResult = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: 1080 } }],
    {
      compress: 0.7,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true,
    },
  );

  if (!manipResult.base64) {
    throw new Error("Failed to process image data");
  }

  // 2. Decode base64 to ArrayBuffer for Supabase Storage upload
  const arrayBuffer = decode(manipResult.base64);
  const storagePath = `${coupleKey}/${messageId}.jpg`;

  // 3. Cache the local URI immediately in signed-url-cache so the sender doesn't wait
  setCachedSignedUrl(storagePath, manipResult.uri, "chat-images");

  // 4. Upload to private bucket 'chat-images'
  const { error: uploadError } = await supabase.storage
    .from("chat-images")
    .upload(storagePath, arrayBuffer, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Failed to upload chat image: ${uploadError.message}`);
  }

  return {
    storagePath,
    localUri: manipResult.uri,
  };
}
