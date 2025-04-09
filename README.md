# Simple Chatbot UI

A simple chatbot UI built with React that renders HTML responses from a server.

## Project Structure

```
bot-ui-poc/
├── client/             # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── ChatBot.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── server/             # Express backend
│   ├── server.js
│   └── package.json
└── README.md
```

## Features

- Modern UI with styled components
- Real-time chat interface
- Server responds with HTML content
- Echo server that returns user messages with timestamps

## Setup Instructions

### Server Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```
   The server will run on port 5000.

### Client Setup

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the React development server:
   ```
   npm start
   ```
   The client will run on port 3000.

## How It Works

1. The user types a message in the chat input
2. The message is sent to the server via an AJAX call
3. The server processes the message and returns an HTML response
4. The client renders the HTML response in the chat interface

## Technologies Used

- React
- Express
- Axios
- Styled Components
