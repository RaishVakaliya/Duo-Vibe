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
  continueWithGoogle as continueWithGoogleLib,
  signOutGoogle,
} from "@/src/lib/auth/google-signin";
import {
  HAS_PARTNER_KEY,
  RELATIONSHIP_TYPE_KEY,
  USER_NAME_KEY,
  AVATAR_URL_KEY,
  INVITE_CODE_VALIDITY_SECONDS,
  INVITE_CODE_VALIDITY_MS,
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
    Date.now() + INVITE_CODE_VALIDITY_MS,
  );
  const [codeExpiresInSeconds, setCodeExpiresInSeconds] =
    useState<number>(INVITE_CODE_VALIDITY_SECONDS);

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

        const getSessionWithTimeout = async () => {
          return Promise.race([
            supabase.auth.getSession(),
            new Promise<{ data: { session: null }; error: null }>((resolve) =>
              setTimeout(
                () => resolve({ data: { session: null }, error: null }),
                3000,
              ),
            ),
          ]);
        };

        const { data } = await getSessionWithTimeout();
        if (data?.session) {
          setSession(data.session);
          setUser(data.session.user);
          // Sync profile non-blockingly so app startup/splash never gets stuck
          applyProfileSync(data.session.user).catch((syncErr) => {
            console.warn("Async profile sync error on init:", syncErr);
          });
        }
      } catch (err: unknown) {
        console.warn("Error initializing auth:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const unsubscribe = subscribeToAuthState((currentSession) => {
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        // Run outside the auth state listener stack to prevent Supabase mutex deadlock
        setTimeout(() => {
          applyProfileSync(currentUser).catch((err) => {
            console.warn("Async auth state sync error:", err);
          });
        }, 0);
      }
    });

    return unsubscribe;
  }, []);

  const refreshInviteCode = async (): Promise<string> => {
    const newCode = generateInviteCode();
    const now = new Date();
    const nowIso = now.toISOString();
    const freshExpires = now.getTime() + INVITE_CODE_VALIDITY_MS;
    setInviteCode(newCode);
    setCodeExpiresAt(freshExpires);
    setCodeExpiresInSeconds(INVITE_CODE_VALIDITY_SECONDS);
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

  useEffect(() => {
    if (!user) return;

    // 1. Listen for real-time changes to the user's profile (including partner linking/unlinking)
    const profileChannel = supabase
      .channel(`profile_realtime_${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new) {
            const row = payload.new as {
              partner_id?: string | null;
              relationship_type?: RelationshipType | null;
              full_name?: string | null;
              avatar_url?: string | null;
            };

            const partnerConnected = Boolean(row.partner_id);
            setHasPartnerState(partnerConnected);
            AsyncStorage.setItem(
              HAS_PARTNER_KEY,
              partnerConnected ? "true" : "false",
            ).catch(() => { });

            if (row.relationship_type) {
              setRelationshipTypeState(row.relationship_type);
              AsyncStorage.setItem(
                RELATIONSHIP_TYPE_KEY,
                row.relationship_type,
              ).catch(() => { });
            }
            if (row.full_name) {
              setUserNameState(row.full_name);
              AsyncStorage.setItem(USER_NAME_KEY, row.full_name).catch(() => { });
            }
            if (row.avatar_url) {
              setAvatarUrlState(row.avatar_url);
              AsyncStorage.setItem(AVATAR_URL_KEY, row.avatar_url).catch(() => { });
            }
          }
        },
      )
      .subscribe();

    // 2. Listen for couple changes (INSERT or UPDATE) involving this user
    const couplesChannel = supabase
      .channel(`couples_realtime_${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "couples",
        },
        (payload) => {
          if (payload.new) {
            const row = payload.new as {
              user1_id?: string;
              user2_id?: string;
              status?: string;
              relationship_type?: RelationshipType;
            };
            if (row.user1_id === user.id || row.user2_id === user.id) {
              if (row.status === "connected") {
                setHasPartnerState(true);
                AsyncStorage.setItem(HAS_PARTNER_KEY, "true").catch(() => { });
              }
              if (
                row.relationship_type === "local" ||
                row.relationship_type === "long_distance"
              ) {
                setRelationshipTypeState(row.relationship_type);
                AsyncStorage.setItem(
                  RELATIONSHIP_TYPE_KEY,
                  row.relationship_type,
                ).catch(() => { });
              }
            }
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profileChannel).catch(() => { });
      supabase.removeChannel(couplesChannel).catch(() => { });
    };
  }, [user]);

  const setRelationshipType = async (type: RelationshipType): Promise<void> => {
    setRelationshipTypeState(type);
    await AsyncStorage.setItem(RELATIONSHIP_TYPE_KEY, type);
    if (user) {
      try {
        const nowIso = new Date().toISOString();
        await supabase
          .from("profiles")
          .update({
            relationship_type: type,
            updated_at: nowIso,
          })
          .eq("id", user.id);

        const { data: myProfile } = await supabase
          .from("profiles")
          .select("partner_id")
          .eq("id", user.id)
          .maybeSingle();

        if (myProfile?.partner_id) {
          await supabase
            .from("profiles")
            .update({
              relationship_type: type,
              updated_at: nowIso,
            })
            .eq("id", myProfile.partner_id);

          await supabase
            .from("couples")
            .update({
              relationship_type: type,
            })
            .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);
        }
      } catch (err) {
        console.warn("Error updating relationship type:", err);
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
        // 1. Try atomic security definer RPC
        const { data: rpcRes, error: rpcErr } = await supabase.rpc(
          "delete_user_account",
        );

        if (rpcErr || (rpcRes && !(rpcRes as { success: boolean }).success)) {
          console.warn(
            "delete_user_account RPC failed, running fallback cleanup:",
            rpcErr,
          );

          // 2. Comprehensive client-side fallback cleanup
          await supabase
            .from("profiles")
            .update({ partner_id: null, updated_at: new Date().toISOString() })
            .eq("partner_id", user.id);

          await supabase
            .from("couples")
            .delete()
            .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

          await supabase
            .from("memory_reactions")
            .delete()
            .eq("user_id", user.id);
          await supabase.from("memories").delete().eq("created_by", user.id);
          await supabase.from("flag_answers").delete().eq("user_id", user.id);
          await supabase.from("flag_votes").delete().eq("user_id", user.id);
          await supabase
            .from("flag_sessions")
            .delete()
            .or(`user_id.eq.${user.id},partner_id.eq.${user.id}`);
          await supabase
            .from("chat_messages")
            .delete()
            .eq("sender_id", user.id);
          await supabase
            .from("secret_crush_messages")
            .delete()
            .eq("sender_id", user.id);
          await supabase
            .from("twenty_one_questions_answers")
            .delete()
            .eq("user_id", user.id);
          await supabase
            .from("couple_challenge_completions")
            .delete()
            .eq("user_id", user.id);
          await supabase
            .from("couple_challenge_progress")
            .delete()
            .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`);
          await supabase.from("spark_answers").delete().eq("user_id", user.id);
          await supabase.from("profiles").delete().eq("id", user.id);
        }
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

  const continueWithGoogle = async (): Promise<AuthSignInResult> => {
    try {
      setIsLoading(true);
      const res = await continueWithGoogleLib();
      if (res.cancelled) {
        return { cancelled: true, hasPartner: false };
      }
      if (res.error) {
        return { error: res.error, hasPartner: false };
      }
      if (res.user) {
        setUser(res.user);
        setSession(res.session);
        await applyProfileSync(res.user);
        return {
          hasPartner: res.hasPartner,
          user: res.user,
        };
      }
      return { error: "Google sign-in failed. Please try again.", hasPartner: false };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = continueWithGoogle;

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
      // 1. Try atomic database RPC (bypasses RLS to atomically link both profiles & create couples row)
      const { data: rpcData, error: rpcError } = await supabase.rpc(
        "connect_partner_code",
        { p_partner_code: cleanCode },
      );

      if (!rpcError && rpcData) {
        const res = rpcData as { success: boolean; message: string };
        if (res.success) {
          await setHasPartner(true);
          syncUserProfile(user).catch(() => { });
          return res;
        } else {
          return res;
        }
      }

      // 2. Client-side fallback if RPC is not yet created
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
      if (ageSeconds > INVITE_CODE_VALIDITY_SECONDS) {
        return {
          success: false,
          message:
            "This invite code has expired (valid for 2 days). Please ask your partner to generate a new code.",
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
      continueWithGoogle,
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
