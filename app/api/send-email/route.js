import { Resend } from "resend";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("REQUEST BODY:", body);
    console.log("API KEY EXISTS:", !!process.env.RESEND_API_KEY);

    const resend = new Resend(process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "kpcanghagas@gmail.com",
      subject: "DEBUG EMAIL TEST",
      html: `<h1>It works</h1><p>Status: ${body.status}</p>`,
    });

    console.log("RESEND RESULT:", result);

    return Response.json({ success: true, result });
  } catch (error) {
    console.log("ERROR:", error);

    return Response.json({
      success: false,
      error: error.message,
    });
  }
}