import { useState } from 'react';

const VolunteerRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    area: '',
    availability: 'Yes',
    skills: '',
  });


  const MASTER_KEY = '<YOUR_API_KEY>'; 

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    
      const res = await fetch(`https://api.jsonbin.io/v3/b/681f9a828a456b79669b1aaa/latest`, {
        headers: {
          "X-Master-Key": MASTER_KEY,
        },
      });

      const data = await res.json();
      const existingVolunteers = data.record?.volunteers || [];

    
      const updatedVolunteers = [...existingVolunteers, formData];

  
      await fetch(`https://api.jsonbin.io/v3/b/681f9a828a456b79669b1aaa`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": MASTER_KEY,
        },
        body: JSON.stringify({ volunteers: updatedVolunteers }),
      });

      alert('Registration Successful!');
    
      setFormData({
        name: '',
        email: '',
        phone: '',
        area: '',
        availability:'',
        skills: '',
      });

    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Error submitting form');
    }
  };

  return (
    <div className="alert-container">
      <h2 className="alert-title">Volunteer Registration</h2>
      <form onSubmit={handleSubmit} className="alert-form">
        <input className="alert-input" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        <input className="alert-input" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input className="alert-input" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
        <input className="alert-input" name="area" placeholder="Locality, City/Area" value={formData.area} onChange={handleChange} />
        <input className="alert-input" name="availability" placeholder="Availability" value={formData.availability} onChange={handleChange} disabled />
        <textarea className="alert-input" name="skills" placeholder="Skills/Resources" value={formData.skills} onChange={handleChange} required></textarea>
        <button className="alert-button" type="submit">Register</button>
      </form>
    </div>
  );
};

export default VolunteerRegister;
