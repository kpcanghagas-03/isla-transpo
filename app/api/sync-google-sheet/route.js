import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Fetch all transport requests
    const { data: requests, error } = await supabase
      .from("transport_requests")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    let synced = 0;
    let skipped = 0;
    let failed = 0;

    for (const request of requests) {
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
          // Apps Script returns success even when the request already exists.
          if (
            result.message &&
            result.message.toLowerCase().includes("already exists")
          ) {
            skipped++;
          } else {
            synced++;
          }
        } else {
          failed++;
          console.error(
            `Failed to sync ${request.request_code}:`,
            result.error
          );
        }
      } catch (err) {
        failed++;
        console.error(
          `Error syncing ${request.request_code}:`,
          err.message
        );
      }
    }

    return Response.json({
      success: true,
      total: requests.length,
      synced,
      skipped,
      failed,
    });
  } catch (err) {
    console.error(err);

    return Response.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}