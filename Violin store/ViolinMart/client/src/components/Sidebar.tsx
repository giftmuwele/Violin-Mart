import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "../lib/utils";
import {
  Music2,
  Ruler,
  BookOpen,
  Package,
  GalleryHorizontal,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

interface MenuItem {
  icon: any;
  label: string;
  href: string;
  submenu?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    icon: Music2,
    label: "Instruments",
    href: "/instruments",
    submenu: [
      { icon: GalleryHorizontal, label: "String Instruments", href: "/products?category=strings" },
      { icon: Music2, label: "Wind Instruments", href: "/products?category=wind" },
      { icon: Music2, label: "Brass Instruments", href: "/products?category=brass" }
    ]
  },
  { icon: Package, label: "Cases", href: "/products?category=cases" },
  { icon: Ruler, label: "Strings", href: "/products?category=strings" },
  { icon: Settings, label: "Accessories", href: "/products?category=accessories" },
  { icon: BookOpen, label: "Resources", href: "/resources" },
  { icon: HelpCircle, label: "Help", href: "/help" }
];

export default function Sidebar() {
  const [location] = useLocation();
  const [expandedItem, setExpandedItem] = useState<string | null>("instruments");

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expandedItem === item.label.toLowerCase();
    const isActive = location === item.href;

    return (
      <div key={item.href}>
        <Link href={hasSubmenu ? "#" : item.href}>
          <a
            onClick={(e) => {
              if (hasSubmenu) {
                e.preventDefault();
                setExpandedItem(isExpanded ? null : item.label.toLowerCase());
              }
            }}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              "hover:bg-primary/20",
              isActive 
                ? "bg-primary/30 text-primary" 
                : "text-muted-foreground hover:text-primary",
              level > 0 && "ml-6"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="flex-1">{item.label}</span>
            {hasSubmenu && (
              isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
            )}
          </a>
        </Link>
        {hasSubmenu && isExpanded && (
          <div className="mt-1">
            {item.submenu.map((subItem) => renderMenuItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-64 border-r border-primary/20 h-[calc(100vh-4rem)] bg-background">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => renderMenuItem(item))}
      </nav>
    </aside>
  );
}