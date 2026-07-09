export async function POST(req) {
  try {
    const body = await req.json();

    const response = await fetch(process.env.GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();

console.log(text);

return Response.json({
  success: true,
  googleResponse: text,
});

    return Response.json(result);
  } catch (error) {
    console.error("GOOGLE SHEET ERROR:", error);

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}