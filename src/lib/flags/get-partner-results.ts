import { supabase } from "@/src/lib/supabase";
import { FlagPartnerResultItem } from "@/src/types";

export interface PartnerFlagResultsResponse {
  isReady: boolean;
  items: FlagPartnerResultItem[];
  results?: FlagPartnerResultItem[];
  agreementsCount: number;
  disagreementsCount: number;
  totalCount: number;
}

/**
 * Calls the security definer get_flag_results RPC.
 * Only returns results when BOTH partners have submitted all answers.
 */
export async function getPartnerResults(
  sessionId: string,
): Promise<PartnerFlagResultsResponse> {
  try {
    const { data, error } = await supabase.rpc("get_flag_results", {
      p_session_id: sessionId,
    });

    if (error) {
      console.warn("[flags] Error in get_flag_results:", error.message);
      return {
        isReady: false,
        items: [],
        results: [],
        agreementsCount: 0,
        disagreementsCount: 0,
        totalCount: 0,
      };
    }

    if (!data || data.length === 0) {
      return {
        isReady: false,
        items: [],
        results: [],
        agreementsCount: 0,
        disagreementsCount: 0,
        totalCount: 0,
      };
    }

    const items: FlagPartnerResultItem[] = data.map((row) => ({
      statement_id: row.statement_id,
      my_vote: row.my_vote,
      partner_vote: row.partner_vote,
      is_agreement: row.is_agreement,
      partner_id: row.partner_id,
    }));

    const agreementsCount = items.filter((i) => i.is_agreement).length;
    const disagreementsCount = items.length - agreementsCount;

    return {
      isReady: true,
      items,
      results: items,
      agreementsCount,
      disagreementsCount,
      totalCount: items.length,
    };
  } catch (err) {
    console.warn("[flags] Failed to fetch partner results:", err);
    return {
      isReady: false,
      items: [],
      results: [],
      agreementsCount: 0,
      disagreementsCount: 0,
      totalCount: 0,
    };
  }
}
