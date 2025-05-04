import React from 'react'
import { useState } from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Background image and overlay */}
      <div 
        className="fixed inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to bottom right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7)), 
            url('https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?auto=format&fit=crop&w=2000&q=80')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Accent gradients */}
      <div 
        className="fixed inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, var(--primary) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, var(--primary) 0%, transparent 40%)
          `
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/products" component={Products} />
              <Route path="/cart" component={Cart} />
              <Route path="/checkout" component={Checkout} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
        <Chat />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;