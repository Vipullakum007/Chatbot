export interface Message {
  id: string; // Added unique ID for each message
  text: string;
  isUser: boolean;
  timestamp: Date;
}
