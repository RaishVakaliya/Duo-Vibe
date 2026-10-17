import { createContext, useContext } from "react";
import { User } from "@supabase/supabase-js";
import {
  AuthContextType,
  SessionAuthContextType,
  PartnerAuthContextType,
} from "@/src/types";
import { ROUTES, AppRoute } from "@/src/constants/routes";

export const SessionAuthContext = createContext<
  SessionAuthContextType | undefined
>(undefined);

export const PartnerAuthContext = createContext<
  PartnerAuthContextType | undefined
>(undefined);

/** @deprecated Prefer SessionAuthContext / PartnerAuthContext */
export const AuthContext = SessionAuthContext;

export interface InitialRouteState {
  user: User | null;
  hasPartner: boolean;
}

export function resolveInitialRoute(
  authStateOrUser: InitialRouteState | User | null,
  legacyHasPartner?: boolean,
): AppRoute {
  const state: InitialRouteState =
    authStateOrUser && typeof authStateOrUser === "object" && "hasPartner" in authStateOrUser
      ? (authStateOrUser as InitialRouteState)
      : {
        user: authStateOrUser as User | null,
        hasPartner: Boolean(legacyHasPartner),
      };

  if (!state.user) {
    return ROUTES.WELCOME;
  }

  if (state.hasPartner) {
    return ROUTES.HOME;
  }

  return ROUTES.INVITE_PARTNER;
}

export function useSessionAuth(): SessionAuthContextType {
  const context = useContext(SessionAuthContext);
  if (!context) {
    throw new Error("useSessionAuth must be used within an AuthProvider");
  }
  return context;
}

export function usePartnerAuth(): PartnerAuthContextType {
  const context = useContext(PartnerAuthContext);
  if (!context) {
    throw new Error("usePartnerAuth must be used within an AuthProvider");
  }
  return context;
}

export function useAuth(): AuthContextType {
  const session = useSessionAuth();
  const partner = usePartnerAuth();
  return { ...session, ...partner };
}
