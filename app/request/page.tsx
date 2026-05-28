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
    airline: "",
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SUBMIT =================
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
      requester_name: formData.requester_name,
      email: cleanEmail,
      staff_email: isStaff ? cleanEmail : null,
      committee_unit: formData.committee_unit,
      passengers: formData.passengers,
      passenger_names: formData.passenger_names,

      pickup_location: formData.pickup_location,
      destination: formData.destination,

      flight_no: formData.flight_no || null,
      airline: formData.airline || null,
      flight_arrival_date: formData.flight_arrival_date || null,
      flight_arrival_time: formData.flight_arrival_time || null,

      pick_up_date: formData.pick_up_date || null,
      pick_up_time: formData.pick_up_time || null,

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
      alert("Something went wrong submitting your request.");
      console.log(error);
      return;
    }

    alert("Transport Request Submitted Successfully!");

    setFormData({
      requester_name: "",
      email: "",
      committee_unit: "",
      passengers: "",
      passenger_names: "",
      pickup_location: "",
      destination: "",
      flight_no: "",
      airline: "",
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

  // ================= STYLES (MATCH ATTENDEE GLASS DESIGN) =================
  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    padding: 20,
    fontFamily: "Segoe UI, sans-serif",
    backgroundImage:
      "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url('/camiguin.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  };

  const glassCard: React.CSSProperties = {
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(20px)",
    borderRadius: 30,
    padding: 30,
    maxWidth: 800,
    margin: "0 auto",
    border: "1px solid rgba(255,255,255,0.25)",
    boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "none",
    marginBottom: 12,
    background: "rgba(255,255,255,0.95)",
    fontSize: 14,
    color: "#0f172a",
    outline: "none",
  };

  const sectionTitle: React.CSSProperties = {
    color: "#60A5FA",
    fontWeight: 800,
    fontSize: 16,
    marginTop: 18,
    marginBottom: 10,
  };

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: "8px 12px",
    borderRadius: 20,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700,
    marginRight: 8,
    marginBottom: 8,
    border: "1px solid rgba(255,255,255,0.4)",
    background: active ? "#1E40AF" : "rgba(255,255,255,0.15)",
    color: "white",
  });

  return (
    <main style={pageStyle}>
      <div style={glassCard}>
        {/* HEADER */}
        <h1 style={{ color: "white", fontSize: 34, fontWeight: 900 }}>
          ISLA-Transpo Request
        </h1>
        <p style={{ color: "#E2E8F0", marginBottom: 20 }}>
          Fill out your transportation details
        </p>

        {/* REQUESTER */}
        <div style={sectionTitle}>👤 Requester Information</div>

        <input
          name="requester_name"
          placeholder="Name"
          value={formData.requester_name}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="committee_unit"
          placeholder="Committee / Unit"
          value={formData.committee_unit}
          onChange={handleChange}
          style={inputStyle}
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
          style={{ ...inputStyle, height: 80 }}
        />

        {/* PICKUP SCHEDULE (MOVED HERE) */}
        <div style={sectionTitle}>🕒 Pick-up Schedule</div>

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

        {/* LOCATION */}
        <input
          name="pickup_location"
          placeholder="Pick-up Location"
          value={formData.pickup_location}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="destination"
          placeholder="Destination"
          value={formData.destination}
          onChange={handleChange}
          style={inputStyle}
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

        {/* AIRLINE SELECT */}
        <div style={{ marginBottom: 10 }}>
          {["Cebu Pacific", "PAL", "AirAsia"].map((air) => (
            <span
              key={air}
              onClick={() =>
                setFormData({ ...formData, airline: air })
              }
              style={chipStyle(formData.airline === air)}
            >
              {air}
            </span>
          ))}
        </div>

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
          style={inputStyle}
        />

        {/* REMARKS */}
        <div style={sectionTitle}>📝 Notes / Remarks</div>

        <textarea
          name="notes_remarks"
          placeholder="Notes"
          value={formData.notes_remarks}
          onChange={handleChange}
          style={{ ...inputStyle, height: 90 }}
        />

        {/* BUTTONS */}
        <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
          <button
            onClick={() => router.push("/")}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 10,
              border: "1px solid white",
              background: "transparent",
              color: "white",
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
              borderRadius: 10,
              border: "none",
              background: "#1E40AF",
              color: "white",
              fontWeight: 800,
            }}
          >
            Submit Request
          </button>
        </div>
      </div>
    </main>
  );
}