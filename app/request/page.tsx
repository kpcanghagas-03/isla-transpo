"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RequestPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    full_name: "",
    organization: "",
    contact_number: "",
    passengers: "",
    pickup_location: "",
    destination: "",
    travel_datetime: "",
    vehicle_type: "Van",
    special_requests: "",
  });

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

  const handleSubmit = async () => {
    const { error } = await supabase
      .from("transport_requests")
      .insert([
        {
          full_name: formData.full_name,
          organization: formData.organization,
          contact_number: formData.contact_number,
          passengers: formData.passengers,
          pickup_location: formData.pickup_location,
          destination: formData.destination,
          travel_datetime: formData.travel_datetime,
          vehicle_type: formData.vehicle_type,
          special_requests: formData.special_requests,
        },
      ]);

    if (error) {
      alert("Error submitting request.");
      console.log(error);
      return;
    }

    alert("Transport request submitted successfully!");

    setFormData({
      full_name: "",
      organization: "",
      contact_number: "",
      passengers: "",
      pickup_location: "",
      destination: "",
      travel_datetime: "",
      vehicle_type: "Van",
      special_requests: "",
    });

    setStep(1);
  };

  // ================= STYLES =================

  const pageStyle = {
    padding: "20px",
    fontFamily: "Segoe UI, sans-serif",
    minHeight: "100vh",
    backgroundImage: "url('/camiguin.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const inputStyle = {
    padding: 10,
    borderRadius: 8,
    border: "1px solid black",
    width: "100%",
    marginBottom: 12,
    outline: "none",
    fontSize: 14,
  };

  const formBox = {
    background: "rgba(255,255,255,0.95)",
    padding: 30,
    borderRadius: 16,
    maxWidth: 600,
    width: "100%",
    margin: "0 auto",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    backdropFilter: "blur(8px)",
  };

  const primaryButton = {
    background: "linear-gradient(135deg, #0B3D91, #2563EB)",
    color: "white",
    padding: "14px 20px",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold" as const,
    fontSize: "clamp(16px, 2vw, 20px)",
    width: "100%",
    maxWidth: 320,
    marginTop: 10,
    whiteSpace: "nowrap" as const,
  };

  // ================= LANDING PAGE =================

  if (step === 1) {
    return (
      <main
        style={{
          ...pageStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            background: "rgba(255,255,255,0.92)",
            padding: "40px 20px",
            borderRadius: 20,
            maxWidth: 650,
            width: "100%",
            boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(24px, 6vw, 60px)",
              fontWeight: "bold",
              color: "#0B3D91",
              letterSpacing: 2,
              marginBottom: 10,
              textAlign: "center",
              lineHeight: 1.1,
              whiteSpace: "nowrap",
            }}
          >
            ISLA-TRANSPO
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "#475569",
              marginBottom: 30,
            }}
          >
            RSTW Transportation Management System
          </p>

          <button onClick={() => setStep(2)} style={primaryButton}>
            Click Here to Request Vehicle
          </button>
        </div>
      </main>
    );
  }

  // ================= FORM PAGE =================

  return (
    <main style={pageStyle}>
      <div style={formBox}>
        <h1 style={{ color: "#0B3D91", marginBottom: 5 }}>
          ISLA-Transpo
        </h1>

        <p style={{ marginBottom: 15, color: "#475569" }}>
          Fill out transportation request details
        </p>

        <input
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          style={{
            ...inputStyle,
            color: "black",
            fontSize: 16,
          }}
        />

        <input
          name="organization"
          placeholder="Organization"
          value={formData.organization}
          onChange={handleChange}
          style={{
            ...inputStyle,
            color: "black",
            fontSize: 16,
          }}
        />

        <input
          name="contact_number"
          placeholder="Contact Number"
          value={formData.contact_number}
          onChange={handleChange}
          style={{
            ...inputStyle,
            color: "black",
            fontSize: 16,
          }}
        />

        <input
          name="passengers"
          placeholder="Number of Passengers"
          value={formData.passengers}
          onChange={handleChange}
          style={{
            ...inputStyle,
            color: "black",
            fontSize: 16,
          }}
        />

        <input
          name="pickup_location"
          placeholder="Pickup Location"
          value={formData.pickup_location}
          onChange={handleChange}
          style={{
            ...inputStyle,
            color: "black",
            fontSize: 16,
          }}
        />

        <input
          name="destination"
          placeholder="Destination"
          value={formData.destination}
          onChange={handleChange}
          style={{
            ...inputStyle,
            color: "black",
            fontSize: 16,
          }}
        />

        <input
          type="datetime-local"
          name="travel_datetime"
          value={formData.travel_datetime}
          onChange={handleChange}
          style={{
            ...inputStyle,
            color: "black",
            fontSize: 16,
          }}
        />

        <select
          name="vehicle_type"
          value={formData.vehicle_type}
          onChange={handleChange}
          style={{
            ...inputStyle,
            color: "black",
            fontSize: 16,
          }}
        >
          <option>Van</option>
          <option>Bus</option>
          <option>Car</option>
        </select>

        <textarea
          name="special_requests"
          placeholder="Special Requests"
          value={formData.special_requests}
          onChange={handleChange}
          style={{
            ...inputStyle,
            color: "black",
            fontSize: 16,
            height: 100,
            resize: "none",
          }}
        />

        {/* BUTTONS */}

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