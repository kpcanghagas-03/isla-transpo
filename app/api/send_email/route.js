export const runtime = "nodejs";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ================= MESSAGE ENGINE =================
function getStatusMessage(
  status,
  name,
  vehicle = "",
  driver_number = ""
) {
  const base = `Hi ${name},\n\n`;

  switch (status) {
    case "Pending":
      return {
        subject: "We received your transportation request 🚐",
        message:
          base +
          "Thanks for reaching out to ISLA-Transpo.\n\n" +
          "Your transportation request has been received and is currently being reviewed by our team.\n\n" +
          "We’ll keep you updated once there’s progress regarding your trip.\n\n" +
          "Thank you for your patience and trust.",
      };

    case "Approved":
      return {
        subject: "Your transportation request has been approved ✅",
        message:
          base +
          "Good news! Your transportation request has been approved.\n\n" +
          "Your assigned vehicle details are listed below:\n\n" +
          `Assigned Vehicle: ${vehicle || "To be assigned"}\n` +
          `Driver Contact Number: ${driver_number || "Will be shared soon"}\n\n` +
          "Our team is now preparing the necessary arrangements for your scheduled trip.\n\n" +
          "Please keep your lines open for possible coordination regarding your pickup schedule.\n\n" +
          "Thank you for choosing ISLA-Transpo.",
      };

    case "On the way":
      return {
        subject: "Your assigned vehicle is on the way 🚐",
        message:
          base +
          "Your assigned vehicle is now on the way to your pickup location.\n\n" +
          `Assigned Vehicle: ${vehicle || "Assigned Vehicle"}\n` +
          `Driver Contact Number: ${driver_number || "Unavailable"}\n\n` +
          "Please be ready at the designated pickup area to help avoid delays.\n\n" +
          "If needed, you may coordinate directly with the assigned driver.\n\n" +
          "Thank you, and we’ll see you shortly.",
      };

    case "Completed":
      return {
        subject: "Trip completed — thank you for riding with us 💙",
        message:
          base +
          "Your trip has been marked as completed.\n\n" +
          "We sincerely appreciate the opportunity to assist you during your journey.\n\n" +
          "Thank you for riding with ISLA-Transpo, and we hope to serve you again soon.",
      };

    case "Disapproved":
      return {
        subject: "Update regarding your transportation request",
        message:
          base +
          "Thank you for submitting your transportation request.\n\n" +
          "Unfortunately, we’re unable to approve the request at this time due to scheduling or operational limitations.\n\n" +
          "We appreciate your understanding and hope we can assist you on a future trip.",
      };

    case "Emergency":
      return {
        subject: "Emergency transport update 🚨",
        message:
          base +
          "An emergency update has been issued regarding your transportation request.\n\n" +
          "Our team is currently prioritizing and coordinating your request as quickly as possible.\n\n" +
          `Assigned Vehicle: ${vehicle || "Being assigned"}\n` +
          `Driver Contact Number: ${driver_number || "Will be shared shortly"}\n\n` +
          "Please keep your phone available for immediate coordination.\n\n" +
          "Thank you for your patience and cooperation.",
      };

    default:
      return {
        subject: "Transportation request update",
        message:
          base +
          "There has been an update regarding your transportation request.\n\n" +
          "Please check the details included in this email.",
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

    // ================= EMAIL CONTENT =================
    const { subject, message } = getStatusMessage(
      status,
      name,
      vehicle,
      driver_number
    );

    const fullMessage =
      `${message}\n\n` +
      `-----------------------------------\n` +
      `REQUEST DETAILS\n` +
      `-----------------------------------\n` +
      `Request ID: ${request_id || "N/A"}\n` +
      `Pickup Location: ${pickup || "N/A"}\n` +
      `Destination: ${destination || "N/A"}\n` +
      `Schedule: ${schedule || "N/A"}\n` +
      `Assigned Vehicle: ${vehicle || "N/A"}\n` +
      `Driver Contact Number: ${driver_number || "N/A"}\n\n` +
      `Thank you for choosing ISLA-Transpo.\n` +
      `Safe travels!`;

    // ================= NODEMAILER =================
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // ================= SEND EMAIL =================
    await transporter.sendMail({
      from: `"ISLA-Transpo" <${process.env.GMAIL_USER}>`,
      to: email,
      subject,
      text: fullMessage,
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
        error: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}