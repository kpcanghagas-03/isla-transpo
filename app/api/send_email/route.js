export const runtime = "nodejs";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ================= MESSAGE ENGINE =================
function getStatusMessage(status, name, vehicle = "", driver_number = "") {
  const base = `Hi ${name},`;

  switch (status) {
    case "Pending":
      return {
        subject: "We received your transportation request 🚐",
        html: `
          <div style="font-family: Arial, sans-serif; line-height:1.6;">
            <h2 style="color:#333;">ISLA-Transpo Update</h2>
            <p>${base}</p>

            <div style="padding:15px;border-radius:8px;background:#fff7e6;border-left:5px solid #f5a623;">
              <strong>Status:</strong> Pending Review
            </div>

            <p>Thanks for reaching out. Your request has been received and is now being reviewed by our team.</p>
            <p>We’ll notify you once there’s progress.</p>

            <br/>
            <p>Thank you for your patience.</p>
          </div>
        `,
      };

    case "Approved":
      return {
        subject: "Your transportation request has been approved ✅",
        html: `
          <div style="font-family: Arial, sans-serif; line-height:1.6;">
            <h2 style="color:#1a73e8;">ISLA-Transpo Update</h2>
            <p>${base}</p>

            <div style="padding:15px;border-radius:8px;background:#e6f4ea;border-left:5px solid #34a853;">
              <strong>Status:</strong> Approved
            </div>

            <h3>Trip Details</h3>
            <ul>
              <li><strong>Vehicle:</strong> ${vehicle || "To be assigned"}</li>
              <li><strong>Driver Contact:</strong> ${driver_number || "Will be shared soon"}</li>
            </ul>

            <p>Our team is preparing your trip. Please keep your phone available for coordination.</p>

            <br/>
            <p>Thank you for choosing ISLA-Transpo.</p>
          </div>
        `,
      };

    case "On the way":
      return {
        subject: "Your assigned vehicle is on the way 🚐",
        html: `
          <div style="font-family: Arial, sans-serif; line-height:1.6;">
            <h2 style="color:#1a73e8;">ISLA-Transpo Update</h2>
            <p>${base}</p>

            <div style="padding:15px;border-radius:8px;background:#e8f0fe;border-left:5px solid #1a73e8;">
              <strong>Status:</strong> On the Way
            </div>

            <ul>
              <li><strong>Vehicle:</strong> ${vehicle || "Assigned Vehicle"}</li>
              <li><strong>Driver Contact:</strong> ${driver_number || "Unavailable"}</li>
            </ul>

            <p>Please be ready at your pickup location.</p>

            <br/>
            <p>See you soon.</p>
          </div>
        `,
      };

    case "Completed":
      return {
        subject: "Trip completed — thank you 💙",
        html: `
          <div style="font-family: Arial, sans-serif; line-height:1.6;">
            <h2 style="color:#333;">ISLA-Transpo</h2>
            <p>${base}</p>

            <div style="padding:15px;border-radius:8px;background:#e6f4ea;border-left:5px solid #34a853;">
              <strong>Status:</strong> Completed
            </div>

            <p>We appreciate your trust in us.</p>
            <p>We hope to serve you again soon.</p>
          </div>
        `,
      };

    case "Disapproved":
      return {
        subject: "Update regarding your transportation request",
        html: `
          <div style="font-family: Arial, sans-serif; line-height:1.6;">
            <h2>ISLA-Transpo</h2>
            <p>${base}</p>

            <div style="padding:15px;border-radius:8px;background:#fce8e6;border-left:5px solid #ea4335;">
              <strong>Status:</strong> Not Approved
            </div>

            <p>We’re unable to approve your request due to scheduling or operational limitations.</p>
            <p>We hope to assist you in the future.</p>
          </div>
        `,
      };

    default:
      return {
        subject: "Transportation request update",
        html: `
          <div style="font-family: Arial, sans-serif;">
            <p>${base}</p>
            <p>Your request has been updated.</p>
          </div>
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
      pickup,
      destination,
      schedule,
      vehicle,
      driver_number,
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
      driver_number
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
      html, // 👈 THIS is what makes Gmail look clean
    });

    console.log("EMAIL SENT TO:", email);

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("EMAIL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message,
      },
      { status: 500 }
    );
  }
}