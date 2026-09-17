import React, { useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/src/lib/supabase";
import {
  AuthSignInResult,
  AuthPartnerConnectResult,
  RelationshipType,
} from "@/src/types";
import { AuthContext } from "./auth-context";
import {
  performGoogleSignIn,
  signOutGoogle,
} from "@/src/lib/auth/google-signin";
import {
  HAS_PARTNER_KEY,
  RELATIONSHIP_TYPE_KEY,
  USER_NAME_KEY,
  AVATAR_URL_KEY,
  generateInviteCode,
  syncUserProfile,
} from "@/src/lib/auth/profile-fetch";
import { subscribeToAuthState } from "@/src/lib/auth/auth-state-listener";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasPartner, setHasPartnerState] = useState<boolean>(false);
  const [userName, setUserNameState] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrlState] = useState<string | null>(null);
  const [relationshipType, setRelationshipTypeState] =
    useState<RelationshipType | null>(null);
  const [inviteCode, setInviteCode] = useState<string>(generateInviteCode());
  const [codeExpiresAt, setCodeExpiresAt] = useState<number>(
    Date.now() + 3600 * 1000,
  );
  const [codeExpiresInSeconds, setCodeExpiresInSeconds] =
    useState<number>(3600);

  const applyProfileSync = async (currentUser: User): Promise<void> => {
    const synced = await syncUserProfile(currentUser);
    if (synced) {
      setHasPartnerState(synced.hasPartner);
      if (synced.userName) setUserNameState(synced.userName);
      if (synced.avatarUrl) setAvatarUrlState(synced.avatarUrl);
      if (synced.relationshipType) setRelationshipTypeState(synced.relationshipType);
      setInviteCode(synced.inviteCode);
      setCodeExpiresAt(synced.codeExpiresAt);
      setCodeExpiresInSeconds(synced.codeExpiresInSeconds);
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
          setRelationshipTypeState(storedRelationship as RelationshipType);
        }

        const storedName = await AsyncStorage.getItem(USER_NAME_KEY);
        if (storedName) {
          setUserNameState(storedName);
        }

        const storedAvatar = await AsyncStorage.getItem(AVATAR_URL_KEY);
        if (storedAvatar) {
          setAvatarUrlState(storedAvatar);
        }

        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          setSession(data.session);
          setUser(data.session.user);
          await applyProfileSync(data.session.user);
        }
      } catch (err: unknown) {
        console.warn("Error initializing auth:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const unsubscribe = subscribeToAuthState(async (currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        await applyProfileSync(currentSession.user);
      }
    });

    return unsubscribe;
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
    if (user) {
      try {
        await supabase
          .from("profiles")
          .update({
            relationship_type: type,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);
      } catch (err) {
        console.warn("Error updating relationship type in profile:", err);
      }
    }
  };

  const setUserName = async (name: string): Promise<void> => {
    const trimmed = name.trim();
    setUserNameState(trimmed);
    await AsyncStorage.setItem(USER_NAME_KEY, trimmed);
    if (user) {
      try {
        await supabase
          .from("profiles")
          .update({
            full_name: trimmed,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);
      } catch (err) {
        console.warn("Error syncing user name to profile:", err);
      }
    }
  };

  const setAvatarUrl = async (url: string): Promise<void> => {
    const trimmed = url.trim();
    setAvatarUrlState(trimmed);
    await AsyncStorage.setItem(AVATAR_URL_KEY, trimmed);
    if (user) {
      try {
        await supabase
          .from("profiles")
          .update({
            avatar_url: trimmed,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);
      } catch (err) {
        console.warn("Error syncing avatar to profile:", err);
      }
    }
  };

  const updateProfile = async (updates: {
    fullName?: string;
    avatarUrl?: string;
  }): Promise<void> => {
    if (updates.fullName !== undefined) {
      await setUserName(updates.fullName);
    }
    if (updates.avatarUrl !== undefined) {
      await setAvatarUrl(updates.avatarUrl);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await signOutGoogle();
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setHasPartnerState(false);
      setAvatarUrlState(null);
      await AsyncStorage.multiRemove([HAS_PARTNER_KEY, AVATAR_URL_KEY]);
    } catch (err: unknown) {
      console.warn("Error signing out:", err);
    }
  };

  const deleteAccount = async (): Promise<void> => {
    try {
      if (user) {
        await supabase
          .from("profiles")
          .update({ partner_id: null, updated_at: new Date().toISOString() })
          .eq("partner_id", user.id);

        await supabase
          .from("couples")
          .delete()
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

        await supabase.from("profiles").delete().eq("id", user.id);
      }
    } catch (err) {
      console.warn("Error during deleteAccount cleanup:", err);
    } finally {
      await signOut();
      await AsyncStorage.multiRemove([
        HAS_PARTNER_KEY,
        RELATIONSHIP_TYPE_KEY,
        USER_NAME_KEY,
        AVATAR_URL_KEY,
      ]);
      setUserNameState(null);
      setAvatarUrlState(null);
      setHasPartnerState(false);
      setRelationshipTypeState(null);
    }
  };

  const signInWithGoogle = async (): Promise<AuthSignInResult> => {
    try {
      setIsLoading(true);
      const res = await performGoogleSignIn();
      if (res.error) {
        return { error: res.error, hasPartner: false };
      }
      if (res.user) {
        setUser(res.user);
        setSession(res.session);
        await applyProfileSync(res.user);
        const storedPartner = await AsyncStorage.getItem(HAS_PARTNER_KEY);
        return {
          hasPartner: storedPartner === "true",
          user: res.user,
        };
      }
      return { error: "Google sign-in failed. Please try again.", hasPartner: false };
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
      await applyProfileSync(data.user);
      const storedPartner = await AsyncStorage.getItem(HAS_PARTNER_KEY);
      return { hasPartner: storedPartner === "true" };
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : "Sign in failed";
      return { error: message, hasPartner: false };
    } finally {
      setIsLoading(false);
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

  const contextValue = useMemo(
    () => ({
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
      deleteAccount,
      setHasPartner,
      setRelationshipType,
      userName,
      setUserName,
      avatarUrl,
      setAvatarUrl,
      updateProfile,
      connectPartnerCode,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      user,
      session,
      isLoading,
      hasPartner,
      relationshipType,
      inviteCode,
      codeExpiresInSeconds,
      codeExpiresAt,
      userName,
      avatarUrl,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
