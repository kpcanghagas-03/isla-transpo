export const runtime = "nodejs";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ================= MESSAGE ENGINE =================
function getStatusMessage(status, name, vehicle = "", driver = "") {
  const header = `
    <div style="text-align:center; padding:10px 0 20px;">
      <h1 style="margin:0; color:#1a73e8; font-family:Arial;">ISLA-TRANSPO</h1>
      <p style="margin:4px 0; color:#666;">Safe & Reliable Transport Service</p>
    </div>
  `;

  const progress = (step) => {
    const steps = ["Pending", "Approved", "On the way", "Completed"];
    return `
      <div style="display:flex; gap:6px; margin:10px 0;">
        ${steps
          .map((s) => {
            const active = steps.indexOf(s) <= steps.indexOf(step);
            return `
              <div style="
                flex:1;
                height:6px;
                border-radius:10px;
                background:${active ? "#1a73e8" : "#e5e7eb"};
              "></div>
            `;
          })
          .join("")}
      </div>
    `;
  };

  const card = (title, content, color) => `
    <div style="
      margin:12px 0;
      padding:14px;
      border-radius:10px;
      border-left:5px solid ${color};
      background:#f9fafb;
    ">
      <strong>${title}</strong><br/>
      ${content}
    </div>
  `;

  const footer = `
    <div style="margin-top:25px; font-size:13px; color:#555; text-align:center;">
      <p><strong>ISLA-Transpo Team</strong></p>
      <p style="font-style:italic;">“Your journey, our commitment to safety and care.”</p>
      <p style="margin-top:10px;">🚐 Safe travels always</p>
    </div>
  `;

  const base = `<p style="font-family:Arial;">Hi ${name},</p>`;

  switch (status) {
    case "Pending":
      return {
        subject: "We’ve received your request 🚐",
        html: `
          ${header}
          ${base}

          ${progress("Pending")}

          <p>Your transportation request has been received successfully.</p>
          <p>Our team is carefully reviewing the details to prepare your trip.</p>

          ${card("Status", "Pending Review", "#f59e0b")}

          <p>We’ll notify you once your ride is scheduled.</p>

          ${footer}
        `,
      };

    case "Approved":
      return {
        subject: "Your trip is confirmed ✅",
        html: `
          ${header}
          ${base}

          ${progress("Approved")}

          <p>Good news — your trip has been approved and is now being prepared.</p>

          ${card(
            "Assigned Vehicle",
            vehicle || "To be assigned",
            "#22c55e"
          )}

          ${card(
            "Driver Information",
            driver || "Will be shared soon",
            "#3b82f6"
          )}

          <p>Please keep your phone available for coordination.</p>
          <p>We’re preparing everything to ensure a smooth trip for you.</p>

          ${footer}
        `,
      };

    case "On the way":
      return {
        subject: "Your ride is on the way 🚐",
        html: `
          ${header}
          ${base}

          ${progress("On the way")}

          <p>Your vehicle is now heading to your pickup location.</p>

          ${card("Vehicle", vehicle || "Assigned Vehicle", "#1a73e8")}
          ${card("Driver Contact", driver || "Unavailable", "#1a73e8")}

          <p>Please be ready at your pickup point.</p>
          <p>We’ll get you safely to your destination.</p>

          ${footer}
        `,
      };

    case "Completed":
      return {
        subject: "Thank you for riding with us 💙",
        html: `
          ${header}
          ${base}

          ${progress("Completed")}

          <p>Your trip has been completed successfully.</p>

          <p>
            Thank you for trusting ISLA-Transpo. It’s always our goal to make your journey
            safe, smooth, and comfortable.
          </p>

          ${footer}
        `,
      };

    case "Disapproved":
      return {
        subject: "Update on your request",
        html: `
          ${header}
          ${base}

          <p>We carefully reviewed your request.</p>

          ${card(
            "Status",
            "Not approved due to scheduling or operational constraints",
            "#ef4444"
          )}

          <p>
            We truly appreciate your understanding and hope to serve you in the future.
          </p>

          ${footer}
        `,
      };

    case "Emergency":
      return {
        subject: "Urgent transport update 🚨",
        html: `
          ${header}
          ${base}

          ${progress("On the way")}

          <p><strong>Emergency support is now active.</strong></p>
          <p>We are prioritizing your request and dispatching assistance immediately.</p>

          ${card("Vehicle", vehicle || "Being assigned", "#dc2626")}
          ${card("Driver", driver || "Will be updated shortly", "#dc2626")}

          <p>Please keep your phone reachable at all times.</p>
          <p>Help is on the way.</p>

          ${footer}
        `,
      };

    default:
      return {
        subject: "Transportation update",
        html: `
          ${header}
          ${base}
          <p>Your request has been updated.</p>
          ${footer}
        `,
      };
  }
}