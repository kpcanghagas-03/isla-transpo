"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RequestPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    full_name: "",
    organization: "",
    contact_number: "",
    passengers: "",
    pickup_location: "",
    destination: "",
    travel_date: "",
    travel_time: "",
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
          travel_datetime: formData.travel_date,
          travel_time: formData.travel_time,
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
      travel_date: "",
      travel_time: "",
      vehicle_type: "Van",
      special_requests: "",
    });
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

  return (
    <main style={pageStyle}>
      <div style={formBox}>
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

        <div
        style={{
          display: "flex",
          gap: 20,
          marginBottom: 12,
        }}
      >     
          <div style={{ flex: 1 }}>
              <label
                style={{  color: "#334155", fontSize: 14, fontWeight: "bold" }}
              >
                Travel Date
              </label>

              <input
                type="date"
                name="travel_date"
                value={formData.travel_date}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  color: "black",
                  fontSize: 16,
                  marginTop: 5,
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label
                style={{color: "#334155", 
                  fontSize: 14, fontWeight: "bold"
                 }}
              >
                Travel Time
              </label>

              <input
                type="time"
                name="travel_time"
                value={formData.travel_time}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  color: "black",
                  fontSize: 16,
                  marginTop: 5,
                }}
              />
            </div>
          </div>

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