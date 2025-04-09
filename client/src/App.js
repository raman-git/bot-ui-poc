import React from 'react';
import './App.css';
import ChatBot from './components/ChatBot';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <main>
        <ChatBot />
      </main>
      <footer>
        <p>© {new Date().getFullYear()} Chatbot UI Demo</p>
      </footer>
    </div>
  );
}

export default App;
