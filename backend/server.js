// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Warn if tokens are missing
if (!GITHUB_TOKEN) console.warn('⚠️ GITHUB_TOKEN not set.');
if (!OPENAI_API_KEY) console.warn('⚠️ OPENAI_API_KEY not set. Image generation will not work.');

// Middleware
app.use(cors());
app.use(express.json());

// ==============================
// STATIC FILES (frontend)
// ==============================
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// ==============================
// CHAT ENDPOINT
// ==============================
const conversationHistory = new Map();
function generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

app.post('/api/chat', async (req, res) => {
    try {
        const { message, conversationId } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });

        const sessionId = conversationId || generateSessionId();
        let history = conversationHistory.get(sessionId) || [];
        history.push({ role: 'user', content: message });

        const messages = history.map(msg => ({ role: msg.role, content: msg.content }));

        if (!GITHUB_TOKEN) return res.status(500).json({ error: 'GITHUB_TOKEN not set. Cannot call AI API.' });

        const response = await axios.post(
            'https://models.inference.ai.azure.com/chat/completions',
            { messages, model: 'gpt-4o-mini', temperature: 0.7, max_tokens: 500 },
            { headers: { 'Authorization': `Bearer ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' }, timeout: 30000 }
        );

        const aiMessage = response.data.choices?.[0]?.message?.content?.trim() || 'No response';
        history.push({ role: 'assistant', content: aiMessage });

        if (history.length > 20) history = history.slice(-20);
        conversationHistory.set(sessionId, history);

        res.json({ message: aiMessage, conversationId: sessionId });

    } catch (error) {
        console.error('Error calling AI API:', error.response?.data || error.message);
        if (error.response?.status === 401) return res.status(401).json({ error: 'Invalid GitHub token.' });
        if (error.response?.status === 429) return res.status(429).json({ error: 'Rate limit exceeded.' });
        res.status(500).json({ error: 'Failed to get response from AI', details: error.message });
    }
});

// ==============================
// IMAGE ENDPOINT
// ==============================
app.post('/image/create', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: 'Prompt is required' });
        if (!OPENAI_API_KEY) return res.status(500).json({ error: 'OPENAI_API_KEY not set.' });

        const response = await axios.post(
            'https://api.openai.com/v1/images/generations',
            { prompt, n: 1, size: '1024x1024' },
            { headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' } }
        );

        const imageUrl = response.data.data?.[0]?.url;
        if (!imageUrl) throw new Error('No image returned');

        res.json({ imageUrl });

    } catch (err) {
        console.error('Image generation error:', err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to generate image', details: err.message });
    }
});

// ==============================
// CLEAR CONVERSATION
// ==============================
app.delete('/api/chat/:conversationId', (req, res) => {
    const { conversationId } = req.params;
    if (conversationHistory.has(conversationId)) {
        conversationHistory.delete(conversationId);
        res.json({ message: 'Conversation cleared' });
    } else {
        res.status(404).json({ error: 'Conversation not found' });
    }
});

// ==============================
// HEALTH CHECK
// ==============================
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), activeConversations: conversationHistory.size });
});

// ==============================
// CLEANUP OLD CONVERSATIONS
// ==============================
setInterval(() => {
    const oneHourAgo = Date.now() - 3600000;
    for (const [sessionId] of conversationHistory) {
        const timestamp = parseInt(sessionId.split('_')[1]);
        if (timestamp < oneHourAgo) conversationHistory.delete(sessionId);
    }
}, 3600000);

// ==============================
// START SERVER
// ==============================
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 GITHUB_TOKEN is ${GITHUB_TOKEN ? 'SET' : 'NOT SET'}`);
    console.log(`🖼 OPENAI_API_KEY is ${OPENAI_API_KEY ? 'SET' : 'NOT SET'}`);
});
