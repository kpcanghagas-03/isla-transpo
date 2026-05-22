import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    console.log("API ROUTE HIT");

    const body = await req.json();

    console.log("BODY:", body);

    const { email, name, status } = body;

    const data = await resend.emails.send({
      from: "ISLA Transpo <onboarding@resend.dev>",
      to: email,
      subject: "Transport Request Status",
      html: `
        <h2>Hello ${name}</h2>
        <p>Your request status is now:</p>
        <strong>${status}</strong>
      `,
    });

    console.log("RESEND RESPONSE:", data);

    return NextResponse.json(data);

  } catch (error) {
    console.error("EMAIL ERROR:", error);

    return NextResponse.json(
      { error: "Email failed" },
      { status: 500 }
    );
  }
}