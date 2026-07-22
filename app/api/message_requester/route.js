// app/api/message_requester/route.js
//
// Lets an admin/dispatcher send a ONE-OFF, free-form email straight to a
// requester -- separate from the automated status emails in
// app/api/send_email/route.js (that file fires automatically on status
// change; this one fires only when a dispatcher clicks "Send" in
// EventDetailModal). Same SMTP transporter/env vars, just a plain
// message instead of a status template.

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function buildHtml({ name, message }) {
  return `
    <div style="padding:12px 0 16px; border-bottom:1px solid #eee;">
      <h2 style="margin:0; color:#1a73e8; font-family:Arial;">ISLA-TRANSPO</h2>
      <p style="margin:4px 0; color:#666; font-size:13px;">Safe &amp; Reliable Transport Service</p>
    </div>

    <p style="font-family:Arial; font-size:14px;">
      Hi <strong>${name || "there"}</strong>,
    </p>

    <p style="font-family:Arial; font-size:14px; color:#111; white-space:pre-wrap;">${message}</p>

    <div style="margin-top:22px; padding-top:12px; border-top:1px solid #eee; font-size:12px; color:#666;">
      <p style="margin:4px 0;"><strong>ISLA-Transpo Team</strong></p>
      <p style="margin:4px 0;">This message was sent by a dispatcher regarding your transport request.</p>
    </div>
  `;
}

export async function POST(request) {
  try {
    const { email, name, subject, message, request_code } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "Requester email is missing on this request." }, { status: 400 });
    }
    if (!message || !message.trim()) {
      return NextResponse.json({ success: false, error: "Message cannot be empty." }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const finalSubject =
      subject && subject.trim()
        ? subject.trim()
        : `Regarding your transport request${request_code ? ` (${request_code})` : ""}`;

    await transporter.sendMail({
      from: `"ISLA-Transpo" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: finalSubject,
      html: buildHtml({ name, message }),
    });

    return NextResponse.json({ success: true, message: "Message sent to requester." });
  } catch (error) {
    console.error("MESSAGE_REQUESTER ERROR:", error);
    return NextResponse.json({ success: false, error: error?.message || "Unknown error" }, { status: 500 });
  }
}
