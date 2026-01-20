// ============================================
// CONFIGURATION
// CUSTOMIZATION: Change API endpoint if needed
// ============================================

const API_BASE_URL = 'https://ai-awesome-intelligence-fhhn.onrender.com/';

// ============================================
// STATE MANAGEMENT
// ============================================

let conversationId = null;
let isWaitingForResponse = false;

// ============================================
// DOM ELEMENTS
// ============================================

const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const typingIndicator = document.getElementById('typingIndicator');
const clearChatBtn = document.getElementById('clearChatBtn');
const errorToast = document.getElementById('errorToast');
const errorMessage = document.getElementById('errorMessage');

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    autoResizeTextarea();
});

// ============================================
// EVENT LISTENERS
// ============================================

function initializeEventListeners() {
    // Form submission
    chatForm.addEventListener('submit', handleSubmit);
    
    // Auto-resize textarea as user types
    messageInput.addEventListener('input', autoResizeTextarea);
    
    // Handle Enter key (send) vs Shift+Enter (new line)
    messageInput.addEventListener('keydown', handleKeyDown);
    
    // Clear chat button
    clearChatBtn.addEventListener('click', handleClearChat);
    
    // Suggestion chips
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const suggestion = chip.getAttribute('data-suggestion');
            messageInput.value = suggestion;
            messageInput.focus();
            autoResizeTextarea();
        });
    });
}

// ============================================
// FORM SUBMISSION HANDLER
// ============================================

async function handleSubmit(e) {
    e.preventDefault();
    
    const message = messageInput.value.trim();
    
    if (!message || isWaitingForResponse) {
        return;
    }
    
    // Clear input and reset height
    messageInput.value = '';
    messageInput.style.height = 'auto';
    
    // Remove welcome section if it exists
    const welcomeSection = document.querySelector('.welcome-section');
    if (welcomeSection) {
        welcomeSection.remove();
    }
    
    // Add user message to chat
    addMessage(message, 'user');
    
    // Show typing indicator
    showTypingIndicator();
    
    // Disable send button
    isWaitingForResponse = true;
    sendButton.disabled = true;
    
    try {
        // Send message to backend
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                conversationId: conversationId
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to get response');
        }
        
        // Store conversation ID for context
        conversationId = data.conversationId;
        
        // Hide typing indicator
        hideTypingIndicator();
        
        // Add AI response to chat
        addMessage(data.message, 'ai');
        
    } catch (error) {
        console.error('Error:', error);
        hideTypingIndicator();
        showError(error.message);
    } finally {
        // Re-enable send button
        isWaitingForResponse = false;
        sendButton.disabled = false;
        messageInput.focus();
    }
}

// ============================================
// MESSAGE DISPLAY
// CUSTOMIZATION: Modify how messages are displayed
// ============================================

function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    // Create avatar
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = type === 'user' ? 'You' : 'AI';
    
    // ============================================
    // CUSTOMIZATION: Change avatar text or add images
    // Example: avatar.innerHTML = '<img src="avatar.png" />';
    // ============================================
    
    // Create message content
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const messageText = document.createElement('p');
    messageText.className = 'message-text';
    messageText.textContent = text;
    
    // ============================================
    // CUSTOMIZATION: Add markdown rendering or syntax highlighting
    // Example: messageText.innerHTML = markdownToHtml(text);
    // ============================================
    
    // Create timestamp
    const timestamp = document.createElement('div');
    timestamp.className = 'message-timestamp';
    timestamp.textContent = formatTime(new Date());
    
    // ============================================
    // CUSTOMIZATION: Change timestamp format
    // Example: timestamp.textContent = new Date().toLocaleTimeString();
    // ============================================
    
    content.appendChild(messageText);
    content.appendChild(timestamp);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    scrollToBottom();
}

// ============================================
// TYPING INDICATOR
// ============================================

function showTypingIndicator() {
    typingIndicator.style.display = 'flex';
    scrollToBottom();
}

function hideTypingIndicator() {
    typingIndicator.style.display = 'none';
}

// ============================================
// CLEAR CHAT
// ============================================

async function handleClearChat() {
    // ============================================
    // CUSTOMIZATION: Add confirmation dialog
    // ============================================
    
    const confirmed = confirm('Are you sure you want to clear the conversation?');
    
    if (!confirmed) {
        return;
    }
    
    try {
        if (conversationId) {
            // Clear conversation on backend
            await fetch(`${API_BASE_URL}/chat/${conversationId}`, {
                method: 'DELETE'
            });
        }
        
        // Clear local state
        conversationId = null;
        
        // Clear messages
        chatMessages.innerHTML = '';
        
        // Show welcome message again
        location.reload();
        
    } catch (error) {
        console.error('Error clearing chat:', error);
        showError('Failed to clear conversation');
    }
}

// ============================================
// TEXTAREA AUTO-RESIZE
// ============================================

function autoResizeTextarea() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 150) + 'px';
}

// ============================================
// KEYBOARD HANDLING
// ============================================

function handleKeyDown(e) {
    // Enter without Shift = Submit
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
    }
    // Shift + Enter = New line (default behavior)
}

// ============================================
// ERROR HANDLING
// CUSTOMIZATION: Modify error display behavior
// ============================================

function showError(message) {
    errorMessage.textContent = message;
    errorToast.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorToast.classList.remove('show');
    }, 5000);
    
    // ============================================
    // CUSTOMIZATION: Add different error types or styling
    // Example: errorToast.classList.add('error-type-warning');
    // ============================================
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// ============================================
// CUSTOMIZATION: Add your own utility functions
// Examples:
// - Markdown rendering
// - Code syntax highlighting
// - Message reactions/likes
// - Copy message to clipboard
// - Export conversation
// - Voice input/output
// ============================================

// Example: Copy message to clipboard
function copyMessageToClipboard(messageElement) {
    const text = messageElement.querySelector('.message-text').textContent;
    navigator.clipboard.writeText(text).then(() => {
        console.log('Message copied to clipboard');
    });
}

// Example: Export conversation as JSON
function exportConversation() {
    const messages = [];
    document.querySelectorAll('.message').forEach(msg => {
        const type = msg.classList.contains('user') ? 'user' : 'ai';
        const text = msg.querySelector('.message-text').textContent;
        messages.push({ type, text });
    });
    
    const dataStr = JSON.stringify(messages, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-export-${Date.now()}.json`;
    link.click();
}

// ============================================
// ADVANCED FEATURES TO ADD (OPTIONAL)
// ============================================

/*
// Feature: Message Reactions
function addReactionButtons(messageElement) {
    const reactions = ['👍', '❤️', '😊', '🤔'];
    const reactionContainer = document.createElement('div');
    reactionContainer.className = 'reaction-buttons';
    
    reactions.forEach(emoji => {
        const btn = document.createElement('button');
        btn.textContent = emoji;
        btn.addEventListener('click', () => {
            console.log(`Reacted with ${emoji}`);
        });
        reactionContainer.appendChild(btn);
    });
    
    messageElement.appendChild(reactionContainer);
}

// Feature: Voice Input
async function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window)) {
        showError('Voice input not supported in this browser');
        return;
    }
    
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        messageInput.value = transcript;
    };
    
    recognition.onerror = (event) => {
        showError('Voice recognition error: ' + event.error);
    };
    
    recognition.start();
}

// Feature: Text-to-Speech for AI responses
function speakMessage(text) {
    if (!('speechSynthesis' in window)) {
        showError('Text-to-speech not supported');
        return;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    speechSynthesis.speak(utterance);
}
*/
