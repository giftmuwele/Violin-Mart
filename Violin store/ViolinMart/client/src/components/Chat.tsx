import { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { MessageCircle, X, Send } from "lucide-react";
import { cn } from "../lib/utils";
import React from "react";
interface ChatMessage {
  type: 'user' | 'support';
  text: string;
  timestamp: string;
}

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !ws && !isConnecting) {
      setIsConnecting(true);
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${window.location.host}/ws/chat`;
      const websocket = new WebSocket(wsUrl);

      websocket.onopen = () => {
        setWs(websocket);
        setIsConnecting(false);
      };

      websocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setMessages(prev => [...prev, message]);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnecting(false);
        setWs(null);
      };

      websocket.onclose = () => {
        setIsConnecting(false);
        setWs(null);
      };

      return () => {
        websocket.close();
      };
    }
  }, [isOpen, ws, isConnecting]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputMessage.trim() || !ws) return;

    const message: ChatMessage = {
      type: 'user',
      text: inputMessage,
      timestamp: new Date().toISOString(),
    };

    try {
      ws.send(JSON.stringify(message));
      setMessages(prev => [...prev, message]);
      setInputMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full h-12 w-12 p-0 shadow-lg bg-primary hover:bg-primary/90"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-96 flex flex-col shadow-lg bg-background border-primary/20">
      <div className="flex items-center justify-between p-3 border-b border-primary/20 bg-primary/10">
        <h3 className="font-semibold">Customer Support</h3>
        <Button
          className="hover:bg-primary/20"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="flex-1 overflow-y-auto p-3 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "max-w-[80%] p-3 rounded-lg",
              message.type === 'user'
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            <p className="text-sm">{message.text}</p>
            <span className="text-xs opacity-70">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>

      <div className="p-3 border-t border-primary/20 bg-background">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-background border-primary/20"
          />
          <Button
            onClick={handleSend}
            disabled={!ws}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}