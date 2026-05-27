export const runtime = "nodejs";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabase } from "@/lib/supabase";

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

// ================= SMTP EMAIL =================
async function sendEmail({ email, subject, html }) {
  try {
    console.log("📨 SENDING EMAIL TO:", email);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // 🔥 FORCE CHECK LOGIN FIRST
    await transporter.verify();
    console.log("✅ SMTP VERIFIED SUCCESSFULLY");

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject,
      html,
    });

    console.log("✅ EMAIL SENT:", info.messageId);

    return { ok: true, data: info };
  } catch (error) {
    console.error("❌ SMTP FAILED:", error);
    return { ok: false, data: error };
  }
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

    console.log("REQUEST RECEIVED:", body);

    if (!email) {
      return NextResponse.json(
        { success: false, message: "No email provided" },
        { status: 400 }
      );
    }

    const emailContent = getStatusMessage(status, name);

    const html = `
      <div style="font-family: Arial; padding: 20px; line-height: 1.7; color:#111827;">
        <div style="max-width:600px;margin:auto;background:#fff;padding:24px;border-radius:14px;border:1px solid #e5e7eb;">

          <h2 style="color:#2563eb;">${emailContent.subject}</h2>

          <p style="white-space:pre-line;">${emailContent.message}</p>

          <hr style="margin:20px 0;" />

          <p><strong>📍 Pickup:</strong> ${pickup || "N/A"}</p>
          <p><strong>🎯 Destination:</strong> ${destination || "N/A"}</p>
          <p><strong>🕒 Schedule:</strong> ${schedule || "N/A"}</p>
          <p><strong>🚐 Vehicle:</strong> ${vehicle || "Not assigned yet"}</p>

        </div>
      </div>
    `;

    // ================= SEND EMAIL =================
    const { ok, data } = await sendEmail({
      email,
      subject: emailContent.subject,
      html,
    });

    console.log("EMAIL RESULT:", { ok, data });

    // ================= LOG TO SUPABASE (CRITICAL FIX) =================
    const logResult = await supabase.from("notification_logs").insert([
      {
        request_id,
        email,
        status,
        message: emailContent.subject,
        success: ok,
        error: ok ? null : JSON.stringify(data),
      },
    ]);

    console.log("SUPABASE LOG RESULT:", logResult);

    // ================= RESPONSE =================
    if (!ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Email failed",
          error: data,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (err) {
    console.error("SERVER ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: err.message,
      },
      { status: 500 }
    );
  }
}