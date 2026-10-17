import React, { useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/src/lib/supabase";
import {
  AuthSignInResult,
  AuthPartnerConnectResult,
  RelationshipType,
} from "@/src/types";
import { SessionAuthContext, PartnerAuthContext } from "./auth-context";
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
        const getSessionWithTimeout = () =>
          Promise.race([
            supabase.auth.getSession(),
            new Promise<{ data: { session: null }; error: null }>((resolve) =>
              setTimeout(
                () => resolve({ data: { session: null }, error: null }),
                3000,
              ),
            ),
          ]);

        const [
          storedPartner,
          storedRelationship,
          storedName,
          storedAvatar,
          sessionResult,
        ] = await Promise.all([
          AsyncStorage.getItem(HAS_PARTNER_KEY),
          AsyncStorage.getItem(RELATIONSHIP_TYPE_KEY),
          AsyncStorage.getItem(USER_NAME_KEY),
          AsyncStorage.getItem(AVATAR_URL_KEY),
          getSessionWithTimeout(),
        ]);

        if (storedPartner !== null) {
          setHasPartnerState(storedPartner === "true");
        }
        if (
          storedRelationship === "local" ||
          storedRelationship === "long_distance"
        ) {
          setRelationshipTypeState(storedRelationship as RelationshipType);
        }
        if (storedName) {
          setUserNameState(storedName);
        }
        if (storedAvatar) {
          setAvatarUrlState(storedAvatar);
        }

        if (sessionResult.data?.session) {
          setSession(sessionResult.data.session);
          supabase.realtime.setAuth(sessionResult.data.session.access_token);
          setUser(sessionResult.data.session.user);
          applyProfileSync(sessionResult.data.session.user).catch((syncErr) => {
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
      if (currentSession?.access_token) {
        supabase.realtime.setAuth(currentSession.access_token);
      }
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

    const markPartnerConnected = (connected: boolean) => {
      setHasPartnerState(connected);
      AsyncStorage.setItem(
        HAS_PARTNER_KEY,
        connected ? "true" : "false",
      ).catch(() => {});
    };

    // 1. Own profile changes (partner_id set/cleared on BOTH devices via connect_partner_code)
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
          if (payload.eventType === "DELETE") {
            markPartnerConnected(false);
            return;
          }
          if (payload.new) {
            const row = payload.new as {
              partner_id?: string | null;
              relationship_type?: RelationshipType | null;
              full_name?: string | null;
              avatar_url?: string | null;
            };

            markPartnerConnected(Boolean(row.partner_id));

            if (row.relationship_type) {
              setRelationshipTypeState(row.relationship_type);
              AsyncStorage.setItem(
                RELATIONSHIP_TYPE_KEY,
                row.relationship_type,
              ).catch(() => {});
            }
            if (row.full_name) {
              setUserNameState(row.full_name);
              AsyncStorage.setItem(USER_NAME_KEY, row.full_name).catch(() => {});
            }
            if (row.avatar_url) {
              setAvatarUrlState(row.avatar_url);
              AsyncStorage.setItem(AVATAR_URL_KEY, row.avatar_url).catch(() => {});
            }
          }
        },
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.warn("[realtime] profile channel error");
        }
      });

    // 2. Couples row INSERT/UPDATE — backup signal so both partners flip to Connected
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
          if (payload.eventType === "DELETE" && payload.old) {
            const old = payload.old as {
              user1_id?: string;
              user2_id?: string;
            };
            if (old.user1_id === user.id || old.user2_id === user.id) {
              markPartnerConnected(false);
            }
            return;
          }

          if (payload.new) {
            const row = payload.new as {
              user1_id?: string;
              user2_id?: string;
              status?: string;
              relationship_type?: RelationshipType;
            };
            if (row.user1_id === user.id || row.user2_id === user.id) {
              if (row.status === "connected") {
                markPartnerConnected(true);
              }
              if (
                row.relationship_type === "local" ||
                row.relationship_type === "long_distance"
              ) {
                setRelationshipTypeState(row.relationship_type);
                AsyncStorage.setItem(
                  RELATIONSHIP_TYPE_KEY,
                  row.relationship_type,
                ).catch(() => {});
              }
            }
          }
        },
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.warn("[realtime] couples channel error");
        }
      });

    return () => {
      supabase.removeChannel(profileChannel).catch(() => {});
      supabase.removeChannel(couplesChannel).catch(() => {});
    };
  }, [user]);

  // Backup poll while partner is pending — keeps Home + Invite in sync if a realtime event is missed
  useEffect(() => {
    if (!user || hasPartner) return;

    let cancelled = false;

    const pollPartnerStatus = async () => {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("partner_id")
          .eq("id", user.id)
          .maybeSingle();

        if (cancelled) return;

        if (profile?.partner_id) {
          setHasPartnerState(true);
          AsyncStorage.setItem(HAS_PARTNER_KEY, "true").catch(() => {});
          return;
        }

        const { data: couple } = await supabase
          .from("couples")
          .select("id")
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
          .eq("status", "connected")
          .maybeSingle();

        if (!cancelled && couple) {
          setHasPartnerState(true);
          AsyncStorage.setItem(HAS_PARTNER_KEY, "true").catch(() => {});
        }
      } catch {
        // ignore
      }
    };

    pollPartnerStatus();
    const interval = setInterval(pollPartnerStatus, 4000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [user, hasPartner]);

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

      // Client fallback cannot update the other user's profile (RLS). Prefer RPC.
      // Still link self + create couples row so this device connects; partner
      // must have connect_partner_code migration for mutual realtime link.
      const { error: updateSelfErr } = await supabase
        .from("profiles")
        .update({ partner_id: partnerProfile.id, updated_at: nowIso })
        .eq("id", user.id);

      if (updateSelfErr) {
        console.error("Error updating user profile:", updateSelfErr);
        return {
          success: false,
          message: "Could not link your profile. Please try again.",
        };
      }

      const { error: updatePartnerErr } = await supabase
        .from("profiles")
        .update({ partner_id: user.id, updated_at: nowIso })
        .eq("id", partnerProfile.id);

      if (updatePartnerErr) {
        console.warn(
          "Partner profile update blocked by RLS (expected without RPC):",
          updatePartnerErr,
        );
      }

      const { error: coupleErr } = await supabase.from("couples").upsert({
        user1_id: user.id,
        user2_id: partnerProfile.id,
        status: "connected",
        connected_at: nowIso,
      });

      if (coupleErr) {
        console.warn("Couples upsert note:", coupleErr);
      }

      await setHasPartner(true);

      if (updatePartnerErr) {
        return {
          success: true,
          message:
            "Connected on your side. Ask your partner to open the app — if they stay on Partner Pending, run the partner-connect SQL migration on Supabase.",
        };
      }

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

  const sessionValue = useMemo(
    () => ({
      user,
      session,
      isLoading,
      continueWithGoogle,
      signInWithGoogle,
      signInWithEmail,
      userName,
      setUserName,
      avatarUrl,
      setAvatarUrl,
      updateProfile,
      signOut,
      deleteAccount,
    }),
    // Functions close over latest render; value identity follows session/profile fields.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, session, isLoading, userName, avatarUrl],
  );

  const partnerValue = useMemo(
    () => ({
      hasPartner,
      relationshipType,
      inviteCode,
      codeExpiresInSeconds,
      codeExpiresAt,
      refreshInviteCode,
      setHasPartner,
      setRelationshipType,
      connectPartnerCode,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      hasPartner,
      relationshipType,
      inviteCode,
      codeExpiresInSeconds,
      codeExpiresAt,
    ],
  );

  return (
    <SessionAuthContext.Provider value={sessionValue}>
      <PartnerAuthContext.Provider value={partnerValue}>
        {children}
      </PartnerAuthContext.Provider>
    </SessionAuthContext.Provider>
  );
}
