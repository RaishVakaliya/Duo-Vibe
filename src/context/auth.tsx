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
  const [inviteCode] = useState<string>(generateInviteCode());

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
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

      // Clear any prior cached session so Google always shows all accounts to choose
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
    } catch (err: unknown) {
      console.warn("Error signing out:", err);
    }
  };

  const connectPartnerCode = async (
    code: string,
  ): Promise<AuthPartnerConnectResult> => {
    if (!code || code.trim().length < 4) {
      return { success: false, message: "Please enter a valid partner code." };
    }
    await setHasPartner(true);
    return { success: true, message: "Connected with partner!" };
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
