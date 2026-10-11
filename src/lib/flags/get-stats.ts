import { supabase } from "@/src/lib/supabase";
import { FlagStat } from "@/src/types";

/**
 * Fetches community statistics for a batch of statement IDs.
 * Only returns rows for statements that have at least 20 recorded votes.
 */
export async function getFlagStats(
  statementIds: string[],
): Promise<Map<string, FlagStat>> {
  const statsMap = new Map<string, FlagStat>();
  if (!statementIds || statementIds.length === 0) {
    return statsMap;
  }

  try {
    const { data, error } = await supabase.rpc("get_flag_stats", {
      p_statement_ids: statementIds,
    });

    if (error) {
      console.warn("[flags] Failed to fetch flag stats:", error.message);
      return statsMap;
    }

    if (data && Array.isArray(data)) {
      data.forEach((item) => {
        statsMap.set(item.statement_id, {
          statement_id: item.statement_id,
          total_votes: Number(item.total_votes),
          red_votes: Number(item.red_votes),
          green_votes: Number(item.green_votes),
          red_percentage: Number(item.red_percentage),
          green_percentage: Number(item.green_percentage),
        });
      });
    }
  } catch (err) {
    console.warn("[flags] Error in getFlagStats:", err);
  }

  return statsMap;
}
