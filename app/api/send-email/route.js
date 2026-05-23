const {
  email,       // requester email (for allowlist check)
  name,
  status,
  pickup,
  destination,
  schedule,
  vehicle,
} = body || {};

if (!name || !status) {
  return NextResponse.json(
    { success: false, error: "Missing required fields: name or status" },
    { status: 400 }
  );
}

// ================= ALLOWLIST CHECK (optional but recommended) =================
// Only send notifications if requester email is in your directory.
// Directory table: allowed_users(email). Change to your table/column as needed.
if (!email) {
  return NextResponse.json(
    { success: true, message: "No requester email provided. Skipping allowlist check and notification." },
    { status: 200 }
  );
}

const { data: allowed, error: allowError } = await supabase
  .from("allowed_users")
  .select("email")
  .eq("email", email)
  .maybeSingle();

if (allowError) {
  return NextResponse.json(
    { success: false, error: allowError.message },
    { status: 500 }
  );
}

if (!allowed) {
  return NextResponse.json(
    { success: true, message: "Requester email not in allowlist. Notification skipped." },
    { status: 200 }
  );
}

// ================= GET STAFF EMAILS =================
const { data: staffList, error: staffError } = await supabase
  .from("staff")
  .select("staff_email");

if (staffError) {
  return NextResponse.json(
    { success: false, error: staffError.message },
    { status: 500 }
  );
}

const staffEmails = (staffList || [])
  .map((s) => s.staff_email)
  .filter(Boolean);

if (staffEmails.length === 0) {
  return NextResponse.json(
    { success: false, message: "No staff emails found in database" },
    { status: 404 }
  );
}

const template = statusMessage[status] || {};
const title = template.title || "📌 Status Update";
const msg = template.message || "There’s an update on a request.";
const comfort = (comfortLinesByStatus[status] && comfortLinesByStatus[status].length)
  ? pick(comfortLinesByStatus[status])
  : "We’re here if you need anything.";
const quote = pick(quotes);

// ================= SEND EMAIL =================
const result = await resend.emails.send({
  from: "ISLA-Transpo <onboarding@resend.dev>", // replace with verified sender
  to: staffEmails,
  subject: `ISLA‑Transpo Update: ${status}`,
  html: `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#f8fafc;padding:24px;">
      <div style="max-width:640px;margin:auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e2e8f0;">
        <div style="background:linear-gradient(90deg,#0ea5e9,#2563eb);padding:18px 22px;color:#fff;">
          <h2 style="margin:0;font-size:20px;letter-spacing:0.2px;">🚐 ISLA‑Transpo</h2>
          <div style="opacity:0.9;font-size:13px;margin-top:2px;">Dispatch & Trip Updates</div>
        </div>

        <div style="padding:22px;">
          <p style="margin:0 0 12px 0;color:#0f172a;">Hello Team,</p>

          <h3 style="margin:0 0 8px 0;color:#0f172a;">${title}</h3>
          <p style="margin:0 0 14px 0;color:#334155;line-height:1.5;">${msg}</p>

          <div style="margin:16px 0;padding:14px;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:13px;color:#334155;">
              <div><b>Requester:</b> ${name}${email ? ` (${email})` : ""}</div>
              <div><b>Vehicle:</b> ${vehicle || "Not assigned yet"}</div>
              <div><b>Pickup:</b> ${pickup || "—"}</div>
              <div><b>Destination:</b> ${destination || "—"}</div>
              <div style="grid-column:1/-1;"><b>Schedule:</b> ${schedule || "—"}</div>
            </div>
          </div>

          <div style="margin:16px 0;padding:14px;border-left:4px solid #22c55e;background:#f0fdf4;border-radius:10px;">
            <div style="color:#14532d;font-size:13px;line-height:1.5;">
              ${comfort}
            </div>
          </div>

          <blockquote style="margin:18px 0 4px 0;padding:14px 16px;border-left:4px solid #2563eb;background:#eff6ff;border-radius:10px;color:#1e3a8a;font-style:italic;font-size:13px;">
            ${quote}
          </blockquote>

          <p style="margin:18px 0 0 0;color:#475569;font-size:12px;line-height:1.5;">
            Warmly,<br/>
            ISLA‑Transpo Notification System
          </p>
        </div>

        <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:12px 18px;color:#64748b;font-size:11px;">
          Need help? Reply to this email or contact dispatch.
        </div>
      </div>
    </div>
  `,
});

if (result && result.error) {
  return NextResponse.json(
    { success: false, error: result.error },
    { status: 500 }
  );
}

return NextResponse.json({
  success: true,
  message: "Emails sent to staff successfully",
  result,
});
