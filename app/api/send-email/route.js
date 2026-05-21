import { Resend } from "resend";

export async function POST(req) {
  try {
    const { email, name, status } = await req.json();

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw new Error("Missing RESEND_API_KEY in environment variables");
    }

   const resend = new Resend(process.env.RESEND_API_KEY);

const result = await resend.emails.send({
  from: "onboarding@resend.dev",
  to: email,
  subject: "TEST EMAIL",
  html: `<h1>TEST</h1>`,
});

console.log("RESEND RESULT:", result);  

    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}