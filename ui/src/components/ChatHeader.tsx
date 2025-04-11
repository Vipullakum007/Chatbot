import { useState } from 'react';
import { CardHeader } from './ui/card';
import { Bot, Menu, X, Settings, Moon, Sun, Info, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface ChatHeaderProps {
  onClearChat: () => void;
}

const ChatHeader = ({ onClearChat }: ChatHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleTheme = () => setDarkMode(!darkMode);
  
  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear all messages?')) {
      onClearChat();
      setMenuOpen(false);
    }
  };

  return (
    <CardHeader className="bg-white border-b py-4 px-6 flex justify-between items-center relative">
      <div className="flex items-center gap-2">
        <Bot className="h-6 w-6 text-blue-500" />
        <h2 className="text-xl font-bold">AI Assistant</h2>
      </div>
      
      <Button variant="ghost" size="icon" onClick={toggleMenu} className="relative z-20">
        {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {menuOpen && (
        <div className="absolute top-full right-0 mt-2 mr-4 bg-white shadow-lg rounded-lg z-10 w-48 py-2 border animate-in fade-in slide-in-from-top-5">
          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={toggleTheme}>
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </div>
          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={handleClearChat}>
            <Trash2 className="h-4 w-4" />
            <span>Clear Chat</span>
          </div>
          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </div>
          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>About</span>
          </div>
        </div>
      )}
    </CardHeader>
  );
};

export default ChatHeader;