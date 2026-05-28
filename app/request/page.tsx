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
    const cleanEmail = formData.email.trim().toLowerCase();

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
      (s: any) =>
        s.staff_email &&
        s.staff_email.trim().toLowerCase() === cleanEmail
    );

    const staff_email = isStaff ? cleanEmail : null;

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
      flight_arrival_date:
        formData.flight_arrival_date || null,
      flight_arrival_time:
        formData.flight_arrival_time || null,
      pick_up_date: formData.pick_up_date || null,
      pick_up_time: formData.pick_up_time || null,
      contact_person: formData.contact_person,
      contact_number: formData.contact_number,
      alternate_contact_person:
        formData.alternate_contact_person || null,
      alternate_contact_number:
        formData.alternate_contact_number || null,
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
    padding: "20px",
    fontFamily: "Segoe UI, sans-serif",
    minHeight: "100vh",
    backgroundImage:
      "linear-gradient(rgba(0,0,0,0.60), rgba(0,0,0,0.70)), url('/camiguin.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  };

  const inputStyle = {
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.25)",
    width: "100%",
    marginBottom: 14,
    outline: "none",
    fontSize: 14,
    color: "#0F172A",
    backgroundColor: "rgba(255,255,255,0.95)",
    boxSizing: "border-box" as const,
  };

  const formBox = {
    background: "rgba(255,255,255,0.12)",
    padding: 35,
    borderRadius: 30,
    maxWidth: 950,
    width: "100%",
    margin: "0 auto",
    boxShadow: "0 25px 60px rgba(0,0,0,0.45)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.15)",
  };

  const sectionTitleStyle = {
    color: "white",
    fontSize: "20px",
    fontWeight: "800" as const,
    marginTop: 0,
    marginBottom: 18,
    display: "flex",
    alignItems: "center",
    gap: 10,
    textShadow: "0 2px 10px rgba(0,0,0,0.25)",
  };

  const cardStyle = {
    background:
      "linear-gradient(135deg, #0B3D91, #1E40AF)",
    borderRadius: 22,
    padding: 24,
    marginBottom: 22,
    boxShadow: "0 10px 35px rgba(0,0,0,0.18)",
    border: "1px solid rgba(255,255,255,0.15)",
  };

  return (
    <main style={pageStyle}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* BACK BUTTON */}

        <button
          onClick={() => router.push("/")}
          style={{
            marginBottom: 18,
            padding: "12px 20px",
            borderRadius: 12,
            border: "none",
            color: "#0B3D91",
            background: "white",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          }}
        >
          ← Back to Home
        </button>

        {/* MAIN FORM */}

        <div style={formBox}>
          {/* HEADER */}

          <div
            style={{
              textAlign: "center",
              marginBottom: 35,
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: "rgba(255,255,255,0.2)",
                borderRadius: 50,
                padding: "8px 20px",
                marginBottom: 15,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  color: "white",
                  fontWeight: 600,
                }}
              >
                🚐 RSTW Camiguin 2026
              </span>
            </div>

            <h1
              style={{
                color: "white",
                marginBottom: 10,
                fontSize: "clamp(34px, 6vw, 56px)",
                fontWeight: "900",
                textShadow:
                  "0 4px 20px rgba(0,0,0,0.35)",
                lineHeight: 1.1,
              }}
            >
              Transport Request
            </h1>

            <p
              style={{
                color: "#E2E8F0",
                fontSize: 16,
                maxWidth: 650,
                margin: "0 auto",
              }}
            >
              Submit your transportation request for
              airport pickups, ferry transfers, venue
              transportation, and official event travel.
            </p>
          </div>

          {/* REQUESTER INFO */}

          <div style={cardStyle}>
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
          </div>

          {/* TRANSPORT DETAILS */}

          <div style={cardStyle}>
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
              placeholder="Passenger Names"
              value={formData.passenger_names}
              onChange={handleChange}
              style={{
                ...inputStyle,
                height: 100,
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
          </div>

          {/* FLIGHT DETAILS */}

          <div style={cardStyle}>
            <div style={sectionTitleStyle}>
              ✈️ Flight Details
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
                gap: 18,
                flexWrap: "wrap" as const,
              }}
            >
              <div style={{ flex: 1, minWidth: 220 }}>
                <label
                  style={{
                    color: "white",
                    fontSize: 14,
                    fontWeight: "700",
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

              <div style={{ flex: 1, minWidth: 220 }}>
                <label
                  style={{
                    color: "white",
                    fontSize: 14,
                    fontWeight: "700",
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
          </div>

          {/* PICKUP SCHEDULE */}

          <div style={cardStyle}>
            <div style={sectionTitleStyle}>
              🕒 Pickup Schedule
            </div>

            <div
              style={{
                display: "flex",
                gap: 18,
                flexWrap: "wrap" as const,
              }}
            >
              <div style={{ flex: 1, minWidth: 220 }}>
                <label
                  style={{
                    color: "white",
                    fontSize: 14,
                    fontWeight: "700",
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

              <div style={{ flex: 1, minWidth: 220 }}>
                <label
                  style={{
                    color: "white",
                    fontSize: 14,
                    fontWeight: "700",
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
          </div>

          {/* CONTACT DETAILS */}

          <div style={cardStyle}>
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
          </div>

          {/* NOTES */}

          <div style={cardStyle}>
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
                height: 120,
                resize: "none",
              }}
            />
          </div>

          {/* BUTTONS */}

          <div
            style={{
              display: "flex",
              gap: 14,
              marginTop: 10,
            }}
          >
            <button
              onClick={() => router.push("/")}
              style={{
                flex: 1,
                color: "#0B3D91",
                border: "2px solid white",
                padding: "14px",
                borderRadius: 14,
                cursor: "pointer",
                fontWeight: "800",
                fontSize: 15,
                background:
                  "rgba(255,255,255,0.95)",
                boxShadow:
                  "0 6px 18px rgba(0,0,0,0.15)",
              }}
            >
              ← Back
            </button>

            <button
              onClick={handleSubmit}
              style={{
                flex: 2,
                background:
                  "linear-gradient(135deg, #2563EB, #60A5FA)",
                color: "white",
                padding: "14px",
                border: "none",
                borderRadius: 14,
                cursor: "pointer",
                fontWeight: "800",
                fontSize: 15,
                boxShadow:
                  "0 10px 25px rgba(37,99,235,0.35)",
              }}
            >
              🚐 Submit Transport Request
            </button>
          </div>
        </div>

        {/* FOOTER */}

        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.7)",
            fontSize: 13,
            marginTop: 22,
            paddingBottom: 10,
          }}
        >
          © 2026 Regional Science & Technology Week —
          Camiguin
        </p>
      </div>
    </main>
  );
}