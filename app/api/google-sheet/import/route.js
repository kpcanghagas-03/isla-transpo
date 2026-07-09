export async function GET() {
  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbyGP8sQlBV97HaUj9i1NNNijgEOQzTx7i0R-8iGbnm8uLldj4OLlOVgMo-TccA959oViw/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: 999999,
        request_code: "TEST-001",
        requester_name: "Karen Test",
        email: "test@test.com",
        contact_number: "09123456789",
        committee_unit: "Testing",
        passenger_names: "Karen Test",
        passengers: 1,
        pickup_location: "CDO",
        destination: "Camiguin",
        pick_up_date: "2026-07-22",
        pick_up_time: "08:00",
        priority: "Attendee",
        status: "Pending",
        assigned_vehicle: "",
        driver_number: "",
        contact_person: "",
        alternate_contact_person: "",
        alternate_contact_number: "",
        flight_no: "",
        flight_arrival_date: "",
        flight_arrival_time: "",
        notes_remarks: "Testing Google Sheet",
        created_at: new Date().toISOString(),
      }),
    });

    const result = await response.text();

    return Response.json({
      success: true,
      googleResponse: result,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}