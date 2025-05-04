import express, { type Request, Response, NextFunction } from "express";
import { WebSocket, WebSocketServer } from "ws";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { generateChatResponse } from "./services/ai-chat";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// WebSocket setup
interface ChatMessage {
  type: 'user' | 'support';
  text: string;
  timestamp: string;
}

interface ChatClient {
  ws: WebSocket;
  sessionId: string;
}

const clients = new Map<string, ChatClient>();

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = registerRoutes(app);

  // Create WebSocket server with a specific path
  const wss = new WebSocketServer({
    server,
    path: '/ws/chat'
  });

  wss.on('connection', async (ws: WebSocket) => {
    try {
      const sessionId = Math.random().toString(36).substring(7);
      clients.set(sessionId, { ws, sessionId });

      // Send welcome message
      const welcomeMessage: ChatMessage = {
        type: 'support',
        text: 'Welcome to Dolce Vita support! How can we help you today?',
        timestamp: new Date().toISOString(),
      };
      ws.send(JSON.stringify(welcomeMessage));

      // Handle incoming messages
      ws.on('message', async (data: string) => {
        try {
          const message = JSON.parse(data) as ChatMessage;

          // Generate AI response
          const aiResponse = await generateChatResponse(message.text);

          const response: ChatMessage = {
            type: 'support',
            text: aiResponse,
            timestamp: new Date().toISOString(),
          };

          ws.send(JSON.stringify(response));
        } catch (error) {
          console.error('Error processing message:', error);
          ws.send(JSON.stringify({
            type: 'support',
            text: 'Sorry, there was an error processing your message. Please try again.',
            timestamp: new Date().toISOString(),
          }));
        }
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        clients.delete(sessionId);
      });

      ws.on('close', () => {
        clients.delete(sessionId);
      });
    } catch (error) {
      console.error('Error in WebSocket connection:', error);
    }
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = 5000;
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
  });
})();