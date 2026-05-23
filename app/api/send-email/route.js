import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

// ================= INIT =================
const resend = new Resend(process.env.RESEND_API_KEY as string);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

// ================= SAFETY CHECKS =================
if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
}

// ================= STATUS TEMPLATE =================
const statusMessage: Record<string, { title: string; message: string }> = {
  Pending: {
    title: "🕒 Your Request is Pending",
    message: "We’ve received your transport request and it’s currently under review.",
  },
  Approved: {
    title: "🚗 Request Approved",
    message: "Good news! Your request has been approved. Our dispatch team is preparing your vehicle.",
  },
  "On the way": {
    title: "🚌 Vehicle is On the Way",
    message: "Your assigned vehicle is now heading to your pickup location. Please be ready.",
  },
  Completed: {
    title: "✅ Trip Completed",
    message: "Your trip has been completed successfully. Thank you for riding with ISLA‑Transpo.",
  },
  Disapproved: {
    title: "❌ Request Disapproved",
    message: "We’re sorry—your request couldn’t be approved at this time. Please contact the admin.",
  },
  Emergency: {
    title: "🚨 Emergency Request",
    message: "Your request is being prioritized. Our team is on it.",
  },
};

// ================= FRIENDLY LINES =================
const quotes = [
  "“Every journey is a new beginning—enjoy the ride.”",
  "“We’re with you every step of the way.”",
  "“Safe roads and smooth travels ahead.”",
  "“Small moments make great memories—have a lovely trip.”",
  "“You’re in good hands—rest easy.”",
  "“May your route be clear and your day be kind.”",
  "“One mile at a time—comfort first.”",
  "“Today’s ride, tomorrow’s story—travel well.”",
];

const comfortLinesByStatus: Record<string, string[]> = {
  Pending: [
    "Thanks for your request—we’re reviewing it with care.",
    "Sit back for a moment—our team’s on it.",
  ],
  Approved: [
    "All set—take your time, we’ve arranged everything.",
    "You’re good to go—wishing you a smooth trip.",
  ],
  "On the way": [
    "Your ride’s en route—no rush, prepare at your pace.",
    "We’re almost there—see you soon.",
  ],
  Completed: [
    "We’re glad to have you with us—thank you.",
    "Hope the ride was comfortable—until next time.",
  ],
  Disapproved: [
    "We understand plans change—reach out if we can help.",
    "We’re here to answer questions—just reply to this email.",
  ],
  Emergency: [
    "We’ve prioritized your safety—support is on the way.",
    "You’re not alone—our team is responding.",
  ],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ================= MAIN =================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      email,       // requester email (for allowlist check)
      name,
      status,
      pickup,
      destination,
      schedule,
      vehicle,
    } = body as {
      email?: string;
      name: string;
      status: keyof typeof statusMessage | string;
      pickup?: string;
      destination?: string;
      schedule?: string;
      vehicle?: string;
    };

    if (!name || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name or status" },
        { status: 400 }
      );
    }

    // ================= ALLOWLIST CHECK (optional but recommended) =================
    // Only send notifications if requester email is in your directory.
    // Directory table: allowed_users(email). Change to your table/column as needed.
    if (!email) {
      return NextResponse.json(
        { success: true, message: "No requester email provided. Skipping allowlist check and notification." },
        { status: 200 }
      );
    }

    const { data: allowed, error: allowError } = await supabase
      .from("allowed_users")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (allowError) {
      return NextResponse.json(
        { success: false, error: allowError.message },
        { status: 500 }
      );
    }

    if (!allowed) {
      return NextResponse.json(
        { success: true, message: "Requester email not in allowlist. Notification skipped." },
        { status: 200 }
      );
    }

    // ================= GET STAFF EMAILS =================
    const { data: staffList, error: staffError } = await supabase
      .from("staff")
      .select("staff_email");

    if (staffError) {
      return NextResponse.json(
        { success: false, error: staffError.message },
        { status: 500 }
      );
    }

    const staffEmails = (staffList || [])
      .map((s: { staff_email: string | null }) => s.staff_email)
      .filter((v: string | null): v is string => Boolean(v));

    if (staffEmails.length === 0) {
      return NextResponse.json(
        { success: false, message: "No staff emails found in database" },
        { status: 404 }
      );
    }

    const title = statusMessage[status]?.title || "📌 Status Update";
    const msg = statusMessage[status]?.message || "There’s an update on a request.";
    const comfort = comfortLinesByStatus[status]?.length
      ? pick(comfortLinesByStatus[status])
      : "We’re here if you need anything.";
    const quote = pick(quotes);

    // ================= SEND EMAIL =================
    const result = await resend.emails.send({
      from: "ISLA-Transpo <onboarding@resend.dev>", // replace with verified sender
      to: staffEmails,
      subject: `ISLA‑Transpo Update: ${status}`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;background:#f8fafc;padding:24px;">
          <div style="max-width:640px;margin:auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e2e8f0;">
            <div style="background:linear-gradient(90deg,#0ea5e9,#2563eb);padding:18px 22px;color:#fff;">
              <h2 style="margin:0;font-size:20px;letter-spacing:0.2px;">🚐 ISLA‑Transpo</h2>
              <div style="opacity:0.9;font-size:13px;margin-top:2px;">Dispatch & Trip Updates</div>
            </div>

            <div style="padding:22px;">
              <p style="margin:0 0 12px 0;color:#0f172a;">Hello Team,</p>

              <h3 style="margin:0 0 8px 0;color:#0f172a;">${title}</h3>
              <p style="margin:0 0 14px 0;color:#334155;line-height:1.5;">${msg}</p>

              <div style="margin:16px 0;padding:14px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:13px;color:#334155;">
                  <div><b>Requester:</b> ${name}${email ? ` (${email})` : ""}</div>
                  <div><b>Vehicle:</b> ${vehicle || "Not assigned yet"}</div>
                  <div><b>Pickup:</b> ${pickup || "—"}</div>
                  <div><b>Destination:</b> ${destination || "—"}</div>
                  <div style="grid-column:1/-1;"><b>Schedule:</b> ${schedule || "—"}</div>
                </div>
              </div>

              <div style="margin:16px 0;padding:14px;border-left:4px solid #22c55e;background:#f0fdf4;border-radius:10px;">
                <div style="color:#14532d;font-size:13px;line-height:1.5;">
                  ${comfort}
                </div>
              </div>

              <blockquote style="margin:18px 0 4px 0;padding:14px 16px;border-left:4px solid #2563eb;background:#eff6ff;border-radius:10px;color:#1e3a8a;font-style:italic;font-size:13px;">
                ${quote}
              </blockquote>

              <p style="margin:18px 0 0 0;color:#475569;font-size:12px;line-height:1.5;">
                Warmly,<br/>
                ISLA‑Transpo Notification System
              </p>
            </div>

            <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:12px 18px;color:#64748b;font-size:11px;">
              Need help? Reply to this email or contact dispatch.
            </div>
          </div>
        </div>
      `,
    });

    if ((result as any)?.error) {
      return NextResponse.json(
        { success: false, error: (result as any).error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Emails sent to staff successfully",
      result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
