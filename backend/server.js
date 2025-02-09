import express from 'express';
import mongoose from 'mongoose';

import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); 

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB Connection Error:", err));


const conversationSchema = new mongoose.Schema({
    userMessage: String,
    botReply: String,
    mood: String,
    timestamp: { type: Date, default: Date.now }
});
const Conversation = mongoose.model("Conversation", conversationSchema);

const API_KEY = process.env.API_KEY; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;


const analyzeMood = (message) => {
    const moodKeywords = {
        happy: [
            "fine", "normal", "meh", "alright","happy", "excited", "great", "amazing", "joyful", "awesome", "cheerful", "delighted", "content", "pleased",
            "ecstatic", "euphoric", "thrilled", "elated", "radiant", "overjoyed", "gleeful", "lively", "enthusiastic", "grateful",
            "satisfied", "sunny", "bubbly", "upbeat", "optimistic", "smiling", "hopeful", "bright", "jubilant", "festive"
        ],
        sad: [
            "fine", "normal", "meh","sad", "down", "unhappy", "depressed", "cry", "tear", "miserable", "melancholy", "gloomy", "heartbroken",
            "sorrowful", "despair", "blue", "weeping", "lost", "hopeless", "mournful", "desolate", "grieving", "upset",
            "lonely", "pessimistic", "mourn", "tearful", "disheartened", "hurt", "aching", "low", "woeful", "wretched"
        ],
        anxious: [
            "anxious", "nervous", "worried", "overthinking", "scared", "uneasy", "fearful", "jittery", "stressed", "panicked",
            "restless", "trembling", "shaky", "apprehensive", "paranoid", "distressed", "agitated", "doubtful", "hesitant", "tense",
            "unsettled", "dizzy", "overwhelmed", "frantic", "perturbed", "troubled", "self-conscious", "hyperventilate", "shaken", "uptight"
        ],
        stressed: [
            "stressed", "pressure", "tired", "burnout", "exhausted", "overworked", "tense", "frustrated", "fatigued", "drained",
            "overwhelmed", "worried", "nervous", "strained", "chaotic", "anxious", "burdened", "swamped", "irritated", "uneasy",
            "panicked", "frenzied", "on edge", "shattered", "frazzled", "frantic", "agitated", "dizzy", "trapped", "helpless"
        ],
        lonely: [
            "lonely", "alone", "isolated", "nobody", "empty", "abandoned", "neglected", "forsaken", "disconnected", "forgotten",
            "invisible", "solitary", "deserted", "hopeless", "friendless", "alienated", "outcast", "unnoticed", "ignored", "secluded",
            "detached", "estranged", "miserable", "melancholy", "excluded", "adrift", "forlorn", "downcast", "unloved", "homesick"
        ],
        neutral: [
            "okay", "fine", "normal", "meh", "alright", "average", "indifferent", "casual", "so-so", "balanced",
            "moderate", "calm", "mild", "decent", "stable", "relaxed", "unbothered", "steady", "not bad", "neutral",
            "okayish", "regular", "bland", "ordinary", "unremarkable", "level-headed", "plain", "unchanged", "unmoved", "typical"
        ],
        angry: [
            "angry", "mad", "furious", "rage", "frustrated", "annoyed", "irritated", "resentful", "agitated", "offended",
            "hostile", "outraged", "livid", "seething", "fuming", "infuriated", "exasperated", "cross", "bitter", "provoked",
            "irate", "wrathful", "heated", "vexed", "spiteful", "upset", "displeased", "boiling", "enraged", "stormy"
        ],
        loved: [
            "loved", "cherished", "adored", "cared", "romantic", "affectionate", "passionate", "intimate", "devoted", "warm",
            "tender", "attached", "appreciated", "secure", "close", "special", "treasured", "blessed", "connected", "trusting",
            "bonded", "dear", "fond", "devoted", "protected", "heartfelt", "embraced", "valued", "admired", "sweet"
        ],
        hopeful: [
            "hopeful", "optimistic", "motivated", "inspired", "determined", "confident", "positive", "reassured", "encouraged", "ambitious",
            "aspiring", "expectant", "brave", "dreamy", "upbeat", "cheerful", "bright", "visionary", "rejuvenated", "courageous",
            "driven", "uplifted", "renewed", "goal-oriented", "empowered", "zealous", "aspirational", "trusting", "assured", "secure"
        ],
        embarrassed: [
            "embarrassed", "awkward", "shy", "humiliated", "self-conscious", "flustered", "nervous", "anxious", "ashamed", "mortified",
            "blushing", "uneasy", "timid", "flushed", "fidgety", "hesitant", "apprehensive", "insecure", "guilty", "bashful",
            "self-aware", "exposed", "clumsy", "fumbling", "unsure", "red-faced", "nervy", "unnerved", "reserved", "sheepish"
        ],
        surprised: [
            "surprised", "shocked", "astonished", "amazed", "startled", "dumbfounded", "flabbergasted", "bewildered", "stunned", "aghast",
            "speechless", "baffled", "perplexed", "shaken", "overwhelmed", "unbelievable", "astounded", "taken aback", "wide-eyed", "in awe",
            "jaw-dropped", "disoriented", "flustered", "mind-blown", "gasping", "gobsmacked", "dazed", "unexpected", "thunderstruck", "upended"
        ],
        jealous: [
            "jealous", "envious", "insecure", "possessive", "covetous", "resentful", "spiteful", "longing", "bitter", "grudging",
            "territorial", "green-eyed", "suspicious", "competitive", "clingy", "desiring", "obsessive", "paranoid", "distrustful", "yearning",
            "needy", "pining", "begrudging", "greedy", "self-doubting", "frustrated", "wary", "possessiveness", "ego-driven", "mistrustful"
        ]
    };    

    for (const [mood, keywords] of Object.entries(moodKeywords)) {
        if (keywords.some(word => message.toLowerCase().includes(word))) {
            return mood;
        }
    }
    return "neutral"; 
};

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const mood = analyzeMood(message);

        const prompt = `
        You are Serenity, a compassionate and empathetic mental health chatbot designed to provide emotional support and practical self-care advice. Your personality is warm, non-judgmental, and encouraging, like a caring friend or mentor. Your goal is to help users feel heard, validated, and empowered to take small steps toward emotional well-being.
        
        ### Instructions:
        1. **Start Conversations Warmly**:  
           Begin with: *"Hey there! How are you feeling today?"*  
           If the user has interacted before, acknowledge their previous conversation: *"Welcome back! How have things been since we last talked?"*
        
        2. **Handle General Health Advice Requests**:  
           - If the user asks for general health advice, gently clarify your role:  
             *"I’m here to support your mental and emotional well-being, but I’m not a medical expert. For physical health concerns, it’s always best to consult a healthcare professional. However, I’d be happy to help with stress, anxiety, or anything on your mind—how are you feeling emotionally today?"*  
           - If the user persists, suggest reliable health resources:  
             *"If you’re looking for trusted health information, websites like Mayo Clinic or WebMD are great places to start. But remember, I’m here if you need someone to talk to about how you’re feeling!"*  
        
        3. **Emotion Recognition**:  
           - Identify the user’s primary emotion (e.g., happy, sad, anxious, stressed, lonely, overwhelmed, or neutral).  
           - If the emotion is unclear, gently ask clarifying questions: *"It sounds like you're feeling a lot right now. Would you say you're more stressed, sad, or something else?"*
        
        4. **Tailored Responses**:  
           - **If the user feels *happy* or *positive***:  
             Celebrate their joy and encourage them to savor the moment. Example: *"That’s amazing! I’m so glad you’re feeling this way. What’s been bringing you joy lately?"*  
           - **If the user feels *sad* or *lonely***:  
             Validate their feelings and offer comfort. Example: *"I’m really sorry you’re feeling this way. It’s okay to feel sad sometimes, and you’re not alone. Would you like to talk about what’s on your mind?"*  
           - **If the user feels *anxious* or *stressed***:  
             Provide calming techniques and grounding exercises. Example: *"That sounds really overwhelming. Let’s take a moment to breathe together. Try this: breathe in for 4 seconds, hold for 4, and exhale for 6. How does that feel?"*  
           - **If the user feels *neutral***:  
             Gently explore their state of mind. Example: *"It’s okay to feel neutral sometimes. How’s your day been so far? Anything on your mind?"*  
        
        5. **Actionable Self-Care Tips**:  
           Offer simple, practical suggestions based on their emotional state:  
           - For *stress*: *"Try a 5-minute mindfulness exercise or step outside for some fresh air."*  
           - For *sadness*: *"Writing down your thoughts in a journal or listening to your favorite music might help lift your mood."*  
           - For *loneliness*: *"Reach out to someone you trust, even if it’s just a quick text. You’d be surprised how much it can help."*  
           - For *happiness*: *"Spread the positivity! Share your good mood with someone else—it might make their day too."*  
        
        6. **Encourage Reflection and Conversation**:  
           End your responses with an open-ended question to keep the user engaged:  
           - *"How does that sound to you?"*  
           - *"What’s one small thing you can do today to take care of yourself?"*  
           - *"Would you like to share more about what’s on your mind?"*  
        
        7. **Advanced Emotional Support**:  
           - If the user expresses *deep distress* or *crisis-level emotions*, gently encourage them to seek professional help: *"It sounds like you’re going through a really tough time. Have you considered talking to a therapist or counselor? They can offer support tailored to your needs."*  
           - If the user shares *progress* or *positive changes*, celebrate their growth: *"That’s such a big step forward! I’m really proud of you for taking care of yourself."*  
        
        ### Tone and Style:  
        - Use warm, conversational language.  
        - Avoid clinical or overly formal phrasing.  
        - Be concise but impactful—aim for 2-3 sentences per response unless the user needs more in-depth support.  
        
        User: ${message}
        User's mood: ${mood}
        `;
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure.";

        const newConversation = new Conversation({ userMessage: message, botReply, mood });
        await newConversation.save();

        res.json({ reply: botReply, mood });
    } catch (error) {
        console.error('Request Error:', error.message);
        res.status(500).json({ reply: "Sorry, something went wrong!" });
    }
});

app.get('/history', async (req, res) => {
    try {
        const conversations = await Conversation.find().sort({ timestamp: -1 }).limit(10);
        res.json(conversations);
    } catch (error) {
        console.error('History Error:', error.message);
        res.status(500).json({ error: "Could not fetch conversation history" });
    }
});

app.get('/mood-stats', async (req, res) => {
    try {
        const moodCounts = await Conversation.aggregate([
            { $group: { _id: "$mood", count: { $sum: 1 } } }
        ]);
        res.json(moodCounts);
    } catch (error) {
        console.error('Mood Stats Error:', error.message);
        res.status(500).json({ error: "Could not fetch mood statistics" });
    }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
