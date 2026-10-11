import { supabase } from "@/src/lib/supabase";
import { FlagSession } from "@/src/types";
import { selectFlagStatements } from "./select-statements";

function rowToSession(row: {
  id: string;
  couple_key: string;
  created_by: string;
  statement_ids: unknown;
  created_at: string;
}): FlagSession {
  const ids = Array.isArray(row.statement_ids)
    ? (row.statement_ids as string[])
    : [];

  return {
    id: row.id,
    couple_key: row.couple_key,
    created_by: row.created_by,
    statement_ids: ids,
    created_at: row.created_at,
  };
}

/**
 * Fetches the active partner session or creates a new one.
 * If forceNew is false and an in-progress session exists, returns the existing one.
 */
export async function getOrCreatePartnerSession(
  coupleKey: string,
  userId: string,
  forceNew = false,
): Promise<FlagSession> {
  if (!forceNew) {
    // Check latest session for couple
    const { data: latest } = await supabase
      .from("flag_sessions")
      .select("id, couple_key, created_by, statement_ids, created_at")
      .eq("couple_key", coupleKey)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latest) {
      // Check if both partners already answered all 20
      const session = rowToSession(latest);
      const { data: results } = await supabase.rpc("get_flag_results", {
        p_session_id: session.id,
      });

      // If results are NOT ready, session is still in progress!
      if (!results || results.length === 0) {
        return session;
      }
    }
  }

  // Create new session
  const statements = selectFlagStatements();
  const statementIds = statements.map((s) => s.id);

  const { data, error } = await supabase
    .from("flag_sessions")
    .insert({
      couple_key: coupleKey,
      created_by: userId,
      statement_ids: statementIds,
    })
    .select("id, couple_key, created_by, statement_ids, created_at")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to create partner session.");
  }

  return rowToSession(data);
}

/**
 * Fetch a session by ID.
 */
export async function getSessionById(
  sessionId: string,
): Promise<FlagSession | null> {
  const { data, error } = await supabase
    .from("flag_sessions")
    .select("id, couple_key, created_by, statement_ids, created_at")
    .eq("id", sessionId)
    .maybeSingle();

  if (error || !data) return null;
  return rowToSession(data);
}
