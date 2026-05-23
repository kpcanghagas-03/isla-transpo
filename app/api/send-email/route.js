import { NextResponse } from "next/server";

function getStatusMessage(status: string, name: string) {
  switch (status) {
    case "Pending":
      return {
        title: "We’ve received your request 🤍",
        message: `Hi ${name}, thank you for trusting ISLA-TRANSPO. Your request is now being reviewed by our team. We’ll update you as soon as possible.`,
        quote: "“Patience is not about waiting, but how you behave while waiting.”",
      };

    case "Approved":
      return {
        title: "Your request has been approved 🎉",
        message: `Good news, ${name}! Your transport request has been approved. Our team is now preparing everything to ensure a smooth and safe trip for you.`,
        quote: "“Great things are coming together for you.”",
      };

    case "On the way":
      return {
        title: "Your ride is on the way 🚗",
        message: `Hi ${name}, your assigned vehicle is now on the way. Please stay ready and reachable. We’re almost there!`,
        quote: "“Good service is not just speed, but care on the way.”",
      };

    case "Completed":
      return {
        title: "Trip completed successfully 🙏",
        message: `Thank you, ${name}, for riding with ISLA-TRANSPO. We hope your trip was safe and comfortable. We’re always here whenever you need us.`,
        quote: "“Gratitude turns ordinary service into meaningful connection.”",
      };

    case "Disapproved":
      return {
        title: "Update on your request",
        message: `Hi ${name}, we sincerely apologize. After careful review, your request could not be approved at this time. You may submit again or contact support for assistance.`,
        quote: "“Every no today can lead to a better yes tomorrow.”",
      };

    case "Emergency":
      return {
        title: "Emergency transport update 🚨",
        message: `Hi ${name}, we are prioritizing your emergency request. Our team is already taking immediate action to assist you as quickly as possible.`,
        quote: "“In urgent moments, care becomes our fastest response.”",
      };

    default:
      return {
        title: "Update from ISLA-TRANSPO",
        message: `Hi ${name}, there is an update regarding your transport request.`,
        quote: "“We’re here to make your journey easier.”",
      };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, name, status, pickup, destination, schedule, vehicle } = body;

    const content = getStatusMessage(status, name);

    console.log("EMAIL TRIGGER:", body);

    // 🔥 Here you would integrate Resend / Email provider
    // Example payload structure:

    /*
    await resend.emails.send({
      from: "ISLA-TRANSPO <noreply@yourdomain.com>",
      to: email,
      subject: content.title,
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>${content.title}</h2>

          <p>${content.message}</p>

          <hr/>

          <p><b>Trip Details:</b></p>
          <p>Pickup: ${pickup}</p>
          <p>Destination: ${destination}</p>
          <p>Schedule: ${schedule}</p>
          <p>Vehicle: ${vehicle}</p>

          <br/>

          <blockquote style="font-style:italic;color:#555">
            ${content.quote}
          </blockquote>

          <br/>

          <p>— ISLA-TRANSPO Team 🚐</p>
        </div>
      `,
    });
    */

    return NextResponse.json({
      success: true,
      message: "Warm email prepared successfully",
      preview: content,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}