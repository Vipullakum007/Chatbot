import { useState, useEffect } from 'react';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import { Card } from './components/ui/card';
import { Message } from './types/Message';
import { saveMessagesToStorage, loadMessagesFromStorage, generateId, clearStoredMessages } from './utils/storage';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Added darkMode state
  
  // Load messages from localStorage on initial render
  useEffect(() => {
    const storedMessages = loadMessagesFromStorage();
    
    // If no stored messages, add welcome message
    if (storedMessages.length === 0) {
      setMessages([{
        id: generateId(),
        text: "Hello! I'm your assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date(),
      }]);
    } else {
      setMessages(storedMessages);
    }
    
    // Check if dark mode was previously set
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessagesToStorage(messages);
    }
  }, [messages]);
  
  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    
    // Save dark mode preference
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    // Add user message to the chat
    const userMessage: Message = {
      id: generateId(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Encode the message for URL parameters
      const encodedMessage = message.replace(/ /g, '+');
      
      // Make request to your Flask backend with explicit CORS mode
      const response = await fetch(`http://localhost:5000/query/${encodedMessage}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add bot response to chat
      const botMessage: Message = {
        id: generateId(),
        text: data.top.response,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
      
      // Add error message to chat
      const errorMessage: Message = {
        id: generateId(),
        text: "Sorry, I couldn't connect to the server. Please check if the backend is running and refresh the page.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    // Clear messages from state and storage
    clearStoredMessages(); // Added this line to clear localStorage
    setMessages([{
      id: generateId(),
      text: "Hello! I'm your assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    }]);
  };
  
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`flex flex-col items-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-blue-50'} p-4 md:p-8`}>
      <Card className={`w-full max-w-4xl mx-auto flex flex-col h-[85vh] shadow-lg border-none rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
        <ChatHeader 
          onClearChat={handleClearChat} 
          darkMode={darkMode}
          toggleTheme={toggleTheme}
        />
        <MessageList 
          messages={messages} 
          isLoading={isLoading} 
          darkMode={darkMode}
        />
        <ChatInput 
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          darkMode={darkMode}
        />
      </Card>
    </div>
  );
}

export default App;