import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertCartItemSchema } from "@shared/schema";
import session from "express-session";
import MemoryStore from "memorystore";

const SessionStore = MemoryStore(session);

export function registerRoutes(app: Express): Server {
  // Session middleware
  app.use(session({
    store: new SessionStore({ checkPeriod: 86400000 }),
    secret: "violin-store-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

  // Product routes
  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get("/api/products/search", async (req, res) => {
    const query = req.query.q as string;
    if (!query) {
      return res.json([]);
    }
    const products = await storage.searchProducts(query);
    res.json(products);
  });

  app.get("/api/products/:id", async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  app.post("/api/products", async (req, res) => {
    const result = insertProductSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid product data" });
    }
    const product = await storage.createProduct(result.data);
    res.status(201).json(product);
  });

  app.patch("/api/products/:id", async (req, res) => {
    const product = await storage.updateProduct(Number(req.params.id), req.body);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  app.delete("/api/products/:id", async (req, res) => {
    const success = await storage.deleteProduct(Number(req.params.id));
    if (!success) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(204).end();
  });

  // Cart routes
  app.get("/api/cart", async (req, res) => {
    const items = await storage.getCartItems(req.sessionID);
    res.json(items);
  });

  app.post("/api/cart", async (req, res) => {
    const result = insertCartItemSchema.safeParse({
      ...req.body,
      sessionId: req.sessionID
    });
    if (!result.success) {
      return res.status(400).json({ message: "Invalid cart item data" });
    }
    const item = await storage.addToCart(result.data);
    res.status(201).json(item);
  });

  app.patch("/api/cart/:id", async (req, res) => {
    const { quantity } = req.body;
    const item = await storage.updateCartItem(Number(req.params.id), quantity);
    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.json(item);
  });

  app.delete("/api/cart/:id", async (req, res) => {
    const success = await storage.removeFromCart(Number(req.params.id));
    if (!success) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.status(204).end();
  });

  app.delete("/api/cart", async (req, res) => {
    await storage.clearCart(req.sessionID);
    res.status(204).end();
  });

  const httpServer = createServer(app);
  return httpServer;
}
