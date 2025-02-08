import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import video from '../assets/about.mp4';


gsap.registerPlugin(ScrollTrigger, TextPlugin);

const About = () => {
  const textRef = useRef(null);
  const videoRef = useRef(null);
  const listRefs = useRef([]);

  useEffect(() => {

    gsap.from(textRef.current, {
      opacity: 0,
      y: 50,
      duration: 1.5,
      ease: 'power3.out',
      delay: 0.5,
    });

    gsap.from(videoRef.current, {
      opacity: 0,
      x: 100,
      duration: 1.5,
      ease: 'power3.out',
      delay: 0.8,
    });

    gsap.from('.about-section', {
      opacity: 0,
      y: 50,
      duration: 1.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });

    listRefs.current.forEach((item, index) => {
      const text = item.textContent; 
      item.textContent = ''; 

      gsap.to(item, {
        duration: 1,
        delay: 1 + index * 0.5, 
        text: {
          value: text,
          speed: 1, 
        },
        ease: 'none',
      });
    });
  }, []);

  return (
    <section
      id="about"
      className="about-section py-16 px-6 bg-white text-gray-800"
    >
      <div className="container mx-auto text-center">
        <h2
          ref={textRef}
          className="text-4xl font-bold text-teal-600 mb-10"
        >
          About Serenity
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-black p-8 lg:p-16 text-left rounded-lg shadow-lg">
            <span className="text-sm font-medium text-gray-400 mb-4 block">
              MENTAL HEALTH AI COMPANION
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              Your AI-Powered Mental Health Companion
            </h2>
            <p className="text-gray-400 mb-6">
              Serenity is an AI-driven mental health chatbot offering personalized support, emotional analysis, and actionable feedback to improve your well-being.
            </p>
            <ul className="text-gray-400 space-y-2">
              <li ref={(el) => (listRefs.current[0] = el)}>
                ✅ Emotion Analysis & Mood Tracking
              </li>
              <li ref={(el) => (listRefs.current[1] = el)}>
                ✅ Multi-Modal Communication (Text & Voice)
              </li>
              <li ref={(el) => (listRefs.current[2] = el)}>
                ✅ Personalized Self-Care Tips
              </li>
              <li ref={(el) => (listRefs.current[3] = el)}>
                ✅ Positive Reinforcement & Encouragement
              </li>
              <li ref={(el) => (listRefs.current[4] = el)}>
                ✅ Data-Driven Insights for Mental Well-being
              </li>
            </ul>
          </div>


          <div
            ref={videoRef}
            className="h-[500px] flex items-center justify-center p-6"
          >
            <video
              src={video}
              alt="Serenity AI Chatbot"
              className="object-cover w-full h-full rounded-lg shadow-lg"
              autoPlay
              loop
              muted
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;