import { useRef, useEffect, useCallback } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { CardContent } from './ui/card';
import ChatMessage from './ChatMessage';
import { Message } from '../types/Message';
import LoadingIndicator from './LoadingIndicator';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Function to scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end' 
      });
    }
  }, []);
  
  // Scroll to bottom when messages update or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);
  
  // Add keyboard shortcut listeners for scrolling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PageUp') {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop -= 300;
        }
      } else if (e.key === 'PageDown') {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop += 300;
        }
      } else if (e.key === 'End') {
        scrollToBottom();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollToBottom]);

  return (
    <CardContent className="flex-grow p-0 bg-gray-50 overflow-hidden">
      <ScrollArea 
        className="h-full max-h-full" 
        ref={scrollAreaRef}
      >
        <div className="p-6 space-y-6">
          {messages.map((message, index) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              showAvatar={index === 0 || messages[index-1]?.isUser !== message.isUser}
            />
          ))}
          {isLoading && <LoadingIndicator />}
          <div ref={messagesEndRef} className="h-1" />
        </div>
      </ScrollArea>
    </CardContent>
  );
};

export default MessageList;