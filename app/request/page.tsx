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
    contact_person: "",
    contact_number: "",
    alternate_contact_person: "",
    alternate_contact_number: "",
    notes_remarks: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const cleanEmail = formData.email.trim().toLowerCase();

    const { data: staffList } = await supabase
      .from("staff")
      .select("staff_email");

    const isStaff = staffList?.some(
      (s: any) =>
        s.staff_email?.trim().toLowerCase() === cleanEmail
    );

    const payload = {
      ...formData,
      email: cleanEmail,
      staff_email: isStaff ? cleanEmail : null,
      status: "Pending",
      priority: "Attendee",
    };

    const { error } = await supabase
      .from("transport_requests")
      .insert([payload]);

    if (error) {
      alert("Something went wrong.");
      console.log(error);
      return;
    }

    alert("Transport request submitted successfully!");

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
      contact_person: "",
      contact_number: "",
      alternate_contact_person: "",
      alternate_contact_number: "",
      notes_remarks: "",
    });
  };

  const inputStyle = {
    width: "100%",
    padding: "11px",
    borderRadius: 10,
    border: "1px solid #CBD5E1",
    fontSize: 14,
    outline: "none",
    backgroundColor: "white",
    color: "#0F172A",
  };

  const sectionTitle = {
    color: "#0B3D91",
    fontSize: 18,
    fontWeight: 900,
    margin: "22px 0 10px",
    textShadow: "0 1px 2px rgba(255,255,255,0.6)",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 20,
        fontFamily: "Segoe UI, sans-serif",

        // CAMIGUIN BACKGROUND + DARK OVERLAY FOR READABILITY
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url('/camiguin.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div style={{ maxWidth: 850, margin: "0 auto" }}>
        {/* BACK BUTTON */}
        <button
          onClick={() => router.push("/")}
          style={{
            marginBottom: 15,
            padding: "10px 16px",
            borderRadius: 12,
            border: "none",
            background: "white",
            color: "#0B3D91",
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
          }}
        >
          ← Back
        </button>

        {/* HEADER (glass like program page) */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 20,
            padding: "25px 20px",
            background: "rgba(255,255,255,0.12)",
            borderRadius: 24,
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.2)",
              padding: "6px 18px",
              borderRadius: 50,
              marginBottom: 10,
            }}
          >
            <span style={{ color: "white", fontWeight: 600, fontSize: 13 }}>
              🚍 ISLA-Transpo System
            </span>
          </div>

          <h1
            style={{
              color: "white",
              fontSize: "clamp(28px, 6vw, 46px)",
              fontWeight: 900,
              margin: 0,
              textShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            Transport Request Form
          </h1>

          <p style={{ color: "#E2E8F0", marginTop: 8, fontSize: 14 }}>
            Fill out your transportation request details
          </p>
        </div>

        {/* FORM CARD (glass white for readability) */}
        <div
          style={{
            background: "rgba(255,255,255,0.96)",
            borderRadius: 24,
            padding: 26,
            boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          }}
        >
          {/* REQUESTER */}
          <div style={sectionTitle}>👤 Requester Information</div>

          <input
            name="requester_name"
            placeholder="Requester Name"
            value={formData.requester_name}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            style={{ ...inputStyle, marginTop: 10 }}
          />

          <input
            name="committee_unit"
            placeholder="Committee / Unit"
            value={formData.committee_unit}
            onChange={handleChange}
            style={{ ...inputStyle, marginTop: 10 }}
          />

          {/* TRANSPORT */}
          <div style={sectionTitle}>🚍 Transport Details</div>

          <input
            name="passengers"
            placeholder="Number of Passengers"
            value={formData.passengers}
            onChange={handleChange}
            style={inputStyle}
          />

          <textarea
            name="passenger_names"
            placeholder="Passenger Names"
            value={formData.passenger_names}
            onChange={handleChange}
            style={{ ...inputStyle, marginTop: 10, height: 85 }}
          />

          {/* PICKUP SCHEDULE (MOVED HERE) */}
          <div style={sectionTitle}>🕒 Pickup Schedule</div>

          <div style={{ display: "flex", gap: 10 }}>
            <input
              type="date"
              name="pick_up_date"
              value={formData.pick_up_date}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="time"
              name="pick_up_time"
              value={formData.pick_up_time}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <input
            name="pickup_location"
            placeholder="Pickup Location"
            value={formData.pickup_location}
            onChange={handleChange}
            style={{ ...inputStyle, marginTop: 10 }}
          />

          <input
            name="destination"
            placeholder="Destination"
            value={formData.destination}
            onChange={handleChange}
            style={{ ...inputStyle, marginTop: 10 }}
          />

          {/* FLIGHT */}
          <div style={sectionTitle}>✈️ Flight Details</div>

          <input
            name="flight_no"
            placeholder="Flight Number"
            value={formData.flight_no}
            onChange={handleChange}
            style={inputStyle}
          />

          <div style={{ display: "flex", gap: 10 }}>
            <input
              type="date"
              name="flight_arrival_date"
              value={formData.flight_arrival_date}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="time"
              name="flight_arrival_time"
              value={formData.flight_arrival_time}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* CONTACT */}
          <div style={sectionTitle}>📞 Contact Details</div>

          <input
            name="contact_person"
            placeholder="Contact Person"
            value={formData.contact_person}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="contact_number"
            placeholder="Contact Number"
            value={formData.contact_number}
            onChange={handleChange}
            style={{ ...inputStyle, marginTop: 10 }}
          />

          <input
            name="alternate_contact_person"
            placeholder="Alternate Contact Person"
            value={formData.alternate_contact_person}
            onChange={handleChange}
            style={{ ...inputStyle, marginTop: 10 }}
          />

          <input
            name="alternate_contact_number"
            placeholder="Alternate Contact Number"
            value={formData.alternate_contact_number}
            onChange={handleChange}
            style={{ ...inputStyle, marginTop: 10 }}
          />

          {/* NOTES */}
          <div style={sectionTitle}>📝 Notes / Remarks</div>

          <textarea
            name="notes_remarks"
            placeholder="Additional Notes / Remarks"
            value={formData.notes_remarks}
            onChange={handleChange}
            style={{ ...inputStyle, height: 90 }}
          />

          {/* BUTTONS */}
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button
              onClick={() => router.push("/")}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 12,
                border: "2px solid #0B3D91",
                color: "#0B3D91",
                background: "white",
                fontWeight: 800,
              }}
            >
              Back
            </button>

            <button
              onClick={handleSubmit}
              style={{
                flex: 2,
                padding: 12,
                borderRadius: 12,
                border: "none",
                color: "white",
                fontWeight: 800,
                background: "linear-gradient(135deg,#0B3D91,#1E40AF)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
              }}
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}