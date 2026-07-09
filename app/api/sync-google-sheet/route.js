import { createClient } from "@supabase/supabase-js";

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Get all transport requests
    const { data, error } = await supabase
      .from("transport_requests")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    let synced = 0;
    let failed = 0;

    for (const request of data) {
      try {
        const response = await fetch(process.env.GOOGLE_SCRIPT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        });

        const result = await response.json();

        if (result.success) {
          synced++;
        } else {
          failed++;
        }

      } catch (err) {
        console.error(err);
        failed++;
      }
    }

    return Response.json({
      success: true,
      total: data.length,
      synced,
      failed,
    });

  } catch (err) {
    return Response.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}