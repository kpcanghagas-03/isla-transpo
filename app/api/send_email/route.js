export const runtime = "nodejs";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ================= MESSAGE ENGINE =================
function getStatusMessage(status, name,vehicle,driver_number,requestDetails = {}) {
  const { pickup, destination, schedule } = requestDetails;

  // 🌤 Warm greeting intro (NEW)
  const greeting = `
    <p style="font-family:Arial; font-size:14px;">
      Hi <strong>${name}</strong>,
    </p>
    <p style="font-family:Arial; font-size:14px; color:#333;">
      Welcome to ISLA-Transpo. We’re happy to have you on board and we’ll make sure your journey is safe, smooth, and comfortable. 🚐💙
    </p>
  `;

  const header = `
    <div style="padding:12px 0 16px; border-bottom:1px solid #eee;">
      <h2 style="margin:0; color:#1a73e8; font-family:Arial;">
        ISLA-TRANSPO
      </h2>
      <p style="margin:4px 0; color:#666; font-size:13px;">
        Safe & Reliable Transport Service
      </p>
    </div>
  `;

  const section = (title, content) => `
    <div style="margin:12px 0;">
      <div style="font-weight:bold; font-size:13px; color:#444;">
        ${title}
      </div>
      <div style="font-size:14px; color:#111;">
        ${content}
      </div>
    </div>
  `;

  const statusBox = (color, text) => `
    <div style="
      padding:10px 12px;
      border-radius:8px;
      background:${color};
      color:white;
      font-weight:bold;
      font-size:13px;
      display:inline-block;
      margin:10px 0;
    ">
      ${text}
    </div>
  `;

  const footer = `
    <div style="margin-top:22px; padding-top:12px; border-top:1px solid #eee; font-size:12px; color:#666;">
      <p style="margin:4px 0;"><strong>ISLA-Transpo Team</strong></p>
      <p style="margin:4px 0; font-style:italic;">
        “Every journey is important to us — travel safely and confidently.”
      </p>
      <p style="margin:4px 0;">🚐 Have a safe trip</p>
    </div>
  `;

  const tripInfo = `
    ${section("Pickup Location", pickup || "Not specified")}
    ${section("Destination", destination || "Not specified")}
    ${section("Schedule", schedule || "Not specified")}
    ${section("Assigned Vehicles & Drivers",
  `
    <table
      style="
        width:100%;
        border-collapse:collapse;
        margin-top:8px;
        font-size:13px;
      "
    >
      <tr>
        <th style="text-align:left;padding:6px;border-bottom:1px solid #ddd;">
          Vehicle
        </th>
        <th style="text-align:left;padding:6px;border-bottom:1px solid #ddd;">
          Contact
        </th>
      </tr>

      ${Array.isArray(vehicle)
  ? vehicle
      .map(
        (v) => `
        <tr>
          <td style="padding:6px; border-bottom:1px solid #eee;">
            ${v.vehicle || "N/A"}
          </td>
          <td style="padding:6px; border-bottom:1px solid #eee;">
            ${v.driver || "N/A"} <br/>
            ${v.phone || "N/A"}
          </td>
        </tr>
      `
      )
      .join("")
  : `
    <tr>
      <td colspan="2" style="padding:6px;">Not yet assigned</td>
    </tr>
  `
}
    </table>
  `
)}
  
  `;

  switch (status) {

    // 🌱 Pending
    case "Pending":
      return {
        subject: "We’ve received your request 🚐",
        html: `
          ${header}
          ${greeting}

          ${statusBox("#f59e0b", "STATUS: PENDING REVIEW")}

          <p style="font-family:Arial;">
            Thank you for trusting us with your transportation request. We’ve received it safely.
          </p>

          <p style="font-family:Arial;">
            Our team is carefully reviewing your trip details to ensure everything is prepared properly.
          </p>

          ${tripInfo}

          <p style="font-family:Arial; color:#555;">
            We’ll update you as soon as your trip is confirmed.
          </p>

          ${footer}
        `,
      };

    // 🌿 Approved
    case "Approved":
      return {
        subject: "Your trip is confirmed ✅",
        html: `
          ${header}
          ${greeting}

          ${statusBox("#22c55e", "STATUS: APPROVED")}

          <p style="font-family:Arial;">
            Great news! Your trip is confirmed and we’re preparing everything for your journey.
          </p>

          ${tripInfo}

          <p style="font-family:Arial;">
            We’re getting everything ready so your ride will be smooth and comfortable.
          </p>

          <p style="font-family:Arial; color:#555;">
            Please keep your phone available in case we need to coordinate with you.
          </p>

          ${footer}
        `,
      };

    // 🚐 On the way
    case "On the way":
      return {
        subject: "Your ride is on the way 🚐",
        html: `
          ${header}
          ${greeting}

          ${statusBox("#1a73e8", "STATUS: ON THE WAY")}

          <p style="font-family:Arial;">
            Your vehicle is now heading toward your pickup location.
          </p>

          ${tripInfo}

          <p style="font-family:Arial;">
            Please take a moment to prepare. Your driver will arrive shortly.
          </p>

          <p style="font-family:Arial; color:#555;">
            We’re almost there. Thank you for your patience. 💙
          </p>

          ${footer}
        `,
      };

    // 💙 Completed
    case "Completed":
      return {
        subject: "Trip completed 💙",
        html: `
          ${header}
          ${greeting}

          ${statusBox("#6b7280", "STATUS: COMPLETED")}

          <p style="font-family:Arial;">
            Your journey has been completed successfully.
          </p>

          <p style="font-family:Arial;">
            We’re truly grateful to have been part of your trip today.
          </p>

          <p style="font-family:Arial;">
            Safe travels always — and we hope to serve you again soon. 🚐💙
          </p>

          ${footer}
        `,
      };

    // ❌ Disapproved
    case "Disapproved":
      return {
        subject: "Request update",
        html: `
          ${header}
          ${greeting}

          ${statusBox("#ef4444", "STATUS: NOT APPROVED")}

          <p style="font-family:Arial;">
            Thank you for your request and for giving us the opportunity to assist you.
          </p>

          <p style="font-family:Arial;">
            Unfortunately, we’re unable to approve this trip due to current scheduling or operational limitations.
          </p>

          <p style="font-family:Arial;">
            We truly appreciate your understanding and hope to serve you in the future.
          </p>

          ${footer}
        `,
      };

    // 🚨 Emergency
    case "Emergency":
      return {
        subject: "Emergency transport activated 🚨",
        html: `
          ${header}
          ${greeting}

          ${statusBox("#dc2626", "EMERGENCY MODE ACTIVE")}

          <p style="font-family:Arial;">
            We’ve received your emergency request and are prioritizing it immediately.
          </p>

          ${tripInfo}

          <p style="font-family:Arial;">
            Help is already being dispatched. Please stay reachable at your contact number.
          </p>

          <p style="font-family:Arial; font-weight:bold;">
            You are not alone — assistance is on the way. 🚐
          </p>

          ${footer}
        `,
      };

    default:
      return {
        subject: "Transport update",
        html: `
          ${header}
          ${greeting}
          <p>Your request has been updated.</p>
          ${footer}
        `,
      };
  }
}

// ================= API ROUTE =================
export async function POST(request) {
  try {
    const {
      email,
      name,
      status,
      vehicle,
      driver_number,
      pickup,
      destination,
      schedule,
      request_id,
    } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const { subject, html } = getStatusMessage(status, name, vehicle, driver_number, {
      pickup,
      destination,
      schedule,
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"ISLA-Transpo" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject,
      html,
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });

  } catch (error) {
    console.error("EMAIL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}