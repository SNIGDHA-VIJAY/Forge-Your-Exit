import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; 

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Evacuation Route Helper</h1>
      <p className="home-subtext">Your safety is our priority.</p>

      <Link to="/alert">
        <button className="home-button">
          🚨 Request Evacuation
        </button>
      </Link>

      <Link to="/volunteer" className="volunteer-link">
        Register as Volunteer
      </Link>
    </div>
  );
};

export default Home;
