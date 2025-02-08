import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Chat from './components/Chat';
import MoodChart from './components/MoodChart';
import NotFound from './components/NotFound'; // Create a NotFound component

const App = () => {
  return (
    <div className="bg-gray-100">
      {/* Navbar is outside Routes, so it appears on all routes */}
      <Navbar />

      {/* Routes for different pages */}
      <Routes>
        {/* Home Route */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <About />
              <FAQ />
              <Footer />
              <Chat />
            </>
          }
        />
        {/* Mood Chart Route */}
        <Route path="/mood-stats" element={<MoodChart />} />
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;