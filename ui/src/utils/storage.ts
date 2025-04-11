import { Message } from "../types/Message";

// Convert Message objects for storage (Date objects don't stringify well)
interface StorableMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string; // Store as ISO string
}

export const saveMessagesToStorage = (messages: Message[]): void => {
  const storableMessages: StorableMessage[] = messages.map((msg) => ({
    id: msg.id,
    text: msg.text,
    isUser: msg.isUser,
    timestamp: msg.timestamp.toISOString(), // Convert Date to string
  }));

  localStorage.setItem("chatMessages", JSON.stringify(storableMessages));
};

export const loadMessagesFromStorage = (): Message[] => {
  const storedMessages = localStorage.getItem("chatMessages");

  if (!storedMessages) {
    return []; // Return empty array if no messages stored
  }

  try {
    const parsedMessages: StorableMessage[] = JSON.parse(storedMessages);

    // Convert back to Message objects with proper Date objects
    return parsedMessages.map((msg) => ({
      id: msg.id,
      text: msg.text,
      isUser: msg.isUser,
      timestamp: new Date(msg.timestamp),
    }));
  } catch (error) {
    console.error("Failed to parse stored messages:", error);
    return [];
  }
};

export const clearStoredMessages = (): void => {
  localStorage.removeItem("chatMessages");
};

// Helper to generate unique IDs
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
