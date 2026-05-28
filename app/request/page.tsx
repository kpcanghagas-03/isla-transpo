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

    // NEW: Airline selection
    airline: "",

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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async () => {
    const cleanEmail = formData.email.trim().toLowerCase();

    const { data: staffList, error: staffError } = await supabase
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

      airline: formData.airline, // NEW

      pickup_location: formData.pickup_location,
      destination: formData.destination,

      flight_no: formData.flight_no || null,
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
      console.log("INSERT ERROR:", error);
      alert("Something went wrong submitting your request.");
      return;
    }

    alert("Transport Request Submitted Successfully!");

    setFormData({
      requester_name: "",
      email: "",
      committee_unit: "",
      passengers: "",
      passenger_names: "",
      airline: "",
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

  // ================= STYLES =================
  const pageStyle = {
    minHeight: "100vh",
    padding: 20,
    fontFamily: "Segoe UI, sans-serif",
    backgroundImage: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.65)), url('/camiguin.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  };

  const formBox = {
    background: "white",
    maxWidth: 780,
    margin: "0 auto",
    padding: 30,
    borderRadius: 18,
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  };

  const inputStyle = {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #CBD5E1",
    marginBottom: 12,
    fontSize: 14,
    color: "#0F172A",
    backgroundColor: "white",
  };

  const sectionTitle = {
    color: "#0B3D91",
    fontWeight: 800,
    fontSize: 16,
    marginTop: 22,
    marginBottom: 10,
  };

  return (
    <main style={pageStyle}>
      <div style={formBox}>
        {/* HEADER */}
        <h1 style={{ color: "#0B3D91", marginBottom: 5 }}>
          ISLA-Transpo
        </h1>
        <p style={{ color: "#475569", marginBottom: 20 }}>
          Transport Request Form
        </p>

        {/* REQUESTER */}
        <div style={sectionTitle}>👤 Requester Information</div>

        <input
          name="requester_name"
          placeholder="Name of Requester"
          value={formData.requester_name}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="email"
          placeholder="Email Address"
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

        {/* PASSENGERS */}
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

        {/* PICKUP & DESTINATION */}
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

        {/* FLIGHT DETAILS */}
        <div style={sectionTitle}>✈️ Flight Details</div>

        <input
          name="flight_no"
          placeholder="Flight Number"
          value={formData.flight_no}
          onChange={handleChange}
          style={inputStyle}
        />

        {/* NEW AIRLINE SELECT */}
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontWeight: 700, color: "#334155" }}>
            Airline
          </p>

          {["Cebu Pacific", "Philippine Airlines (PAL)", "Other"].map((air) => (
            <label key={air} style={{ marginRight: 15, color: "#0F172A" }}>
              <input
                type="radio"
                name="airline"
                value={air}
                checked={formData.airline === air}
                onChange={handleChange}
              />{" "}
              {air}
            </label>
          ))}
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
        <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
          <button
            onClick={() => router.push("/")}
            style={{
              flex: 1,
              border: "2px solid #0B3D91",
              color: "#0B3D91",
              background: "white",
              padding: 12,
              borderRadius: 10,
              fontWeight: 700,
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
              border: "none",
              padding: 12,
              borderRadius: 10,
              fontWeight: 700,
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