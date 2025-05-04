export interface ChatMessage {
  type: 'user' | 'support';
  text: string;
  timestamp: string;
}
