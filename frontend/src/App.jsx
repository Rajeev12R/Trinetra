import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Chat from './components/Chat';
import MoodChart from './components/MoodChart';

const App = () => {
  return (
    <div className="bg-gray-100">
      <Navbar />
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
      </Routes>
    </div>
  );
};

export default App;