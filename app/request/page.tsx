"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RequestPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    requester_name: "",
    email: "",
    committee_unit: "",

    passengers: "",
    passenger_names: "",

    pickup_location: "",
    destination: "",

    flight_no: "",
    flight_arrival_date: "",
    flight_arrival_time: "",

    pick_up_date: "",
    pick_up_time: "",

    airline: "",

    contact_person: "",
    contact_number: "",
    alternate_contact_person: "",
    alternate_contact_number: "",

    notes_remarks: "",
  });

  // ================= HANDLE CHANGE =================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async () => {
    const cleanEmail = formData.email.trim().toLowerCase();

    const { data: staffList } = await supabase
      .from("staff")
      .select("staff_email");

    const isStaff = staffList?.some(
      (s: any) =>
        s.staff_email &&
        s.staff_email.trim().toLowerCase() === cleanEmail
    );

    const staff_email = isStaff ? cleanEmail : null;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !formData.requester_name ||
      !formData.email ||
      !formData.pickup_location ||
      !formData.destination ||
      !formData.pick_up_date ||
      !formData.pick_up_time ||
      !formData.contact_number
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!emailRegex.test(cleanEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    const payload = {
      requester_name: formData.requester_name,
      email: cleanEmail,
      staff_email,

      committee_unit: formData.committee_unit,
      passengers: formData.passengers,
      passenger_names: formData.passenger_names,

      pickup_location: formData.pickup_location,
      destination: formData.destination,

      flight_no: formData.flight_no || null,
      flight_arrival_date: formData.flight_arrival_date || null,
      flight_arrival_time: formData.flight_arrival_time || null,

      pick_up_date: formData.pick_up_date || null,
      pick_up_time: formData.pick_up_time || null,

      airline: formData.airline || null,

      contact_person: formData.contact_person,
      contact_number: formData.contact_number,
      alternate_contact_person: formData.alternate_contact_person || null,
      alternate_contact_number: formData.alternate_contact_number || null,

      notes_remarks: formData.notes_remarks || null,

      status: "Pending",
      priority: "Attendee",
    };

    const { error } = await supabase
      .from("transport_requests")
      .insert([payload]);

    if (error) {
      console.log("INSERT ERROR:", error);
      alert("Something went wrong submitting your request.");
      return;
    }

    // EMAIL
    try {
      await fetch("/api/send_email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          name: formData.requester_name,
          status: "Pending",
          pickup: formData.pickup_location,
          destination: formData.destination,
          schedule: `${formData.pick_up_date}, ${formData.pick_up_time}`,
          vehicle: "",
        }),
      });
    } catch (err) {
      console.log("EMAIL ERROR:", err);
    }

    alert("Transport Request Submitted Successfully!");

    // RESET
    setFormData({
      requester_name: "",
      email: "",
      committee_unit: "",
      passengers: "",
      passenger_names: "",
      pickup_location: "",
      destination: "",
      flight_no: "",
      flight_arrival_date: "",
      flight_arrival_time: "",
      pick_up_date: "",
      pick_up_time: "",
      airline: "",
      contact_person: "",
      contact_number: "",
      alternate_contact_person: "",
      alternate_contact_number: "",
      notes_remarks: "",
    });
  };

  // ================= STYLES (GLASS + CAMIGUIN LIKE PROGRAM PAGE) =================
  const pageStyle = {
    minHeight: "100vh",
    padding: 20,
    fontFamily: "Segoe UI, sans-serif",
    backgroundImage:
      "linear-gradient(135deg, #0B3D91 0%, #1E40AF 50%, #3B82F6 100%), url('/camiguin.jpg')",
    backgroundBlendMode: "overlay",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const formBox = {
    maxWidth: 820,
    margin: "0 auto",
    padding: 30,
    borderRadius: 20,

    // GLASS EFFECT (RESTORED)
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.25)",
    boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
  };

  const inputStyle = {
    width: "100%",
    padding: 11,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.4)",
    marginBottom: 12,
    fontSize: 14,
    color: "#0F172A",
    backgroundColor: "rgba(255,255,255,0.95)",
    outline: "none",
  };

  const sectionTitle = {
    color: "#ffffff",
    fontWeight: 900,
    fontSize: 15,
    marginTop: 22,
    marginBottom: 10,
    textShadow: "0 2px 10px rgba(0,0,0,0.4)",
  };

  const labelStyle = {
    color: "white",
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 6,
    display: "block",
  };

  return (
    <main style={pageStyle}>
      <div style={formBox}>
        {/* HEADER */}
        <h1 style={{ color: "white", marginBottom: 5 }}>
          ISLA-Transpo
        </h1>
        <p style={{ color: "#E2E8F0", marginBottom: 18 }}>
          Transport Request Form
        </p>

        {/* REQUESTER */}
        <div style={sectionTitle}>👤 Requester Information</div>

        <input name="requester_name" placeholder="Name" value={formData.requester_name} onChange={handleChange} style={inputStyle} />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} style={inputStyle} />
        <input name="committee_unit" placeholder="Committee / Unit" value={formData.committee_unit} onChange={handleChange} style={inputStyle} />

        {/* TRANSPORT */}
        <div style={sectionTitle}>🚍 Transport Details</div>

        <input name="passengers" placeholder="Number of Passengers" value={formData.passengers} onChange={handleChange} style={inputStyle} />

        <textarea
          name="passenger_names"
          placeholder="Passenger Names"
          value={formData.passenger_names}
          onChange={handleChange}
          style={{ ...inputStyle, height: 80 }}
        />

        {/* PICKUP SCHEDULE */}
        <div style={sectionTitle}>🕒 Pick-up Schedule</div>

        <input type="date" name="pick_up_date" value={formData.pick_up_date} onChange={handleChange} style={inputStyle} />
        <input type="time" name="pick_up_time" value={formData.pick_up_time} onChange={handleChange} style={inputStyle} />

        {/* PICKUP + DESTINATION */}
        <input name="pickup_location" placeholder="Pick-up Location" value={formData.pickup_location} onChange={handleChange} style={inputStyle} />
        <input name="destination" placeholder="Destination" value={formData.destination} onChange={handleChange} style={inputStyle} />

        {/* FLIGHT DETAILS (RESTORED FULL) */}
        <div style={sectionTitle}>✈️ Flight Details</div>

        <input name="flight_no" placeholder="Flight Number" value={formData.flight_no} onChange={handleChange} style={inputStyle} />

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <span style={labelStyle}>Arrival Date</span>
            <input type="date" name="flight_arrival_date" value={formData.flight_arrival_date} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ flex: 1 }}>
            <span style={labelStyle}>Arrival Time</span>
            <input type="time" name="flight_arrival_time" value={formData.flight_arrival_time} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        {/* AIRLINE */}
        <div style={sectionTitle}>✈️ Airline</div>

        {["Cebu Pacific", "Philippine Airlines (PAL)", "Other"].map((a) => (
          <label key={a} style={{ color: "white", marginRight: 12 }}>
            <input
              type="radio"
              name="airline"
              value={a}
              checked={formData.airline === a}
              onChange={handleChange}
            />{" "}
            {a}
          </label>
        ))}

        {/* CONTACT */}
        <div style={sectionTitle}>📞 Contact Details</div>

        <input name="contact_person" placeholder="Contact Person" value={formData.contact_person} onChange={handleChange} style={inputStyle} />
        <input name="contact_number" placeholder="Contact Number" value={formData.contact_number} onChange={handleChange} style={inputStyle} />

        {/* NOTES */}
        <div style={sectionTitle}>📝 Notes / Remarks</div>

        <textarea name="notes_remarks" placeholder="Notes" value={formData.notes_remarks} onChange={handleChange} style={{ ...inputStyle, height: 90 }} />

        {/* BUTTONS */}
        <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
          <button
            onClick={() => router.push("/")}
            style={{
              flex: 1,
              background: "white",
              color: "#0B3D91",
              borderRadius: 10,
              padding: 12,
              fontWeight: 800,
              border: "none",
              cursor: "pointer",
            }}
          >
            Back
          </button>

          <button
            onClick={handleSubmit}
            style={{
              flex: 2,
              background: "linear-gradient(135deg, #0B3D91, #1E40AF)",
              color: "white",
              borderRadius: 10,
              padding: 12,
              fontWeight: 800,
              border: "none",
              cursor: "pointer",
            }}
          >
            Submit Request
          </button>
        </div>
      </div>
    </main>
  );
}