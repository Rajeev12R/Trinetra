import React, { useState, useEffect, useCallback, useRef } from 'react';
import { gsap } from 'gsap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faCommentDots, faHeartPulse, faXmark } from '@fortawesome/free-solid-svg-icons';

const Chat = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const chatBoxRef = useRef(null); // Ref for the chat box element

  // GSAP animations on component mount
  useEffect(() => {
    gsap.to("#navbar", { duration: 1, opacity: 1, y: 0, ease: "power3.out" });
    gsap.to("#hero", { duration: 1, opacity: 1, scale: 1, ease: "power3.out", delay: 0.5 });
    gsap.to("#chatButton", { y: -5, repeat: -1, yoyo: true, duration: 1, ease: "power1.inOut" });
  }, []);

  // Toggle chat visibility
  const toggleChat = useCallback(() => {
    if (!chatOpen) {
      gsap.to("#chatContainer", { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
      setChatOpen(true);
    } else {
      gsap.to("#chatContainer", {
        opacity: 0, y: 10, duration: 0.3, ease: "power3.in", onComplete: () => setChatOpen(false)
      });
    }
  }, [chatOpen]);

  // Send message to the server
  const sendMessage = useCallback(async (message) => {
    if (!message.trim()) return;

    const newMessage = { text: message, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      setMessages((prevMessages) => [...prevMessages, { text: data.reply, sender: 'bot' }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [...prevMessages, { text: "Sorry, something went wrong!", sender: 'bot' }]);
    }
  }, []);

  // Handle Enter key press
  const handleKeyPress = useCallback((event) => {
    if (event.key === 'Enter') {
      sendMessage(inputValue);
      setInputValue('');
    }
  }, [inputValue, sendMessage]);

  // Start voice recognition
  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech Recognition is not supported in this browser.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      if (transcript) {
        sendMessage(transcript);
      } else {
        setMessages((prevMessages) => [...prevMessages, { text: "Sorry, I couldn't hear you clearly.", sender: 'bot' }]);
      }
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setMessages((prevMessages) => [...prevMessages, { text: "Voice recognition error!", sender: 'bot' }]);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [sendMessage]);

  // Stop voice recognition
  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  // Handle microphone key press (e.g., 'm' key)
  const handleMicKeyPress = useCallback((event) => {
    if (event.key === 'm' || event.key === 'M') {
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    }
  }, [isListening, startListening, stopListening]);

  // Add global keydown event listener for microphone
  useEffect(() => {
    document.addEventListener('keydown', handleMicKeyPress);
    return () => {
      document.removeEventListener('keydown', handleMicKeyPress);
    };
  }, [handleMicKeyPress]);

  // Handle predefined chat options
  const handlePredefinedMessage = useCallback((message) => {
    sendMessage(message);
  }, [sendMessage]);

  // Auto-scroll to the bottom of the chat box when messages change
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <button
        id="chatButton"
        onClick={toggleChat}
        className="fixed bottom-5 right-5 bg-teal-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-teal-500 text-lg flex items-center transition-all"
        aria-label="Toggle chat"
      >
        <FontAwesomeIcon icon={faCommentDots} className="mr-2" /> Chat with Serenity
      </button>

      <div
        id="chatContainer"
        className={`fixed bottom-20 right-5 max-w-[90vw] bg-white shadow-lg rounded-lg flex flex-col opacity-0 translate-y-10 ${chatOpen ? 'block' : 'hidden'}`}
        aria-live="polite"
      >
        <div className="flex justify-between items-center bg-teal-600 text-white p-3 rounded-t-lg">
          <div className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faHeartPulse} className="text-red-500" />
            <span>Serenity</span>
          </div>
          <button onClick={toggleChat} className="text-white" aria-label="Close chat">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div
          id="chatBox"
          ref={chatBoxRef} // Attach the ref to the chat box
          className="h-96 overflow-y-auto flex flex-col p-4 space-y-2 border-b border-gray-300"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-black'
                } p-3 rounded-lg shadow-md max-w-xs`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isListening && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-amber-700 p-2 rounded-lg italic text-sm">
                🎙️ Listening...
              </div>
            </div>
          )}
        </div>
        <div id="chatOptions" className="p-3 overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => handlePredefinedMessage('Hello! How are you feeling today?')}
            className="bg-teal-600 text-white px-3 py-1 rounded-md mr-2"
            aria-label="Send predefined message: Hello! How are you feeling today?"
          >
            Hello! How are you feeling today?
          </button>
          <button
            onClick={() => handlePredefinedMessage('What’s up? How is it going?')}
            className="bg-teal-600 text-white px-3 py-1 rounded-md mr-2"
            aria-label="Send predefined message: What’s up? How is it going?"
          >
            What’s up? How is it going?
          </button>
          <button
            onClick={() => handlePredefinedMessage('Give me some health advice today?')}
            className="bg-teal-600 text-white px-3 py-1 rounded-md"
            aria-label="Send predefined message: Give me some health advice today?"
          >
            Give me some health advice today?
          </button>
        </div>
        <div className="flex p-3 border-t border-gray-300">
          <input
            type="text"
            id="userInput"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 p-2 border border-gray-300 rounded-md outline-none"
            aria-label="Type a message"
          />
          <button
            onClick={() => {
              sendMessage(inputValue);
              setInputValue('');
            }}
            className="ml-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-md transition-all"
            aria-label="Send message"
          >
            Send
          </button>
          <button
            onClick={isListening ? stopListening : startListening}
            className={`ml-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-md transition-all ${
              isListening ? 'bg-red-500 hover:bg-red-600' : ''
            }`}
            aria-label={isListening ? "Stop listening" : "Start listening"}
            aria-pressed={isListening}
          >
            <FontAwesomeIcon icon={faMicrophone} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Chat;