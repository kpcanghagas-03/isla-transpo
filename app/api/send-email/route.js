import { Resend } from "resend";

export async function POST(req) {
  try {
    const { email, name, status } = await req.json();

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw new Error("Missing RESEND_API_KEY in environment variables");
    }

    const resend = new Resend(apiKey);

    const data = await resend.emails.send({
      from: "ISLA-Transpo <onboarding@resend.dev>",
      to: email,
      subject: "Request Status Update",
      html: `
        <h2>Hello ${name}</h2>
        <p>Status: ${status}</p>
      `,
    });

    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}