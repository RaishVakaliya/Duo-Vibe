import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, Session } from "@supabase/supabase-js";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "@/src/lib/supabase";
import {
  AuthContextType,
  AuthSignInResult,
  AuthPartnerConnectResult,
  RelationshipType,
} from "@/src/types";

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const HAS_PARTNER_KEY = "@duo_has_partner";
const RELATIONSHIP_TYPE_KEY = "@duo_relationship_type";

function generateInviteCode(): string {
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

interface AuthErrorLike {
  code?: string | number;
  message?: string;
}

function isAuthError(err: unknown): err is AuthErrorLike {
  return typeof err === "object" && err !== null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasPartner, setHasPartnerState] = useState<boolean>(false);
  const [relationshipType, setRelationshipTypeState] =
    useState<RelationshipType | null>(null);
  const [inviteCode, setInviteCode] = useState<string>(generateInviteCode());
  const [codeExpiresAt, setCodeExpiresAt] = useState<number>(
    Date.now() + 3600 * 1000,
  );
  const [codeExpiresInSeconds, setCodeExpiresInSeconds] =
    useState<number>(3600);

  const syncUserProfile = async (currentUser: User): Promise<void> => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (error) {
        console.warn("Error fetching profile from Supabase:", error);
        return;
      }

      const now = new Date();
      if (!profile) {
        const newCode = generateInviteCode();
        const nowIso = now.toISOString();
        const expiresTime = now.getTime() + 3600 * 1000;
        await supabase.from("profiles").insert({
          id: currentUser.id,
          email: currentUser.email ?? null,
          full_name: currentUser.user_metadata?.full_name ?? null,
          avatar_url: currentUser.user_metadata?.avatar_url ?? null,
          invite_code: newCode,
          created_at: nowIso,
          updated_at: nowIso,
        });
        setInviteCode(newCode);
        setCodeExpiresAt(expiresTime);
        setCodeExpiresInSeconds(3600);
        setHasPartnerState(false);
      } else {
        if (profile.partner_id) {
          setHasPartnerState(true);
          await AsyncStorage.setItem(HAS_PARTNER_KEY, "true");
        } else {
          const { data: couple } = await supabase
            .from("couples")
            .select("*")
            .or(`user1_id.eq.${currentUser.id},user2_id.eq.${currentUser.id}`)
            .eq("status", "connected")
            .maybeSingle();

          if (couple) {
            setHasPartnerState(true);
            await AsyncStorage.setItem(HAS_PARTNER_KEY, "true");
          }
        }

        const lastUpdated = profile.updated_at
          ? new Date(profile.updated_at).getTime()
          : now.getTime();
        const expiresTime = lastUpdated + 3600 * 1000;
        const remaining = Math.floor((expiresTime - now.getTime()) / 1000);

        if (profile.invite_code && remaining > 0) {
          setInviteCode(profile.invite_code);
          setCodeExpiresAt(expiresTime);
          setCodeExpiresInSeconds(remaining);
        } else {
          const newCode = generateInviteCode();
          const nowIso = now.toISOString();
          const freshExpires = now.getTime() + 3600 * 1000;
          await supabase
            .from("profiles")
            .update({ invite_code: newCode, updated_at: nowIso })
            .eq("id", currentUser.id);
          setInviteCode(newCode);
          setCodeExpiresAt(freshExpires);
          setCodeExpiresInSeconds(3600);
        }
      }
    } catch (err: unknown) {
      console.warn("Failed to sync profile:", err);
    }
  };

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      try {
        const storedPartner = await AsyncStorage.getItem(HAS_PARTNER_KEY);
        if (storedPartner !== null) {
          setHasPartnerState(storedPartner === "true");
        }

        const storedRelationship = await AsyncStorage.getItem(
          RELATIONSHIP_TYPE_KEY,
        );
        if (
          storedRelationship === "local" ||
          storedRelationship === "long_distance"
        ) {
          setRelationshipTypeState(storedRelationship);
        }

        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          setSession(data.session);
          setUser(data.session.user);
          await syncUserProfile(data.session.user);
        }
      } catch (err: unknown) {
        console.warn("Error initializing auth:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, currentSession: Session | null): Promise<void> => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.user) {
          await syncUserProfile(currentSession.user);
        }
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshInviteCode = async (): Promise<string> => {
    const newCode = generateInviteCode();
    const now = new Date();
    const nowIso = now.toISOString();
    const freshExpires = now.getTime() + 3600 * 1000;
    setInviteCode(newCode);
    setCodeExpiresAt(freshExpires);
    setCodeExpiresInSeconds(3600);
    if (user) {
      try {
        await supabase
          .from("profiles")
          .update({ invite_code: newCode, updated_at: nowIso })
          .eq("id", user.id);
      } catch (err: unknown) {
        console.warn("Failed to refresh invite code in Supabase:", err);
      }
    }
    return newCode;
  };

  const setHasPartner = async (status: boolean): Promise<void> => {
    setHasPartnerState(status);
    await AsyncStorage.setItem(HAS_PARTNER_KEY, status ? "true" : "false");
  };

  const setRelationshipType = async (type: RelationshipType): Promise<void> => {
    setRelationshipTypeState(type);
    await AsyncStorage.setItem(RELATIONSHIP_TYPE_KEY, type);
  };

  const signInWithGoogle = async (): Promise<AuthSignInResult> => {
    try {
      setIsLoading(true);

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      try {
        await GoogleSignin.signOut();
      } catch {}

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

      setUser(idTokenData.user);
      setSession(idTokenData.session);

      await syncUserProfile(idTokenData.user);

      const storedPartner = await AsyncStorage.getItem(HAS_PARTNER_KEY);
      const partnerStatus = storedPartner === "true";

      return {
        hasPartner: partnerStatus,
        user: idTokenData.user,
      };
    } catch (err: unknown) {
      if (isAuthError(err)) {
        if (err.code === statusCodes.SIGN_IN_CANCELLED) {
          return {
            error: "Google sign-in was cancelled.",
            hasPartner: false,
          };
        }
        if (err.code === statusCodes.IN_PROGRESS) {
          return {
            error: "Sign in already in progress.",
            hasPartner: false,
          };
        }
        if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          return {
            error: "Google Play Services not available or outdated.",
            hasPartner: false,
          };
        }
        console.error("Native Google Sign-In Error:", err);
        return {
          error: err.message || "Google sign-in failed. Please try again.",
          hasPartner: false,
        };
      }

      console.error("Unknown Google Sign-In Error:", err);
      return {
        error: "Google sign-in failed. Please try again.",
        hasPartner: false,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithEmail = async (
    email: string,
    password: string,
  ): Promise<{ error?: string; hasPartner: boolean }> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setUser(data.user);
      setSession(data.session);
      await syncUserProfile(data.user);
      const storedPartner = await AsyncStorage.getItem(HAS_PARTNER_KEY);
      return { hasPartner: storedPartner === "true" };
    } catch (err: unknown) {
      const message =
        isAuthError(err) && err.message ? err.message : "Sign in failed";
      return { error: message, hasPartner: false };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      try {
        await GoogleSignin.revokeAccess();
      } catch {}
      try {
        await GoogleSignin.signOut();
      } catch {}
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setHasPartnerState(false);
      await AsyncStorage.removeItem(HAS_PARTNER_KEY);
    } catch (err: unknown) {
      console.warn("Error signing out:", err);
    }
  };

  const connectPartnerCode = async (
    code: string,
  ): Promise<AuthPartnerConnectResult> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode || cleanCode.length < 4) {
      return {
        success: false,
        message: "Please enter a valid 6-character partner code.",
      };
    }

    if (!user) {
      return {
        success: false,
        message: "You must be signed in to connect with a partner.",
      };
    }

    if (cleanCode === inviteCode) {
      return {
        success: false,
        message:
          "You cannot connect using your own invite code. Please enter your partner's code.",
      };
    }

    try {
      const { data: partnerProfiles, error: fetchErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("invite_code", cleanCode)
        .neq("id", user.id);

      if (fetchErr) {
        console.error("Supabase query error for partner code:", fetchErr);
        return {
          success: false,
          message: "Failed to verify partner code. Please try again.",
        };
      }

      if (!partnerProfiles || partnerProfiles.length === 0) {
        return {
          success: false,
          message: "Invalid partner code. No partner found with this code.",
        };
      }

      const partnerProfile = partnerProfiles[0];
      if (!partnerProfile) {
        return {
          success: false,
          message: "Invalid partner code.",
        };
      }

      const lastUpdated = partnerProfile.updated_at
        ? new Date(partnerProfile.updated_at).getTime()
        : 0;
      const ageSeconds = Math.floor((Date.now() - lastUpdated) / 1000);
      if (ageSeconds > 3600) {
        return {
          success: false,
          message:
            "This invite code has expired (valid for 1 hour). Please ask your partner to generate a new code.",
        };
      }

      if (partnerProfile.partner_id && partnerProfile.partner_id !== user.id) {
        return {
          success: false,
          message: "This partner is already connected to another space.",
        };
      }

      const nowIso = new Date().toISOString();

      const { error: updateSelfErr } = await supabase
        .from("profiles")
        .update({ partner_id: partnerProfile.id, updated_at: nowIso })
        .eq("id", user.id);

      if (updateSelfErr) {
        console.error("Error updating user profile:", updateSelfErr);
      }

      const { error: updatePartnerErr } = await supabase
        .from("profiles")
        .update({ partner_id: user.id, updated_at: nowIso })
        .eq("id", partnerProfile.id);

      if (updatePartnerErr) {
        console.error("Error updating partner profile:", updatePartnerErr);
      }

      try {
        await supabase.from("couples").upsert({
          user1_id: user.id,
          user2_id: partnerProfile.id,
          status: "connected",
          connected_at: nowIso,
        });
      } catch (coupleErr) {
        console.warn("Couples upsert note:", coupleErr);
      }

      await setHasPartner(true);
      return {
        success: true,
        message: "Successfully connected with your partner! 💕",
      };
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      return { success: false, message: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        hasPartner,
        relationshipType,
        inviteCode,
        codeExpiresInSeconds,
        codeExpiresAt,
        refreshInviteCode,
        signInWithGoogle,
        signInWithEmail,
        signOut,
        setHasPartner,
        setRelationshipType,
        connectPartnerCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
