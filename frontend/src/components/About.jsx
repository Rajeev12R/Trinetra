import React from 'react';
import video from '../assets/about.mp4'
const About = () => {
  return (
    <section id="about" className="py-16 px-6 bg-white text-gray-800">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-teal-600 mb-10">About Serenity</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-black p-8 lg:p-16 text-left rounded-lg shadow-lg">
            <span className="text-sm font-medium text-gray-400 mb-4 block">MENTAL HEALTH AI COMPANION</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">Your AI-Powered Mental Health Companion</h2>
            <p className="text-gray-400 mb-6">Serenity is an AI-driven mental health chatbot offering personalized support, emotional analysis, and actionable feedback to improve your well-being.</p>
            <ul className="text-gray-400 space-y-2">
              <li>✅ Emotion Analysis & Mood Tracking</li>
              <li>✅ Multi-Modal Communication (Text & Voice)</li>
              <li>✅ Personalized Self-Care Tips</li>
              <li>✅ Positive Reinforcement & Encouragement</li>
              <li>✅ Data-Driven Insights for Mental Well-being</li>
            </ul>
          </div>
          <div className="h-[500px] flex items-center justify-center p-6">
            <video src={video} alt="Serenity AI Chatbot" className="object-cover w-full h-full rounded-lg shadow-lg" autoPlay loop muted />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;