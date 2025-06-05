import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_BASE = import.meta.env.VITE_API_BASE_URL;


const MASTER_KEY = '<YOUR_API_KEY>';
localStorage.clear();
const AlertForm = () => {
  
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    count: '',
    injured: false,
    seniorCitizen: false,
    children: false,
    women: false,
    needVolunteer: true,
  });
const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("https://epbackend-7qjc.onrender.com/submit-alert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    console.log("Response from backend:", data);

    // Assign volunteer BEFORE navigating
    if (form.needVolunteer) {
      await assignVolunteer();
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        navigate('/route-plan', {
          state: {
            form: {
              ...form,
              latitude,
              longitude,
            },
          },
        });
      },
      (error) => {
        console.warn("Geolocation error:", error.message);
        navigate('/route-plan', {
          state: {
            form: {
              name: form.name,
              contact: form.phone,
              latitude: 12.9716,
              longitude: 77.5946,
            },
          },
        });
      }
    );
  } catch (error) {
    console.error("Failed to submit alert:", error);
  }
};
const assignVolunteer = async () => {
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/681f9a828a456b79669b1aaa/latest`, {
      headers: {
        "X-Master-Key": MASTER_KEY
      }
    });
    const data = await res.json();
    const volunteers = data.record.volunteers;

    const availableVolunteer = volunteers.find(
      v => v.availability.toLowerCase() === "yes"
    );

    if (!availableVolunteer) {
      alert("No volunteers available currently.");
      return;
    }

    const updatedVolunteers = volunteers.map(v =>
      v.email === availableVolunteer.email
        ? { ...v, availability: "No" }
        : v
    );

    await fetch(`https://api.jsonbin.io/v3/b/681f9a828a456b79669b1aaa`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": MASTER_KEY
      },
      body: JSON.stringify({ volunteers: updatedVolunteers }),
    })
    localStorage.clear();
  
    localStorage.setItem("assignedVolunteer", JSON.stringify(availableVolunteer));
    alert("Volunteer assigned!");
  } catch (err) {
    console.error("Error assigning volunteer:", err);
  }
};

  return (
    <div className="alert-container">
      <h2 className="alert-title">Evacuation Request Form</h2>
      <form onSubmit={handleSubmit} className="alert-form">

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          className="alert-input"
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Contact Number"
          value={form.phone}
          onChange={handleChange}
          className="alert-input"
          required
        />

        <input
          type="number"
          name="count"
          placeholder="Number of People With You"
          value={form.count}
          onChange={handleChange}
          className="alert-input"
        />

        <label className="alert-checkbox-label">
          <input
            type="checkbox"
            name="injured"
            onChange={handleChange}
            checked={form.injured}

          />
          Anyone Injured?
        </label>

        <label className="alert-checkbox-label">
          <input
            type="checkbox"
            name="seniorCitizen"
            onChange={handleChange}
            checked={form.seniorCitizen}
          />
          Any Senior Citizens?
        </label>

        <label className="alert-checkbox-label">
          <input
            type="checkbox"
            name="children"
            onChange={handleChange}
            checked={form.children}
          />
          Any Children?
        </label>

        <label className="alert-checkbox-label">
          <input
            type="checkbox"
            name="women"
            checked={form.women}
            onChange={handleChange}
          />
          Pregnant Woman?
        </label>

        <label className="alert-checkbox-label">
          <input
            type="checkbox"
            name="needVolunteer"
            checked={form.needVolunteer}
            onChange={handleChange}
          />
          Need Volunteer Help?
        </label>

        <button
          type="submit"
          className="alert-button"
        >
          Submit Alert 🚨
        </button>
      </form>
    </div>
  );
};

export default AlertForm;
