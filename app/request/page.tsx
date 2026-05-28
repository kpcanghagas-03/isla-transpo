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

    const staff_email = isStaff ? cleanEmail : null;

    const payload = {
      ...formData,
      email: cleanEmail,
      staff_email,
      status: "Pending",
      priority: "Attendee",
    };

    const { error } = await supabase
      .from("transport_requests")
      .insert([payload]);

    if (error) {
      alert("Something went wrong.");
      return;
    }

    alert("Request submitted successfully!");

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
    padding: "10px",
    borderRadius: 10,
    border: "1px solid #E2E8F0",
    fontSize: 14,
    outline: "none",
  };

  const sectionTitle = {
    color: "#0B3D91",
    fontSize: 18,
    fontWeight: 800,
    margin: "20px 0 10px",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 20,
        fontFamily: "Segoe UI, sans-serif",
        backgroundImage:
          "linear-gradient(135deg, #0B3D91 0%, #1E40AF 50%, #3B82F6 100%)",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
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
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          }}
        >
          ← Back
        </button>

        {/* HEADER (same style as Program page) */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 25,
            padding: "25px 20px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: 24,
            backdropFilter: "blur(10px)",
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
            <span style={{ color: "white", fontSize: 13, fontWeight: 600 }}>
              🚍 ISLA-Transpo System
            </span>
          </div>

          <h1
            style={{
              color: "white",
              fontSize: "clamp(28px, 6vw, 46px)",
              fontWeight: 900,
              margin: 0,
            }}
          >
            Transport Request Form
          </h1>

          <p style={{ color: "rgba(255,255,255,0.85)", marginTop: 8 }}>
            Fill out your transportation details
          </p>
        </div>

        {/* FORM CARD */}
        <div
          style={{
            background: "white",
            borderRadius: 24,
            padding: 25,
            boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
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
            placeholder="Email"
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
            style={{ ...inputStyle, marginTop: 10, height: 80 }}
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
            placeholder="Additional Notes"
            value={formData.notes_remarks}
            onChange={handleChange}
            style={{ ...inputStyle, height: 90 }}
          />

          {/* BUTTONS */}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button
              onClick={() => router.push("/")}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 12,
                border: "2px solid #0B3D91",
                color: "#0B3D91",
                background: "white",
                fontWeight: 700,
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
                fontWeight: 700,
                background: "linear-gradient(135deg,#0B3D91,#1E40AF)",
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