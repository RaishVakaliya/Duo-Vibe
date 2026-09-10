import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, Session } from "@supabase/supabase-js";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "@/lib/supabase";

const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "";

// Configure GoogleSignin with your Web Client ID from Google Cloud Console
GoogleSignin.configure({
  scopes: [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ],
  webClientId: GOOGLE_WEB_CLIENT_ID,
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  hasPartner: boolean;
  inviteCode: string;
  signInWithGoogle: () => Promise<{
    error?: string;
    hasPartner: boolean;
    user?: User | null;
  }>;
  signInWithEmail: (
    email: string,
    password: string,
  ) => Promise<{ error?: string; hasPartner: boolean }>;
  signUpWithEmail: (
    email: string,
    password: string,
  ) => Promise<{ error?: string; hasPartner: boolean }>;
  signOut: () => Promise<void>;
  setHasPartner: (status: boolean) => Promise<void>;
  connectPartnerCode: (
    code: string,
  ) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const HAS_PARTNER_KEY = "@duo_has_partner";

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPartner, setHasPartnerState] = useState(false);
  const [inviteCode] = useState(generateInviteCode());

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedPartner = await AsyncStorage.getItem(HAS_PARTNER_KEY);
        if (storedPartner !== null) {
          setHasPartnerState(storedPartner === "true");
        }

        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          setSession(data.session);
          setUser(data.session.user);
        }
      } catch (err) {
        console.warn("Error initializing auth:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const setHasPartner = async (status: boolean) => {
    setHasPartnerState(status);
    await AsyncStorage.setItem(HAS_PARTNER_KEY, status ? "true" : "false");
  };

  const signInWithGoogle = async (): Promise<{
    error?: string;
    hasPartner: boolean;
    user?: User | null;
  }> => {
    try {
      setIsLoading(true);

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Launch Native Google In-App Account Bottom Sheet
      const userInfo = await GoogleSignin.signIn();

      if (!userInfo.data?.idToken) {
        throw new Error("No ID token returned from Google Sign-In.");
      }

      // Exchange ID token directly with Supabase
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
    } catch (err: any) {
      if (err?.code === statusCodes.SIGN_IN_CANCELLED) {
        return {
          error: "Google sign-in was cancelled.",
          hasPartner: false,
        };
      }
      if (err?.code === statusCodes.IN_PROGRESS) {
        return {
          error: "Sign in already in progress.",
          hasPartner: false,
        };
      }
      if (err?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        return {
          error: "Google Play Services not available or outdated.",
          hasPartner: false,
        };
      }

      console.error("Native Google Sign-In Error:", err);
      return {
        error: err?.message || "Google sign-in failed. Please try again.",
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
    } catch (err: any) {
      return { error: err?.message || "Sign in failed", hasPartner: false };
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
  ): Promise<{ error?: string; hasPartner: boolean }> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      setUser(data.user);
      setSession(data.session);
      const storedPartner = await AsyncStorage.getItem(HAS_PARTNER_KEY);
      return { hasPartner: storedPartner === "true" };
    } catch (err: any) {
      return { error: err?.message || "Sign up failed", hasPartner: false };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      try {
        await GoogleSignin.signOut();
      } catch {}
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (err) {
      console.warn("Error signing out:", err);
    }
  };

  const connectPartnerCode = async (
    code: string,
  ): Promise<{ success: boolean; message?: string }> => {
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
        inviteCode,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        setHasPartner,
        connectPartnerCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
