import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/src/lib/supabase";
import { generateInviteCode } from "@/src/lib/auth/profile-fetch";

const GOOGLE_WEB_CLIENT_ID: string =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "";

try {
  GoogleSignin.configure({
    scopes: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    webClientId: GOOGLE_WEB_CLIENT_ID,
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });
} catch {
  // Silent fallback when running in non-native or test environments
}

interface AuthErrorLike {
  code?: string | number;
  message?: string;
}

function isAuthError(err: unknown): err is AuthErrorLike {
  return typeof err === "object" && err !== null;
}

export interface ContinueWithGoogleResult {
  user: User | null;
  session: Session | null;
  hasPartner: boolean;
  cancelled?: boolean;
  error?: string;
}

export async function continueWithGoogle(): Promise<ContinueWithGoogleResult> {
  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    try {
      await GoogleSignin.signOut();
    } catch { }

    const userInfo = await GoogleSignin.signIn();

    if (!userInfo.data?.idToken) {
      throw new Error("No ID token returned from Google Sign-In.");
    }

    const { data: idTokenData, error: idTokenError } =
      await supabase.auth.signInWithIdToken({
        provider: "google",
        token: userInfo.data.idToken,
      });

    if (idTokenError) throw idTokenError;

    const user = idTokenData.user;
    const session = idTokenData.session;

    if (!user) {
      throw new Error("No user returned from Supabase authentication.");
    }

    // Determine candidate name and avatar from Google user metadata
    const userMeta = (user.user_metadata ?? {}) as Record<string, unknown>;
    const fullNameMeta = typeof userMeta.full_name === "string" ? userMeta.full_name.trim() : "";
    const nameMeta = typeof userMeta.name === "string" ? userMeta.name.trim() : "";
    const emailPrefix = user.email ? user.email.split("@")[0] : "";
    const candidateName = fullNameMeta || nameMeta || emailPrefix || "Duo Partner";

    const avatarUrlMeta = typeof userMeta.avatar_url === "string" ? userMeta.avatar_url.trim() : "";
    const pictureMeta = typeof userMeta.picture === "string" ? userMeta.picture.trim() : "";
    const candidateAvatar = avatarUrlMeta || pictureMeta || null;

    // Check existing profile to avoid overwriting non-empty name
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, invite_code, partner_id")
      .eq("id", user.id)
      .maybeSingle();

    const existingName = existingProfile?.full_name?.trim();
    const finalName = existingName && existingName.length > 0 ? existingProfile!.full_name : candidateName;
    const finalAvatar = existingProfile?.avatar_url || candidateAvatar;
    const finalInviteCode = existingProfile?.invite_code || generateInviteCode();
    const nowIso = new Date().toISOString();

    const { error: upsertErr } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        email: user.email ?? null,
        full_name: finalName,
        avatar_url: finalAvatar,
        invite_code: finalInviteCode,
        has_completed_onboarding: true,
        updated_at: nowIso,
      },
      { onConflict: "id" },
    );

    if (upsertErr) {
      console.warn("Profile upsert note in continueWithGoogle:", upsertErr);
    }

    let hasPartner = Boolean(existingProfile?.partner_id);
    if (!hasPartner) {
      const { data: couple } = await supabase
        .from("couples")
        .select("id")
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .eq("status", "connected")
        .maybeSingle();
      if (couple) {
        hasPartner = true;
      }
    }

    return {
      user,
      session,
      hasPartner,
    };
  } catch (err: unknown) {
    if (isAuthError(err)) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        return {
          user: null,
          session: null,
          hasPartner: false,
          cancelled: true,
        };
      }
      if (err.code === statusCodes.IN_PROGRESS) {
        return {
          user: null,
          session: null,
          hasPartner: false,
          error: "Sign in already in progress.",
        };
      }
      if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        return {
          user: null,
          session: null,
          hasPartner: false,
          error: "Google Play Services not available or outdated.",
        };
      }
      console.error("Native Google Sign-In Error:", err);
      return {
        user: null,
        session: null,
        hasPartner: false,
        error: err.message || "Google sign-in failed. Please try again.",
      };
    }

    console.error("Unknown Google Sign-In Error:", err);
    return {
      user: null,
      session: null,
      hasPartner: false,
      error: "Google sign-in failed. Please try again.",
    };
  }
}

export const performGoogleSignIn = continueWithGoogle;

export async function signOutGoogle(): Promise<void> {
  try {
    await GoogleSignin.revokeAccess();
  } catch { }
  try {
    await GoogleSignin.signOut();
  } catch { }
}
