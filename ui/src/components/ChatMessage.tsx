import { User, Bot } from 'lucide-react';
import { Message } from '../types/Message';

interface ChatMessageProps {
  message: Message;
  showAvatar: boolean;
}

const ChatMessage = ({ message, showAvatar }: ChatMessageProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} items-end gap-2`}>
      {!message.isUser && showAvatar && (
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Bot className="h-5 w-5 text-blue-600" />
        </div>
      )}
      
      <div
        className={`max-w-[75%] rounded-2xl p-4 shadow-sm ${
          message.isUser
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
            : 'bg-white text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap text-sm md:text-base">{message.text}</p>
        <p
          className={`text-xs mt-1 text-right ${
            message.isUser ? 'text-blue-100' : 'text-gray-400'
          }`}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>

      {message.isUser && showAvatar && (
        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
          <User className="h-5 w-5 text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;