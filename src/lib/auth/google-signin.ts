import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/src/lib/supabase";

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
} catch (e: unknown) {
  console.log("GoogleSignin configure note:", e);
}

interface AuthErrorLike {
  code?: string | number;
  message?: string;
}

function isAuthError(err: unknown): err is AuthErrorLike {
  return typeof err === "object" && err !== null;
}

export async function performGoogleSignIn(): Promise<{
  user: User | null;
  session: Session | null;
  error?: string;
}> {
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

    return {
      user: idTokenData.user,
      session: idTokenData.session,
    };
  } catch (err: unknown) {
    if (isAuthError(err)) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        return {
          user: null,
          session: null,
          error: "Google sign-in was cancelled.",
        };
      }
      if (err.code === statusCodes.IN_PROGRESS) {
        return {
          user: null,
          session: null,
          error: "Sign in already in progress.",
        };
      }
      if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        return {
          user: null,
          session: null,
          error: "Google Play Services not available or outdated.",
        };
      }
      console.error("Native Google Sign-In Error:", err);
      return {
        user: null,
        session: null,
        error: err.message || "Google sign-in failed. Please try again.",
      };
    }

    console.error("Unknown Google Sign-In Error:", err);
    return {
      user: null,
      session: null,
      error: "Google sign-in failed. Please try again.",
    };
  }
}

export async function signOutGoogle(): Promise<void> {
  try {
    await GoogleSignin.revokeAccess();
  } catch { }
  try {
    await GoogleSignin.signOut();
  } catch { }
}
