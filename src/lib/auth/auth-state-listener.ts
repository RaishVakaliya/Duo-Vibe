import { Session } from "@supabase/supabase-js";
import { supabase } from "@/src/lib/supabase";

export type AuthStateChangeCallback = (session: Session | null) => void | Promise<void>;

export function subscribeToAuthState(callback: AuthStateChangeCallback): () => void {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
    await callback(currentSession);
  });

  return () => {
    subscription.unsubscribe();
  };
}
