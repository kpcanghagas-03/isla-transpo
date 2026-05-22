import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

// ================= INIT =================
const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ================= EMAIL TEMPLATE =================
const statusMessage = {
  Pending: {
    title: "🕒 Your Request is Pending",
    message:
      "We’ve received your transport request and it is currently under review.",
  },
  Approved: {
    title: "🚗 Request Approved",
    message:
      "Good news! Your transport request has been approved. Our dispatch team is preparing your vehicle.",
  },
  "On the way": {
    title: "🚌 Vehicle is On the Way",
    message:
      "Your assigned vehicle is now heading to your pickup location. Please be ready.",
  },
  Completed: {
    title: "✅ Trip Completed",
    message:
      "Your trip has been completed successfully. Thank you for riding with ISLA-Transpo.",
  },
  Disapproved: {
    title: "❌ Request Disapproved",
    message:
      "We’re sorry, your request could not be approved at this time. Please contact the admin.",
  },
  Emergency: {
    title: "🚨 Emergency Request",
    message:
      "Your emergency request is being prioritized by our dispatch team.",
  },
};

const quotes = [
  "“Safe travels begin with good coordination.”",
  "“Every journey matters.”",
  "“Prepared today, safe tomorrow.”",
  "“We move people, not just vehicles.”",
];

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// ================= MAIN FUNCTION =================
export async function POST(req) {
  try {
    const body = await req.json();

    const {
      email,
      name,
      status,
      pickup,
      destination,
      schedule,
      vehicle,
    } = body;

    // ================= CHECK STAFF =================
    const { data: staff_email, error: staffError } = await supabase
      .from("staff")
      .select("staff_email");

    if (staffError) {
      return NextResponse.json(
        { success: false, error: staffError.message },
        { status: 500 }
      );
    }

    const isStaff_email = staff_email?.some((s) => s.staff_email === email);

    if (!isStaff_email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email not in staff directory",
        },
        { status: 403 }
      );
    }

    // ================= SEND EMAIL =================
    const result = await resend.emails.send({
      from: "ISLA-Transpo <onboarding@resend.dev>",
      to: email,
      subject: `ISLA-Transpo Update: ${status}`,

      html: `
        <div style="font-family:Arial,sans-serif;background:#f1f5f9;padding:20px;">
          <div style="max-width:600px;margin:auto;background:white;padding:24px;border-radius:12px;">

            <h2 style="color:#0B3D91;">🚐 ISLA-Transpo Dispatch System</h2>

            <p>Hello <b>${name}</b>,</p>

            <h3>${statusMessage[status]?.title || "📌 Status Update"}</h3>

            <p style="color:#334155;">
              ${statusMessage[status]?.message || "Your request has been updated."}
            </p>

            <hr />

            <h4>📍 Trip Details</h4>
            <p><b>Pickup:</b> ${pickup}</p>
            <p><b>Destination:</b> ${destination}</p>
            <p><b>Schedule:</b> ${schedule}</p>
            <p><b>Vehicle:</b> ${vehicle || "Not assigned yet"}</p>

            <hr />

            <p style="font-style:italic;color:#64748b;">
              ${getRandomQuote()}
            </p>

            <p style="margin-top:20px;">
              Thank you for using <b>ISLA-Transpo</b>. Have a safe day!
            </p>

          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}