export const runtime = "nodejs";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabase } from "@/lib/supabase";

// ================= MESSAGE ENGINE =================
function getStatusMessage(status, name) {
  const base = `Hi ${name},\n\n`;

  switch (status) {
    case "Pending":
      return {
        subject: "Welcome to ISLA-Transpo 🚐",
        message:
          base +
          "Welcome to ISLA-Transpo.\n\n" +
          "We’ve received your request, and it is now being reviewed by our team with care.\n\n" +
          "Every request matters to us — because behind every ride is a person with a purpose and a journey.\n\n" +
          "“Every journey begins with trust, and we’re grateful you placed yours in us.” 🌿\n\n" +
          "We’ll update you as soon as there is progress. Thank you for letting us serve you.",
      };

    case "Approved":
      return {
        subject: "Your ISLA-Transpo request is approved 💙",
        message:
          base +
          "Good news — your request has been approved.\n\n" +
          "We are now preparing everything to ensure your trip is safe, smooth, and comfortable.\n\n" +
          "“When care leads the way, every journey becomes meaningful.” 🌤️\n\n" +
          "We’re honored to be part of your journey.",
      };

    case "On the way":
      return {
        subject: "Your ISLA-Transpo ride is on the way 🚐",
        message:
          base +
          "Your vehicle is now on its way to your location.\n\n" +
          "Please get ready at your pickup point.\n\n" +
          "“We may not always be seen, but we are always moving with purpose toward you.” 🌿\n\n" +
          "Thank you for your patience — we’re almost there.",
      };

    case "Completed":
      return {
        subject: "Thank you for riding with ISLA-Transpo 💙",
        message:
          base +
          "Your trip has been completed safely, and we are truly grateful for your trust.\n\n" +
          "“Safe journeys are shared moments of trust and care.” 🌏\n\n" +
          "We hope your experience was smooth and comfortable. We look forward to serving you again.",
      };

    case "Disapproved":
      return {
        subject: "A gentle update from ISLA-Transpo",
        message:
          base +
          "Thank you for your request and for considering ISLA-Transpo.\n\n" +
          "At this time, we are unable to approve your request due to scheduling or operational limits.\n\n" +
          "We understand this may not be the outcome you hoped for, and we sincerely appreciate your understanding.\n\n" +
          "“Sometimes timing teaches patience, and better moments follow.” 🌱\n\n" +
          "We hope to serve you in a future trip.",
      };

    default:
      return {
        subject: "Update from ISLA-Transpo 💙",
        message:
          base +
          "Your request has been updated.\n\n" +
          "“Every step forward is still part of the journey.” 🌿",
      };
  }
}

// ================= SMTP EMAIL =================
export async function sendEmail({ email, subject, html }) {
  try {
    console.log("📨 SENDING EMAIL TO:", email);

    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.SMTP_EMAIL ||
      !process.env.SMTP_PASSWORD
    ) {
      throw new Error("Missing SMTP environment variables");
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.verify();
    console.log("✅ SMTP VERIFIED SUCCESSFULLY");

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_EMAIL,
      to: email,
      subject,
      html,
    });

    console.log("✅ EMAIL SENT:", info.messageId);

    return { ok: true, data: info };
  } catch (error) {
    console.error("❌ SMTP FAILED:", error);
    return { ok: false, error };
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

    const { ok, data } = await sendEmail({
      email,
      subject: emailContent.subject,
      html,
    });

    console.log("EMAIL RESULT:", { ok, data });

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