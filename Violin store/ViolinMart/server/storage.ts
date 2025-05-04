import { type Product, type InsertProduct, type CartItem, type InsertCartItem } from "@shared/schema";

export interface ChatMessage {
  type: 'user' | 'support';
  text: string;
  timestamp: string;
}

export interface IStorage {
  // Chat operations
  getChatHistory(sessionId: string): Promise<ChatMessage[]>;
  saveChatMessage(sessionId: string, message: ChatMessage): Promise<void>;
  clearChatHistory(sessionId: string): Promise<void>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  searchProducts(query: string): Promise<Product[]>;
  
  // Cart operations
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private chatHistory: Map<string, ChatMessage[]>;
  private currentProductId: number;
  private currentCartItemId: number;

  constructor() {
    this.products = new Map();
    this.cartItems = new Map();
    this.chatHistory = new Map();
    this.currentProductId = 1;
    this.currentCartItemId = 1;

    // Add some initial products
    this.seedProducts();
  }

  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    return this.chatHistory.get(sessionId) || [];
  }

  async saveChatMessage(sessionId: string, message: ChatMessage): Promise<void> {
    const history = await this.getChatHistory(sessionId);
    history.push(message);
    this.chatHistory.set(sessionId, history);
  }

  async clearChatHistory(sessionId: string): Promise<void> {
    this.chatHistory.delete(sessionId);
  }

  private seedProducts() {
    const initialProducts: InsertProduct[] = [
      {
        name: "Student Violin 4/4",
        description: "Perfect for beginners, full-size violin with excellent tone",
        price: "299.99",
        category: "strings",
        imageUrl: "https://placehold.co/300x200",
        inStock: 10,
        previewAudioUrl: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Simon_Panrucker/Happy_Christmas_You_Guys/Simon_Panrucker_-_01_-_Violin_Song.mp3"
      },
      {
        name: "Beginner Flute",
        description: "High-quality flute perfect for students",
        price: "399.99",
        category: "wind",
        imageUrl: "https://placehold.co/300x200",
        inStock: 8,
        previewAudioUrl: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Borrtex/Infinity/Borrtex_-_02_-_Infinity.mp3"
      },
      {
        name: "Student Trumpet",
        description: "Excellent starter trumpet with bright, clear tone",
        price: "449.99",
        category: "brass",
        imageUrl: "https://placehold.co/300x200",
        inStock: 5,
        previewAudioUrl: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Algorithms.mp3"
      },
      {
        name: "Professional Bow",
        description: "Carbon fiber bow with premium horse hair",
        price: "199.99",
        category: "accessories",
        imageUrl: "https://placehold.co/300x200",
        inStock: 15,
        previewAudioUrl: null
      }
    ];

    initialProducts.forEach(product => this.createProduct(product));
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const newProduct = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...product };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values())
      .filter(item => item.sessionId === sessionId);
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const id = this.currentCartItemId++;
    const newItem = { ...item, id };
    this.cartItems.set(id, newItem);
    return newItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const existing = this.cartItems.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, quantity };
    this.cartItems.set(id, updated);
    return updated;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const items = Array.from(this.cartItems.values());
    items.forEach(item => {
      if (item.sessionId === sessionId) {
        this.cartItems.delete(item.id);
      }
    });
    return true;
  }
}

export const storage = new MemStorage();