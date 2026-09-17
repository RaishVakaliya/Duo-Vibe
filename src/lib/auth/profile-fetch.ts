import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/src/lib/supabase";
import { registerForPushNotificationsAsync } from "@/src/lib/notifications";
import { RelationshipType } from "@/src/types";

export const HAS_PARTNER_KEY = "@duo_has_partner";
export const RELATIONSHIP_TYPE_KEY = "@duo_relationship_type";
export const USER_NAME_KEY = "@duo_user_name";
export const AVATAR_URL_KEY = "@duo_avatar_url";

export function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    const char = chars.charAt(randomIndex);
    if (char) {
      result += char;
    }
  }
  return result || "DUOVIB";
}

export interface SyncedProfileData {
  hasPartner: boolean;
  userName: string | null;
  avatarUrl: string | null;
  relationshipType: RelationshipType | null;
  inviteCode: string;
  codeExpiresAt: number;
  codeExpiresInSeconds: number;
}

export async function syncUserProfile(
  currentUser: User,
): Promise<SyncedProfileData | null> {
  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (error) {
      console.warn("Error fetching profile from Supabase:", error);
      return null;
    }

    const now = new Date();
    if (!profile) {
      const newCode = generateInviteCode();
      const nowIso = now.toISOString();
      const expiresTime = now.getTime() + 3600 * 1000;
      const initialName =
        (currentUser.user_metadata?.full_name as string) ||
        (await AsyncStorage.getItem(USER_NAME_KEY)) ||
        null;
      const initialAvatar =
        (currentUser.user_metadata?.avatar_url as string) ||
        (await AsyncStorage.getItem(AVATAR_URL_KEY)) ||
        null;

      await supabase.from("profiles").insert({
        id: currentUser.id,
        email: currentUser.email ?? null,
        full_name: initialName,
        avatar_url: initialAvatar ?? currentUser.user_metadata?.avatar_url ?? null,
        invite_code: newCode,
        created_at: nowIso,
        updated_at: nowIso,
      });

      registerForPushNotificationsAsync(currentUser.id).catch((pushErr) => {
        console.warn("Auto push token registration note:", pushErr);
      });

      return {
        hasPartner: false,
        userName: initialName,
        avatarUrl: initialAvatar,
        relationshipType: null,
        inviteCode: newCode,
        codeExpiresAt: expiresTime,
        codeExpiresInSeconds: 3600,
      };
    }

    let finalName = profile.full_name ?? null;
    if (profile.full_name) {
      await AsyncStorage.setItem(USER_NAME_KEY, profile.full_name);
    } else {
      const stored = await AsyncStorage.getItem(USER_NAME_KEY);
      if (stored) {
        finalName = stored;
        await supabase
          .from("profiles")
          .update({ full_name: stored })
          .eq("id", currentUser.id);
      }
    }

    let finalAvatar = profile.avatar_url ?? null;
    if (profile.avatar_url) {
      await AsyncStorage.setItem(AVATAR_URL_KEY, profile.avatar_url);
    } else {
      const stored = await AsyncStorage.getItem(AVATAR_URL_KEY);
      if (stored) {
        finalAvatar = stored;
        await supabase
          .from("profiles")
          .update({ avatar_url: stored })
          .eq("id", currentUser.id);
      }
    }

    let finalRelationship: RelationshipType | null = null;
    if (
      profile.relationship_type === "local" ||
      profile.relationship_type === "long_distance"
    ) {
      finalRelationship = profile.relationship_type;
      await AsyncStorage.setItem(
        RELATIONSHIP_TYPE_KEY,
        profile.relationship_type,
      );
    }

    let hasPartner = Boolean(profile.partner_id);
    if (hasPartner) {
      await AsyncStorage.setItem(HAS_PARTNER_KEY, "true");
    } else {
      const { data: couple } = await supabase
        .from("couples")
        .select("*")
        .or(`user1_id.eq.${currentUser.id},user2_id.eq.${currentUser.id}`)
        .eq("status", "connected")
        .maybeSingle();

      if (couple) {
        hasPartner = true;
        await AsyncStorage.setItem(HAS_PARTNER_KEY, "true");
      }
    }

    const lastUpdated = profile.updated_at
      ? new Date(profile.updated_at).getTime()
      : now.getTime();
    const expiresTime = lastUpdated + 3600 * 1000;
    const remaining = Math.floor((expiresTime - now.getTime()) / 1000);

    let finalCode = profile.invite_code;
    let finalExpires = expiresTime;
    let finalRemaining = remaining;

    if (profile.invite_code && remaining > 0) {
      finalCode = profile.invite_code;
      finalExpires = expiresTime;
      finalRemaining = remaining;
    } else {
      const newCode = generateInviteCode();
      const nowIso = now.toISOString();
      const freshExpires = now.getTime() + 3600 * 1000;
      await supabase
        .from("profiles")
        .update({ invite_code: newCode, updated_at: nowIso })
        .eq("id", currentUser.id);
      finalCode = newCode;
      finalExpires = freshExpires;
      finalRemaining = 3600;
    }

    registerForPushNotificationsAsync(currentUser.id).catch((pushErr) => {
      console.warn("Auto push token registration note:", pushErr);
    });

    return {
      hasPartner,
      userName: finalName,
      avatarUrl: finalAvatar,
      relationshipType: finalRelationship,
      inviteCode: finalCode,
      codeExpiresAt: finalExpires,
      codeExpiresInSeconds: finalRemaining,
    };
  } catch (err: unknown) {
    console.warn("Failed to sync profile:", err);
    return null;
  }
}
