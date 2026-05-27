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
          "Thank you for choosing ISLA-TRANSPO.\n\n" +
          "We’ve successfully received your request and our team is now reviewing it.\n\n" +
          "“Every great journey starts with a single request.” 🚐\n\n" +
          "We’ll keep you updated as soon as there’s progress.",
      };

    case "Approved":
      return {
        subject: "Request Approved ✅",
        message:
          base +
          "Good news — your request has been approved.\n\n" +
          "Our team is now preparing everything for your trip.\n\n" +
          "“Prepared today, delivered safely tomorrow.” 💙\n\n" +
          "You may wait for further updates regarding your assigned vehicle and schedule.",
      };

    case "On the way":
      return {
        subject: "Your vehicle is on the way 🚗",
        message:
          base +
          "Your assigned vehicle is now en route to your pickup location.\n\n" +
          "Please be ready at your designated area.\n\n" +
          "“Good service is not promised — it is already moving toward you.” 🚐\n\n" +
          "Stay safe and wait for arrival confirmation.",
      };

    case "Completed":
      return {
        subject: "Trip Completed 🎉",
        message:
          base +
          "Your trip has been successfully completed.\n\n" +
          "Thank you for riding with ISLA-TRANSPO.\n\n" +
          "“Safe journeys are the ones we remember the most.” 💙\n\n" +
          "We hope to serve you again soon.",
      };

    case "Disapproved":
      return {
        subject: "Request Update",
        message:
          base +
          "We regret to inform you that your request could not be approved at this time.\n\n" +
          "This may be due to scheduling or operational limitations.\n\n" +
          "“Not all paths open today, but better timing often comes next.”\n\n" +
          "You may submit another request for a different schedule.",
      };

    default:
      return {
        subject: "Update from ISLA-TRANSPO",
        message:
          base +
          "Your request has been updated.\n\n" +
          "“We keep you informed every step of the way.”",
      };
  }
}

// ================= SMTP EMAIL =================
export async function sendEmail({ email, subject, html }) {
  try {
    console.log("📨 SENDING EMAIL TO:", email);

    // 🔥 FAIL FAST if env missing (prevents localhost fallback issues)
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

    // verify connection
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