import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const body = await req.json();

  const { email, name, status } = body;

  try {
    await resend.emails.send({
      from: "ISLA-Transpo <onboarding@resend.dev>",
      to: email,
      subject: `Transport Request ${status}`,
      html: `
        <h2>Status: ${status}</h2>
        <p>Hello ${name}, your request is now <b>${status}</b>.</p>
      `,
    });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}