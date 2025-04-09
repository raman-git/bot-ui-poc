import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Styled components
const ChatContainer = styled.div`
  width: 100%;
max-width: 700px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 800px;
`;

const ChatHeader = styled.div`
  background-color: #4a6fa5;
  color: white;
  padding: 15px 20px;
  display: flex;
  align-items: center;
`;

const ChatAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #2c3e50;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  font-weight: bold;
  font-size: 18px;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: stretch;
`;

const MessageBubble = styled.div`
  max-width: 80%;
  padding: 12px 15px;
  border-radius: 18px;
  margin-bottom: 5px;
  word-wrap: break-word;
  line-height: 1.4;
  
  ${props => props.isUser ? `
    align-self: flex-end;
    background-color: #4a6fa5;
    color: white;
    border-bottom-right-radius: 5px;
  ` : `
    align-self: flex-start;
    background-color: #f1f0f0;
    color: #333;
    border-bottom-left-radius: 5px;
  `}
`;

const ChatInputContainer = styled.div`
  padding: 15px;
  border-top: 1px solid #e6e6e6;
  display: flex;
  background-color: #fff;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
  
  &:focus {
    border-color: #4a6fa5;
  }
`;

const SendButton = styled.button`
  background-color: #4a6fa5;
  color: white;
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  margin-left: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #3d5d8a;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const BotResponse = styled.div`
  background-color: #f8f9fa;
  padding: 10px 15px;
  border-radius: 8px;
  border-left: 3px solid #4a6fa5;
  max-width: 100%;
  align-self: flex-start;
  
  .timestamp {
    font-size: 12px;
    color: #888;
    margin-top: 5px;
    text-align: right;
  }
  
  /* Table styling */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 15px 0;
    font-size: 14px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    overflow: hidden;
  }
  
  th {
    background-color: #4a6fa5;
    color: white;
    font-weight: bold;
    text-align: left;
    padding: 12px 15px;
    border: 1px solid #3d5d8a;
  }
  
  td {
    padding: 10px 15px;
    border: 1px solid #d1e1f9;
    color: #333;
  }
  
  tr:nth-child(even) {
    background-color: #f2f7ff;
  }
  
  tr:hover {
    background-color: #e6f0ff;
  }
  
  tr:last-child td {
    border-bottom: 2px solid #4a6fa5;
  }
  
  tr:first-child th:first-child {
    border-top-left-radius: 5px;
  }
  
  tr:first-child th:last-child {
    border-top-right-radius: 5px;
  }
`;

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      text: input,
      isUser: true,
      id: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Send message to server
      const response = await axios.post('/api/chat', { message: input });
      
      // Add bot response to chat
      const botMessage = {
        html: response.data.response,
        isUser: false,
        id: Date.now() + 1
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage = {
        text: 'Sorry, there was an error processing your request.',
        isUser: false,
        id: Date.now() + 1
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Focus back on the input field after response
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <h3>ASKAI</h3>
      </ChatHeader>
      
      <ChatMessages>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#888', marginTop: '30px' }}>
            Send a message to start chatting!
          </div>
        )}
        
        {messages.map(message => (
          <div key={message.id} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: message.isUser ? 'flex-end' : 'flex-start' }}>
            {message.isUser ? (
              <MessageBubble isUser={true}>
                {message.text}
              </MessageBubble>
            ) : message.html ? (
              <BotResponse dangerouslySetInnerHTML={{ __html: message.html }} />
            ) : (
              <MessageBubble isUser={false}>
                {message.text}
              </MessageBubble>
            )}
          </div>
        ))}
        
        {isLoading && (
          <MessageBubble isUser={false}>
            Thinking...
          </MessageBubble>
        )}
        
        <div ref={messagesEndRef} />
      </ChatMessages>
      
      <form onSubmit={handleSendMessage}>
        <ChatInputContainer>
          <ChatInput
            type="text"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            ref={inputRef}
          />
          <SendButton type="submit" disabled={isLoading || !input.trim()}>
            →
          </SendButton>
        </ChatInputContainer>
      </form>
    </ChatContainer>
  );
};

export default ChatBot;
