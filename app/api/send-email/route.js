import { NextResponse } from "next/server";

// ================= HEARTWARMING STATUS MESSAGES =================
function getStatusMessage(status, name) {
  switch (status) {
    case "Pending":
      return {
        subject: "We’ve received your request 💙",
        message: `Dear ${name},

Thank you for trusting ISLA-TRANSPO. Your request is now pending review.

“Every journey begins with a single step.”

We will update you as soon as possible. 🚐`,
      };

    case "Approved":
      return {
        subject: "Your request has been approved ✅",
        message: `Dear ${name},

Great news! Your transport request has been approved.

“We’re honored to serve you and ensure a safe and comfortable journey.”

Thank you for choosing ISLA-TRANSPO 💙`,
      };

    case "On the way":
      return {
        subject: "Your vehicle is on the way 🚗",
        message: `Dear ${name},

Your assigned vehicle is now on the way to your location.

“Good things are already moving toward you.”

Please be ready at your pickup point. 🚐`,
      };

    case "Completed":
      return {
        subject: "Trip completed 🎉",
        message: `Dear ${name},

Your trip has been successfully completed.

“Safe travels create lasting memories.”

Thank you for riding with ISLA-TRANSPO 💙`,
      };

    case "Disapproved":
      return {
        subject: "Request Update",
        message: `Dear ${name},

We regret to inform you that your request could not be approved at this time.

“Sometimes delays lead us to better timing.”

Thank you for your understanding.`,
      };

    case "Emergency":
      return {
        subject: "Emergency Transport Update 🚨",
        message: `Dear ${name},

We have received your emergency request and are prioritizing it immediately.

“You are not alone — help is already in motion.”

Stay calm and wait for further updates.`,
      };

    default:
      return {
        subject: "Request Update",
        message: `Dear ${name},

Your transport request has been updated.

Thank you for using ISLA-TRANSPO 💙`,
      };
  }
}

// ================= MAIN API ROUTE =================
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
    } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Missing email" },
        { status: 400 }
      );
    }

    const emailContent = getStatusMessage(status, name);

    // ================= SEND EMAIL (RESEND EXAMPLE) =================
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ISLA-TRANSPO <noreply@yourdomain.com>",
        to: email,
        subject: emailContent.subject,
        html: `
          <div style="font-family:Arial;padding:20px;line-height:1.6;">
            <h2>${emailContent.subject}</h2>
            <p style="white-space:pre-line">${emailContent.message}</p>

            <hr/>

            <h4>Trip Details</h4>
            <p><b>Pickup:</b> ${pickup || "N/A"}</p>
            <p><b>Destination:</b> ${destination || "N/A"}</p>
            <p><b>Schedule:</b> ${schedule || "N/A"}</p>
            <p><b>Vehicle:</b> ${vehicle || "Not assigned"}</p>

            <br/>
            <p style="color:gray;font-size:12px;">
              ISLA-TRANSPO • Safe & Reliable Transport Service
            </p>
          </div>
        `,
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      data,
    });
  } catch (error) {
    console.error("EMAIL ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}