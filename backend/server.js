import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); // Load API key from .env

const app = express();
const PORT = 3000; // Must match the frontend request URL

app.use(express.json()); // Parse JSON requests
app.use(cors()); // Allow frontend to access backend

const API_KEY = process.env.API_KEY; // Store API key in .env
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure.";

        res.json({ reply: botReply });
    } catch (error) {
        console.error('Request Error:', error.message);
        res.status(500).json({ reply: "Sorry, something went wrong!" });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
