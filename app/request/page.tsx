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

  // ================= HANDLE INPUT CHANGE =================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

// ================= HANDLE SUBMIT =================
const handleSubmit = async () => {
  const cleanEmail = formData.email
    .trim()
    .toLowerCase();

  const {
    data: staffList,
    error: staffError,
  } = await supabase
    .from("staff")
    .select("staff_email");

  console.log("STAFF LIST:", staffList);

  if (staffError) {
    console.log("STAFF ERROR:", staffError);
  }

  const isStaff = staffList?.some(
    (s:any) =>
      s.staff_email &&
      s.staff_email.trim().toLowerCase() === cleanEmail
  );

  console.log("IS STAFF:", isStaff);

  const staff_email = isStaff
    ? cleanEmail
    : null;

  console.log("STAFF EMAIL:", staff_email);

  // ================= VALIDATION =================
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
 
   // ================= INSERT REQUEST =================
    const payload = {
      requester_name: formData.requester_name,
      email: cleanEmail,
      staff_email: staff_email,
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
    try {
      await fetch("/api/send_email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      console.log("AUTO EMAIL ERROR:", err);
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
  padding: "20px",
  fontFamily: "Segoe UI, sans-serif",
  color: "#FF4500",

  background:
    "linear-gradient(180deg,#FFF7ED 0%,#FFE7D1 40%,#FFFFFF 100%)",

  position: "relative" as const,
  overflow: "hidden",
};

  const inputStyle = {
    padding: 10,
    borderRadius: 8,
    border: "1px solid black",
    width: "100%",
    marginBottom: 12,
    outline: "none",
    fontSize: 14,

    // FIX WHITE TEXT
    color: "black",

    // FIX WHITE INPUT BACKGROUND
    backgroundColor: "white",
  };

  const formBox = {
    background: "rgba(255,255,255,0.95)",
    padding: 30,
    borderRadius: 16,
    maxWidth: 750,
    width: "100%",
    margin: "0 auto",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    backdropFilter: "blur(8px)",
  };

  const sectionTitleStyle = {
    color: "#0B3D91",
    fontSize: "20px",
    fontWeight: "bold" as const,
    marginTop: 25,
    marginBottom: 10,
  };

  return (
  <main style={pageStyle}>
    {/* LEFT DECORATION */}
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: 120,
        height: "100%",
        background:
          "linear-gradient(180deg,#F27A35,#A61E22,#1F5AA6)",
        opacity: 0.08,
        clipPath:
          "polygon(0 0,100% 0,70% 50%,100% 100%,0 100%)",
      }}
    />

    {/* RIGHT DECORATION */}
    <div
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        width: 120,
        height: "100%",
        background:
          "linear-gradient(180deg,#1F5AA6,#F27A35,#A61E22)",
        opacity: 0.08,
        clipPath:
          "polygon(30% 0,100% 0,100% 100%,0 100%,30% 50%)",
      }}
    />
      <div style={formBox}>
        {/* HEADER */}

        <h1
          style={{
            color: "#0B3D91",
            marginBottom: 5,
            fontSize: "clamp(28px, 5vw, 42px)",
          }}
        >
          ISLA-Transpo
        </h1>

        <p style={{ marginBottom: 20, color: "#475569" }}>
          Fill out transportation request details
        </p>

        {/* ================= REQUESTER INFO ================= */}

        <div style={sectionTitleStyle}>
          👤 Requester Information
        </div>

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

        {/* ================= TRANSPORT DETAILS ================= */}

        <div style={sectionTitleStyle}>
          🚍 Transport Details
        </div>

        <input
          name="passengers"
          placeholder="Number of Passengers"
          value={formData.passengers}
          onChange={handleChange}
          style={inputStyle}
        />

        <textarea
          name="passenger_names"
          placeholder="Name of Passengers"
          value={formData.passenger_names}
          onChange={handleChange}
          style={{
            ...inputStyle,
            height: 90,
            resize: "none",
          }}
        />

        <input
          name="pickup_location"
          placeholder="Pick Up Point"
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

        {/* ================= FLIGHT DETAILS ================= */}

        <div style={sectionTitleStyle}>
          ✈️ Flight Details (If Airport Pickup)
        </div>

        <input
          name="flight_no"
          placeholder="Flight Number"
          value={formData.flight_no}
          onChange={handleChange}
          style={inputStyle}
        />

        <div
          style={{
            display: "flex",
            gap: 20,
          }}
        >
          <div style={{ flex: 1 }}>
            <label
              style={{
                color: "#334155",
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              Arrival Date
            </label>

            <input
              type="date"
              name="flight_arrival_date"
              value={formData.flight_arrival_date}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label
              style={{
                color: "#334155",
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              Arrival Time
            </label>

            <input
              type="time"
              name="flight_arrival_time"
              value={formData.flight_arrival_time}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>

        {/* ================= PICKUP SCHEDULE ================= */}

        <div style={sectionTitleStyle}>
          🕒 Pickup Schedule
        </div>

        <div
          style={{
            display: "flex",
            gap: 20,
          }}
        >
          <div style={{ flex: 1 }}>
            <label
              style={{
                color: "#334155",
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              Pick Up Date
            </label>

            <input
              type="date"
              name="pick_up_date"
              value={formData.pick_up_date}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label
              style={{
                color: "#334155",
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              Pick Up Time
            </label>

            <input
              type="time"
              name="pick_up_time"
              value={formData.pick_up_time}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>

        {/* ================= CONTACT DETAILS ================= */}

        <div style={sectionTitleStyle}>
          📞 Contact Details
        </div>

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

        <input
          name="alternate_contact_person"
          placeholder="Alternate Contact Person"
          value={formData.alternate_contact_person}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="alternate_contact_number"
          placeholder="Alternate Contact Number"
          value={formData.alternate_contact_number}
          onChange={handleChange}
          style={inputStyle}
        />

        
        {/* ================= REMARKS ================= */}

        <div style={sectionTitleStyle}>
          📝 Notes / Remarks
        </div>

        <textarea
          name="notes_remarks"
          placeholder="Additional Notes / Remarks"
          value={formData.notes_remarks}
          onChange={handleChange}
          style={{
            ...inputStyle,

            height: 100,
            resize: "none",
          }}
        />

        {/* ================= BUTTONS ================= */}

        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 10,
          }}
        >
          <button
            onClick={() => router.push("/")}
            style={{
              flex: 1,
              color: "#0B3D91",
              border: "2px solid #0B3D91",
              padding: "12px",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 14,
              whiteSpace: "nowrap",
              background: "white",
            }}
          >
            Back
          </button>

          <button
            onClick={handleSubmit}
            style={{
              flex: 2,
              background:
                "linear-gradient(135deg, #0B3D91, #2563EB)",
              color: "white",
              padding: "12px",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 14,
              whiteSpace: "nowrap",
            }}
          >
            Submit Request
          </button>
        </div>
      </div>
    </main>
  );
}