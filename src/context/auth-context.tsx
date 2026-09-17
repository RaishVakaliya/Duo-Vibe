import { createContext, useContext } from "react";
import { User } from "@supabase/supabase-js";
import { AuthContextType } from "@/src/types";
import { ROUTES, AppRoute } from "@/src/constants/routes";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface InitialRouteState {
  user: User | null;
  hasPartner: boolean;
  onboardingComplete?: boolean;
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

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
