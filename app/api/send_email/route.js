export const runtime = "nodejs";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ================= MESSAGE ENGINE =================
function getStatusMessage(status, name, vehicle, driverNumber, driverName) {
  const header = `
    <div style="padding:10px 0 15px; border-bottom:1px solid #eee;">
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
      <div style="font-weight:bold; font-size:13px; color:#444; margin-bottom:4px;">
        ${title}
      </div>
      <div style="font-size:14px; color:#111;">
        ${content}
      </div>
    </div>
  `;

  const statusBox = (color, text) => `
    <div style="
      padding:10px;
      border-radius:6px;
      background:${color};
      color:white;
      font-weight:bold;
      font-size:13px;
      display:inline-block;
      margin:8px 0;
    ">
      ${text}
    </div>
  `;

  const footer = `
    <div style="margin-top:20px; padding-top:10px; border-top:1px solid #eee; font-size:12px; color:#666;">
      <p style="margin:4px 0;"><strong>ISLA-Transpo Team</strong></p>
      <p style="margin:4px 0;">“Safe journeys, every ride matters.”</p>
      <p style="margin:4px 0;">🚐 Have a safe trip</p>
    </div>
  `;

  const base = `<p style="font-family:Arial; font-size:14px;">Hi ${name},</p>`;

  switch (status) {

    case "Pending":
      return {
        subject: "We received your request",
        html: `
          ${header}
          ${base}

          ${statusBox("#f59e0b", "STATUS: PENDING REVIEW")}

          ${section("Message",
            "Your transportation request has been received and is currently being reviewed by our dispatch team."
          )}

          ${footer}
        `,
      };

    case "Approved":
      return {
        subject: "Your trip is approved",
        html: `
          ${header}
          ${base}

          ${statusBox("#22c55e", "STATUS: APPROVED")}

          ${section("Vehicle", vehicle || "Not yet assigned")}

          ${section("Driver Name", driverName || "Not yet assigned")}

          ${section("Driver Contact", driverNumber || "Not available")}

          ${section("Next Step",
            "Your trip is being prepared. Please keep your phone available for coordination."
          )}

          ${footer}
        `,
      };

    case "On the way":
      return {
        subject: "Your ride is on the way",
        html: `
          ${header}
          ${base}

          ${statusBox("#1a73e8", "STATUS: ON THE WAY")}

          ${section("Vehicle", vehicle || "Assigned vehicle")}

          ${section("Driver Name", driverName || "Driver assigned")}

          ${section("Driver Contact", driverNumber || "Unavailable")}

          ${section("Instruction",
            "Please proceed to your pickup location. Your driver is en route."
          )}

          ${footer}
        `,
      };

    case "Completed":
      return {
        subject: "Trip completed",
        html: `
          ${header}
          ${base}

          ${statusBox("#6b7280", "STATUS: COMPLETED")}

          ${section("Message",
            "Your trip has been completed successfully. Thank you for riding with ISLA-Transpo."
          )}

          ${footer}
        `,
      };

    case "Disapproved":
      return {
        subject: "Request update",
        html: `
          ${header}
          ${base}

          ${statusBox("#ef4444", "STATUS: NOT APPROVED")}

          ${section("Message",
            "We’re unable to approve your request due to scheduling or operational limitations."
          )}

          ${footer}
        `,
      };

    case "Emergency":
      return {
        subject: "Emergency transport activated",
        html: `
          ${header}
          ${base}

          ${statusBox("#dc2626", "EMERGENCY MODE ACTIVE")}

          ${section("Vehicle", vehicle || "Being assigned")}

          ${section("Driver Name", driverName || "Assigned shortly")}

          ${section("Driver Contact", driverNumber || "Immediate update coming")}

          ${section("Message",
            "We are prioritizing your request. Assistance is on the way."
          )}

          ${footer}
        `,
      };

    default:
      return {
        subject: "Transport update",
        html: `
          ${header}
          ${base}
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
      driver_name,
      request_id,
    } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const { subject, html } = getStatusMessage(
      status,
      name,
      vehicle,
      driver_number,
      driver_name
    );

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