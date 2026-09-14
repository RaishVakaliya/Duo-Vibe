import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    // Handle both direct invocation and Postgres webhook trigger payloads
    const record = payload.record || payload;
    const sessionId = record.sessionId || record.id;
    const reviewerId = record.reviewerId || record.reviewer_id;

    if (!reviewerId) {
      return new Response(JSON.stringify({ error: "Missing reviewerId" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Fetch the reviewer's push token from profiles
    const { data: reviewerProfile, error: profileErr } = await supabase
      .from("profiles")
      .select("push_token")
      .eq("id", reviewerId)
      .single();

    if (profileErr || !reviewerProfile?.push_token) {
      return new Response(
        JSON.stringify({
          message:
            "No push token found for reviewer, skipping push notification.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    }

    const pushToken = reviewerProfile.push_token;

    // Send Expo push notification
    const pushMessage = {
      to: pushToken,
      sound: "default",
      title: "Couple Quiz 💕",
      body: "Your partner finished a Couple Quiz — come review their answers!",
      data: {
        sessionId,
        type: "quiz_review",
      },
    };

    const pushResponse = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pushMessage),
    });

    const pushResult = await pushResponse.json();

    return new Response(JSON.stringify({ success: true, pushResult }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
