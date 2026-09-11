import { User, Session } from "@supabase/supabase-js";

export * from "./database";

export interface Partner {
  id: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
  isConnected: boolean;
  joinedAt: string | null;
}

export interface DateCardItem {
  id: string;
  category: string;
  categoryColor: string;
  gradientBorder: readonly [string, string, ...string[]];
  body: string;
  location: string;
  website: string;
  shadowColor: string;
}

export type DateIdea = DateCardItem;

export interface DailySpark {
  id: string;
  question: string;
  category?: string;
  date?: string;
  userAnswer?: string;
  partnerAnswer?: string;
}

export interface InviteCodeInfo {
  code: string;
  expiresInSeconds: number;
}

export interface GameModeItem {
  id: string;
  emoji: string;
  title: string;
  gradient: readonly [string, string, ...string[]];
  delay: number;
}

export type RelationshipType = "local" | "long_distance";

export interface OnboardingOption {
  id: RelationshipType;
  title: string;
  emoji: string;
}

export interface AuthSignInResult {
  error?: string;
  hasPartner: boolean;
  user?: User | null;
}

export interface AuthPartnerConnectResult {
  success: boolean;
  message?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  hasPartner: boolean;
  relationshipType: RelationshipType | null;
  inviteCode: string;
  codeExpiresInSeconds: number;
  codeExpiresAt: number;
  refreshInviteCode: () => Promise<string>;
  signInWithGoogle: () => Promise<AuthSignInResult>;
  signInWithEmail: (
    email: string,
    password: string,
  ) => Promise<{ error?: string; hasPartner: boolean }>;
  signOut: () => Promise<void>;
  setHasPartner: (status: boolean) => Promise<void>;
  setRelationshipType: (type: RelationshipType) => Promise<void>;
  connectPartnerCode: (code: string) => Promise<AuthPartnerConnectResult>;
}

export interface InvitePartnerScreenParams {
  source?: string;
  code?: string;
}

export interface HomeScreenParams {
  partnerConnected?: string;
}

export interface LoveMatchResultScreenParams {
  name1?: string;
  name2?: string;
  overall?: string;
  communication?: string;
  chemistry?: string;
  trust?: string;
  longTerm?: string;
  [key: string]: string | string[] | undefined;
}

export interface CrushCalculatorResultScreenParams {
  yourName?: string;
  crushName?: string;
  percentage?: string;
  headline?: string;
  message?: string;
  [key: string]: string | string[] | undefined;
}
