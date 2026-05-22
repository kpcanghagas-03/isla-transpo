import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
export async function POST(req) {
  const body = await req.json();

  const { email, name, status, pickup, destination, schedule, vehicle } =
    body;

  // ================= CHECK IF STAFF =================
  const { data: staffList } = await supabase
    .from("staff")
    .select("email");

  const isStaff = staffList?.some((s) => s.email === email);

  if (!isStaff) {
    return NextResponse.json({
      success: false,
      message: "Email not in staff directory",
    });
  }

  // ================= SEND EMAIL =================
  const result = await resend.emails.send({
    from: "ISLA-Transpo <onboarding@resend.dev>",
    to: email,
    subject: `Transport Request Update: ${status}`,
    html: `
      <h2>Status Update</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Status:</b> ${status}</p>
      <p><b>Pickup:</b> ${pickup}</p>
      <p><b>Destination:</b> ${destination}</p>
      <p><b>Schedule:</b> ${schedule}</p>
      <p><b>Vehicle:</b> ${vehicle || "Not assigned"}</p>
    `,
  });

  return NextResponse.json(result);
}