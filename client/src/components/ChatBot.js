import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import Settings from './Settings';

// Theme definitions
const lightTheme = {
  background: '#fff',
  headerBackground: '#4a6fa5',
  headerText: '#fff',
  text: '#333',
  inputBorder: '#ddd',
  userBubble: '#4a6fa5',
  userText: '#fff',
  botBubble: '#f1f0f0',
  botText: '#333',
  botResponseBg: '#f8f9fa',
  botResponseBorder: '#4a6fa5',
  timestamp: '#888',
  buttonBg: '#4a6fa5',
  buttonHover: '#3d5d8a',
  buttonDisabled: '#cccccc',
  tableBorder: '#d1e1f9',
  tableHeaderBg: '#4a6fa5',
  tableHeaderText: '#fff',
  tableRowEven: '#f2f7ff',
  tableRowHover: '#e6f0ff',
};

const darkTheme = {
  background: '#1e2a38',
  headerBackground: '#2c3e50',
  headerText: '#f8f9fa',
  text: '#f8f9fa',
  inputBorder: '#4a6fa5',
  userBubble: '#4a6fa5',
  userText: '#fff',
  botBubble: '#2c3e50',
  botText: '#f8f9fa',
  botResponseBg: '#2c3e50',
  botResponseBorder: '#4a6fa5',
  timestamp: '#aaa',
  buttonBg: '#4a6fa5',
  buttonHover: '#3d5d8a',
  buttonDisabled: '#555',
  tableBorder: '#4a6fa5',
  tableHeaderBg: '#2c3e50',
  tableHeaderText: '#f8f9fa',
  tableRowEven: '#1e2a38',
  tableRowHover: '#283a50',
};

// Global style for theme
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    transition: all 0.3s ease;
  }
`;

// Styled components
const ChatContainer = styled.div`
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  background-color: ${props => props.theme.background};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
`;

const ChatHeader = styled.div`
  background-color: ${props => props.theme.headerBackground};
  color: ${props => props.theme.headerText};
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const HamburgerIcon = styled.div`
  width: 24px;
  height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  margin-right: 15px;
  padding: 2px;
  
  span {
    display: block;
    width: 100%;
    height: 3px;
    background-color: white;
    border-radius: 3px;
    transition: all 0.3s ease;
  }
`;

const ChatAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.theme.headerBackground};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  font-weight: bold;
  font-size: 18px;
  color: ${props => props.theme.headerText};
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: stretch;
  background-color: ${props => props.theme.background};
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
    background-color: ${props.theme.userBubble};
    color: ${props.theme.userText};
    border-bottom-right-radius: 5px;
  ` : `
    align-self: flex-start;
    background-color: ${props.theme.botBubble};
    color: ${props.theme.botText};
    border-bottom-left-radius: 5px;
  `}
`;

const ChatInputContainer = styled.div`
  padding: 15px;
  border-top: 1px solid ${props => props.theme.inputBorder};
  display: flex;
  background-color: ${props => props.theme.background};
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 12px 15px;
  border: 1px solid ${props => props.theme.inputBorder};
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  
  &:focus {
    border-color: ${props => props.theme.buttonBg};
  }
`;

const SendButton = styled.button`
  background-color: ${props => props.theme.buttonBg};
  color: ${props => props.theme.headerText};
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
    background-color: ${props => props.theme.buttonHover};
  }
  
  &:disabled {
    background-color: ${props => props.theme.buttonDisabled};
    cursor: not-allowed;
  }
`;

const BotResponse = styled.div`
  background-color: ${props => props.theme.botResponseBg};
  padding: 10px 15px;
  border-radius: 8px;
  border-left: 3px solid ${props => props.theme.botResponseBorder};
  max-width: 100%;
  align-self: flex-start;
  color: ${props => props.theme.botText};
  
  .timestamp {
    font-size: 12px;
    color: ${props => props.theme.timestamp};
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
    background-color: ${props => props.theme.tableHeaderBg};
    color: ${props => props.theme.tableHeaderText};
    font-weight: bold;
    text-align: left;
    padding: 12px 15px;
    border: 1px solid ${props => props.theme.tableBorder};
  }
  
  td {
    padding: 10px 15px;
    border: 1px solid ${props => props.theme.tableBorder};
    color: ${props => props.theme.botText};
  }
  
  tr:nth-child(even) {
    background-color: ${props => props.theme.tableRowEven};
  }
  
  tr:hover {
    background-color: ${props => props.theme.tableRowHover};
  }
  
  tr:last-child td {
    border-bottom: 2px solid ${props => props.theme.botResponseBorder};
  }
  
  tr:first-child th:first-child {
    border-top-left-radius: 5px;
  }
  
  tr:first-child th:last-child {
    border-top-right-radius: 5px;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${props => props.isVisible ? 'block' : 'none'};
`;

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const toggleSettings = () => {
    setIsSettingsOpen(prev => !prev);
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <Overlay isVisible={isSettingsOpen} onClick={closeSettings} />
      <Settings 
        isOpen={isSettingsOpen} 
        onClose={closeSettings} 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
      />
      <ChatContainer>
        <ChatHeader>
          <HeaderLeft>
            <HamburgerIcon onClick={toggleSettings}>
              <span></span>
              <span></span>
              <span></span>
            </HamburgerIcon>
            <h3>ASKAI</h3>
          </HeaderLeft>
        </ChatHeader>
        
        <ChatMessages>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: currentTheme.timestamp, marginTop: '30px' }}>
              Send a message to start chatting!
            </div>
          )}
          
          {messages.map(message => (
            <div key={message.id} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: message.isUser ? 'flex-end' : 'flex-start' }}>
              {message.isUser ? (
                <MessageBubble isUser={true} theme={currentTheme}>
                  {message.text}
                </MessageBubble>
              ) : message.html ? (
                <BotResponse dangerouslySetInnerHTML={{ __html: message.html }} />
              ) : (
                <MessageBubble isUser={false} theme={currentTheme}>
                  {message.text}
                </MessageBubble>
              )}
            </div>
          ))}
          
          {isLoading && (
            <MessageBubble isUser={false} theme={currentTheme}>
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
    </ThemeProvider>
  );
};

export default ChatBot;
