# Awesome Intelligence AI

Welcome! I have been wanting to do this project for a while. We are going to call it "Awesome Intelligence AI" - a conversational AI assistant built to provide intelligent, context-aware responses and interactions, powered by **GitHub Models API**.

## Overview

This project implements a modern chat-based AI system with a beautiful web interface and robust backend. The AI leverages GitHub Models (including GPT-4o, Llama 3.1, and Mistral) to deliver helpful, accurate, and engaging conversations in real-time. More updates and features will be added later, but right now we are making a simple AI chatbot.

## ✨ Features

- **GitHub Models Integration**: Powered by multiple AI models (GPT-4o, Llama 3.1, Mistral)
- **Modern Web Interface**: Clean, responsive design that works on all devices
- **Real-time Chat**: Fast and fluid conversation experience
- **Context-Aware**: Maintains conversation history for relevant responses
- **Highly Customizable**: Extensive comments throughout code for easy customization
- **RESTful API**: Well-structured backend with Express.js
- **Session Management**: Automatic conversation tracking and cleanup
- **Error Handling**: Graceful error messages and recovery

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** package manager
- **GitHub Account**
- **GitHub Personal Access Token** with `Models` scope

### Installation

```bash
# Clone the repository
git clone https://github.com/Hack-And-Slash13/AI-repository.git
cd AI-repository

# Install backend dependencies
cd backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env and add your GITHUB_TOKEN

# Start the server
npm start
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

### Or...
### The easy way:

Go to https://ai-awesome-intelligence.onrender.com/ and chat with the Awesome Intelligence AI!


## 📁 Project Structure

```
AI-repository/
├── backend/
│   ├── server.js          # Express server with Copilot API integration
│   ├── package.json       # Backend dependencies
│   └── .env.example       # Environment variables template
├── frontend/
│   ├── index.html         # Main HTML (heavily commented for customization)
│   ├── styles.css         # CSS styling (fully customizable)
│   └── app.js             # JavaScript functionality (with customization guides)
├── SETUP.md               # Detailed setup instructions
└── README.md              # This file
```

## 🎨 Customization Guide

All frontend files include detailed comments marking customization points. Look for `CUSTOMIZATION:` comments throughout the code.

### Key Customization Areas:

#### **HTML** ([frontend/index.html](frontend/index.html))
- App title and branding
- Welcome messages and suggestions
- Header buttons and actions
- Suggestion chips content

#### **CSS** ([frontend/styles.css](frontend/styles.css))
- Color scheme (CSS variables in `:root`)
- Font families and sizes
- Message bubble styling
- Responsive breakpoints

#### **JavaScript** ([frontend/app.js](frontend/app.js))
- API endpoint configuration
- Message display format
- Timestamp format
- Additional features (voice input, export, etc.)

For detailed customization instructions, see the comments in each file and read [SETUP.md](SETUP.md).

## 🔧 Configuration

### Backend Configuration

Edit `backend/server.js` to customize:
- AI model selection
- Temperature (creativity level)
- Max tokens (response length)
- Conversation history limit

### Environment Variables

Create `backend/.env` from `.env.example`:
```env
GITHUB_TOKEN=your_github_token_here
PORT=3000
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send message to AI |
| DELETE | `/api/chat/:id` | Clear conversation |
| GET | `/api/health` | Server health check |

## 📖 Documentation

- **[SETUP.md](SETUP.md)** - Detailed setup and configuration guide
- **Code Comments** - Extensive inline documentation for customization

## Roadmap

### ✅ Completed
- [x] Modern web interface
- [x] GitHub Copilot integration
- [x] Session management
- [x] Responsive design
- [x] Comprehensive customization options

### 🚧 Future Enhancements

- [ ] Multi-language support
- [ ] Voice input/output capabilities
- [ ] Integration with external APIs and services
- [ ] Custom personality and tone customization
- [ ] Chat history and session management
- [ ] Advanced context retention across sessions
- [ ] Plugin system for extensibility
- [ ] Web interface for easier access
- [ ] Mobile application support
- [ ] Enhanced security and privacy features

## Contributing

Contributions are welcome! Feel free to submit issues, feature requests, or pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with modern AI/ML frameworks
- Inspired by the need for accessible conversational AI

## Status

**Current Status**: In Development 🚧

This project is actively being developed. Features and functionality may change as development progresses.

---

*Note: This project is continuously evolving. Additional features, improvements, and capabilities will be added over time based on user needs and technological advancements.*
