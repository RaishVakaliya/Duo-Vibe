import * as ImageManipulator from "expo-image-manipulator";
import { decode } from "base64-arraybuffer";
import { supabase } from "@/src/lib/supabase";

export async function uploadAvatarImage(
  localUri: string,
  userId: string,
): Promise<string> {
  const manipResult = await ImageManipulator.manipulateAsync(
    localUri,
    [{ resize: { width: 512, height: 512 } }],
    {
      compress: 0.8,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true,
    },
  );

  if (!manipResult.base64) {
    throw new Error("Failed to process avatar image");
  }

  const arrayBuffer = decode(manipResult.base64);
  const filePath = `${userId}/avatar.jpg`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(filePath, arrayBuffer, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (error) {
    console.warn("Avatar storage upload failed:", error);
    throw error;
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
  return `${data.publicUrl}?t=${Date.now()}`;
}
