# Awesome Intelligence AI - Setup Guide

## 🚀 Quick Start

This project consists of a frontend (HTML/CSS/JS) and a backend (Node.js/Express) that integrates with GitHub Copilot API to provide AI-powered chat functionality.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **GitHub Account** with Copilot access
- **GitHub Token** with Copilot API access

## 🔑 Getting Your GitHub Token

1. Go to [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it a descriptive name (e.g., "Chat AI Copilot")
4. Select the following scopes:
   - `copilot` - Required for Copilot API access
5. Click "Generate token"
6. **Copy the token immediately** (you won't be able to see it again!)

## 📦 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Hack-And-Slash13/AI-repository.git
cd AI-repository
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file and add your GitHub token
# Open .env in your text editor and replace 'your_github_token_here' with your actual token
nano .env  # or use your preferred editor
```

Your `.env` file should look like:
```
API_TOKEN=your_token_here
PORT=3000
```

### Step 3: Start the Backend Server

```bash
# From the backend directory
npm start

# For development with auto-reload:
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3000
📝 Make sure GITHUB_TOKEN is set in your .env file
```

### Step 4: Access the Frontend

1. Open your web browser
2. Navigate to: `http://localhost:3000`
3. Start chatting with your AI!

## 📁 Project Structure

```
Awesome-Intelligence-AI/
├── backend/
│   ├── server.js          # Main Express server
│   ├── package.json       # Backend dependencies
│   ├── .env.env           # Environment variables
|
├── frontend/
│   ├── index.html         # Main HTML file with customization comments
│   ├── styles.css         # CSS styling with customization options
│   └── app.js             # JavaScript functionality with comments
└── README.md              # Project documentation
```

## 🎨 Customizing the Frontend

All frontend files include detailed comments showing where and how to customize:

### HTML (`frontend/index.html`)
- **App Title & Branding**: Lines with `CUSTOMIZATION:` comments
- **Header Section**: Edit logo, app name, and tagline
- **Welcome Message**: Customize greeting and suggestions
- **Suggestion Chips**: Add/modify quick action buttons
- **Input Placeholder**: Change the message input text

### CSS (`frontend/styles.css`)
- **Color Scheme**: Edit CSS variables at the top (`:root`)
- **Fonts**: Change `--font-primary` variable
- **Message Bubbles**: Modify colors and styling
- **Responsive Design**: Adjust breakpoints for mobile

### JavaScript (`frontend/app.js`)
- **API Endpoint**: Change `API_BASE_URL` if needed
- **Message Display**: Customize how messages appear
- **Add Features**: Voice input, export chat, reactions, etc.

## 🔧 Configuration Options

### Backend Configuration

Edit `backend/server.js` to customize:
- **Port**: Change `PORT` in `.env` file
- **Conversation History Limit**: Modify the history slice (default: 20 messages)
- **AI Model**: Change the model parameter in the API call
- **Temperature**: Adjust AI creativity (0.0 - 1.0)
- **Max Tokens**: Set response length limit

### GitHub Copilot API Parameters

```javascript
{
    messages: history,
    model: 'gpt-4',        // Model to use
    temperature: 0.7,      // Creativity (0.0 = focused, 1.0 = creative)
    max_tokens: 1000,      // Maximum response length
    stream: false          // Set to true for streaming responses
}
```

## 🌐 API Endpoints

### POST `/api/chat`
Send a message to the AI
```json
{
  "message": "Your message here",
  "conversationId": "optional_session_id"
}
```

### DELETE `/api/chat/:conversationId`
Clear conversation history for a specific session

### GET `/api/health`
Check server status

## 🐛 Troubleshooting

### "Invalid GitHub token" Error
- Ensure your token has the `copilot` scope
- Verify the token is correctly set in `.env`
- Check that you have GitHub Copilot access on your account

### Server Won't Start
- Check if port 3000 is already in use
- Try changing the PORT in `.env` file
- Ensure all dependencies are installed (`npm install`)

### Frontend Can't Connect to Backend
- Verify the backend server is running
- Check the `API_BASE_URL` in `frontend/app.js`
- Look for CORS errors in browser console

### Rate Limit Exceeded
- GitHub Copilot API has rate limits
- Wait a few minutes before trying again
- Consider implementing request queuing

## 🚀 Deployment

### Deploy Backend (e.g., Heroku, Railway, Render)

1. Add your `GITHUB_TOKEN` as an environment variable in your hosting platform
2. Ensure `PORT` is read from environment (already configured)
3. Deploy the `backend` directory

### Deploy Frontend (e.g., Netlify, Vercel)

1. Update `API_BASE_URL` in `app.js` to your deployed backend URL
2. Deploy the `frontend` directory

## 📝 Development Tips

### Running in Development Mode

```bash
# Terminal 1: Backend with auto-reload
cd backend
npm run dev

# Terminal 2: Frontend with live server (if using VS Code)
# Right-click index.html > Open with Live Server
```

### Adding New Features

1. **Voice Input**: Uncomment the voice input functions in `app.js`
2. **Export Chat**: Use the `exportConversation()` function
3. **Message Reactions**: Add reaction buttons to messages
4. **Markdown Support**: Integrate a markdown parser library

## 🔐 Security Notes

- Never commit your `.env` file to version control
- Keep your GitHub token secure
- Use environment variables for all sensitive data
- Consider adding rate limiting for production use
- Implement user authentication for multi-user deployments

## 📚 Additional Resources

- [GitHub Copilot API Documentation](https://docs.github.com/en/copilot)
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## 📄 License

MIT License - See LICENSE file for details

---

## 🎯 Next Steps

After setup, you can:
1. Customize the UI colors and branding
2. Add your own logo
3. Modify welcome messages and suggestions
4. Implement additional features (voice, export, etc.)
5. Deploy to production

Need help? Check the comments in the code files for detailed customization instructions!
