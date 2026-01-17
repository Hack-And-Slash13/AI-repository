const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));

// Store conversation history (in production, use a database)
const conversationHistory = new Map();

/**
 * GitHub Models API Integration
 * This endpoint handles chat requests and forwards them to GitHub Models
 * Uses Azure AI for various models: GPT-4o, Llama, Mistral, etc.
 */
app.post('/api/chat', async (req, res) => {
    try {
        const { message, conversationId } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Get or create conversation history
        const sessionId = conversationId || generateSessionId();
        let history = conversationHistory.get(sessionId) || [];

        // Add user message to history
        history.push({
            role: 'user',
            content: message
        });

        // GitHub Models API call (Free for development)
        // Get your token from: https://github.com/settings/tokens (select 'Models' scope)
        const messages = history.map(msg => ({
            role: msg.role,
            content: msg.content
        }));
        
        const response = await axios.post(
            'https://models.inference.ai.azure.com/chat/completions',
            {
                messages: messages,
                model: 'gpt-4o-mini', // Options: gpt-4o, gpt-4o-mini, llama-3.1-70b-instruct, mistral-large
                temperature: 0.7,
                max_tokens: 500
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        const aiMessage = response.data.choices[0].message.content.trim();

        // Add AI response to history
        history.push({
            role: 'assistant',
            content: aiMessage
        });

        // Store updated history (limit to last 20 messages)
        if (history.length > 20) {
            history = history.slice(-20);
        }
        conversationHistory.set(sessionId, history);

        res.json({
            message: aiMessage,
            conversationId: sessionId
        });

    } catch (error) {
        console.error('Error calling GitHub Models API:', error.response?.data || error.message);
        
        // Handle specific error cases
        if (error.response?.status === 401) {
            return res.status(401).json({ 
                error: 'Invalid GitHub token. Please check your GITHUB_TOKEN in .env file.' 
            });
        }
        
        if (error.response?.status === 429) {
            return res.status(429).json({ 
                error: 'Rate limit exceeded. Please try again later.' 
            });
        }

        res.status(500).json({ 
            error: 'Failed to get response from AI',
            details: error.message 
        });
    }
});

/**
 * Clear conversation history
 */
app.delete('/api/chat/:conversationId', (req, res) => {
    const { conversationId } = req.params;
    
    if (conversationHistory.has(conversationId)) {
        conversationHistory.delete(conversationId);
        res.json({ message: 'Conversation cleared' });
    } else {
        res.status(404).json({ error: 'Conversation not found' });
    }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString(),
        activeConversations: conversationHistory.size
    });
});

/**
 * Generate a unique session ID
 */
function generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Make sure GITHUB_TOKEN is set in your .env file`);
    console.log(`🔗 Get token at: https://github.com/settings/tokens (enable 'Models' scope)`);
});

// Cleanup old conversations every hour
setInterval(() => {
    const oneHourAgo = Date.now() - 3600000;
    for (const [sessionId] of conversationHistory) {
        const timestamp = parseInt(sessionId.split('_')[1]);
        if (timestamp < oneHourAgo) {
            conversationHistory.delete(sessionId);
        }
    }
}, 3600000);
