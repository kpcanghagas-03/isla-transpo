import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
      return Response.json(
        { error: "Missing email" },
        { status: 400 }
      );
    }

    let subject = `ISLA-Transpo Update: ${status}`;

    let html = `
      <div style="font-family:Arial;padding:20px;">
        <h2>Transport Request Update</h2>

        <p>Hello <b>${name}</b>,</p>

        <p>Your transport request status has been updated:</p>

        <h3>Status: ${status}</h3>

        <hr/>

        <p><b>Pickup:</b> ${pickup || "N/A"}</p>
        <p><b>Destination:</b> ${destination || "N/A"}</p>
        <p><b>Schedule:</b> ${schedule || "N/A"}</p>
        <p><b>Vehicle:</b> ${vehicle || "Not assigned"}</p>

        <br/>

        <p>Thank you for using ISLA-Transpo.</p>
      </div>
    `;

    const result = await resend.emails.send({
      from: "ISLA-Transpo <onboarding@resend.dev>",
      to: email, // ✅ ONLY REQUESTER EMAIL
      subject,
      html,
    });

    return Response.json({
      success: true,
      result,
    });
  } catch (err) {
    console.log("EMAIL ERROR:", err);

    return Response.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}