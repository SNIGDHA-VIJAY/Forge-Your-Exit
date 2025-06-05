// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AlertForm from './pages/AlertForm';
import RoutePlan from './pages/RoutePlan';
import VolunteerRegister from './pages/VolunteerRegister';
import NavBar from './components/NavBar';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/alert" element={<AlertForm />} />
        <Route path="/route-plan" element={<RoutePlan />} />
        <Route path="/volunteer" element={<VolunteerRegister />} />
      </Routes>
    </Router>
  );
}

export default App;
