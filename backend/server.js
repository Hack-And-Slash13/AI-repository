// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Warn if GitHub token is missing
if (!GITHUB_TOKEN) {
    console.warn('⚠️ WARNING: GITHUB_TOKEN is not set! Set it in Render dashboard or .env file.');
    console.warn('🔗 Get token at: https://github.com/settings/tokens (enable "Models" scope)');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Conversation storage
const conversationHistory = new Map();

// Generate unique session IDs
function generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, conversationId } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const sessionId = conversationId || generateSessionId();
        let history = conversationHistory.get(sessionId) || [];

        history.push({ role: 'user', content: message });

        // Prepare messages for AI
        const messages = history.map(msg => ({ role: msg.role, content: msg.content }));

        if (!GITHUB_TOKEN) {
            return res.status(500).json({ error: 'GITHUB_TOKEN not set. Cannot call AI API.' });
        }

        // Call the AI API
        const response = await axios.post(
            'https://models.inference.ai.azure.com/chat/completions',
            {
                messages,
                model: 'gpt-4o-mini',
                temperature: 0.7,
                max_tokens: 500
            },
            {
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        const aiMessage = response.data.choices?.[0]?.message?.content?.trim() || 'No response';

        history.push({ role: 'assistant', content: aiMessage });

        // Keep last 20 messages
        if (history.length > 20) history = history.slice(-20);
        conversationHistory.set(sessionId, history);

        res.json({ message: aiMessage, conversationId: sessionId });

    } catch (error) {
        console.error('Error calling AI API:', error.response?.data || error.message);

        if (error.response?.status === 401) {
            return res.status(401).json({ error: 'Invalid GitHub token.' });
        }

        if (error.response?.status === 429) {
            return res.status(429).json({ error: 'Rate limit exceeded.' });
        }

        res.status(500).json({ error: 'Failed to get response from AI', details: error.message });
    }
});

// Clear conversation
app.delete('/api/chat/:conversationId', (req, res) => {
    const { conversationId } = req.params;
    if (conversationHistory.has(conversationId)) {
        conversationHistory.delete(conversationId);
        res.json({ message: 'Conversation cleared' });
    } else {
        res.status(404).json({ error: 'Conversation not found' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        activeConversations: conversationHistory.size
    });
});

// Cleanup old conversations every hour
setInterval(() => {
    const oneHourAgo = Date.now() - 3600000;
    for (const [sessionId] of conversationHistory) {
        const timestamp = parseInt(sessionId.split('_')[1]);
        if (timestamp < oneHourAgo) conversationHistory.delete(sessionId);
    }
}, 3600000);

// Start server safely
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 GITHUB_TOKEN is ${GITHUB_TOKEN ? 'SET' : 'NOT SET'}`);
}).on('error', err => {
    console.error('Server failed to start:', err);
});
