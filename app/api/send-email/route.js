import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ================= MESSAGE ENGINE =================
function getStatusMessage(status, name) {
  const base = `Dear ${name},\n\n`;

  switch (status) {
    case "Pending":
      return {
        subject: "We’ve received your request 💙",
        message:
          base +
          "Thank you for trusting ISLA-TRANSPO.\n\n“Every journey begins with trust.” 🚐",
      };

    case "Approved":
      return {
        subject: "Request Approved ✅",
        message:
          base +
          "Your request has been approved.\n\n“We are honored to serve you safely.” 💙",
      };

    case "On the way":
      return {
        subject: "Your vehicle is on the way 🚗",
        message:
          base +
          "Your transport is now en route.\n\n“Help is already moving toward you.”",
      };

    case "Completed":
      return {
        subject: "Trip Completed 🎉",
        message:
          base +
          "Your trip is completed.\n\n“Safe journeys create lasting memories.”",
      };

    case "Disapproved":
      return {
        subject: "Request Update",
        message:
          base +
          "Your request was not approved at this time.\n\n“Sometimes delays lead to better timing.”",
      };

    default:
      return {
        subject: "Update",
        message: base + "Your request has been updated.",
      };
  }
}

// ================= EMAIL SENDER (WITH LOGGING) =================
async function sendEmail(payload) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  return { ok: res.ok, data };
}

// ================= MAIN ROUTE =================
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
      request_id,
    } = body;

    const emailContent = getStatusMessage(status, name);

    const payload = {
      from: "ISLA-TRANSPO <onboarding@resend.dev>",
      to: email,
      subject: emailContent.subject,
      html: `
        <div style="font-family:Arial; padding:20px; line-height:1.6;">
          <h2>${emailContent.subject}</h2>
          <p style="white-space:pre-line">${emailContent.message}</p>
          <hr/>
          <p><b>Pickup:</b> ${pickup || "N/A"}</p>
          <p><b>Destination:</b> ${destination || "N/A"}</p>
          <p><b>Schedule:</b> ${schedule || "N/A"}</p>
          <p><b>Vehicle:</b> ${vehicle || "Not assigned"}</p>
        </div>
      `,
    };

    // ================= TRY EMAIL =================
    const { ok, data } = await sendEmail(payload);

    // ================= LOG RESULT (ALWAYS) =================
    await supabase.from("notification_logs").insert([
      {
        request_id,
        email,
        status,
        message: emailContent.subject,
        success: ok,
        error: ok ? null : JSON.stringify(data),
      },
    ]);

    if (!ok) {
      return NextResponse.json(
        { success: false, message: "Email failed", data },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email sent + logged",
      data,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}