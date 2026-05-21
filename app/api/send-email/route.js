import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { email, name, status } = await req.json();

    const data = await resend.emails.send({
      from: "ISLA-Transpo <onboarding@resend.dev>",
      to: email,
      subject: "Request Status Update",
      html: `
        <h2>Hello ${name}</h2>
        <p>Your request status has been updated:</p>
        <h3>Status: ${status}</h3>
      `,
    });

    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}