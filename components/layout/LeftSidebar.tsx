"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Brain,
  Trophy,
  MessageCircle,
  TrendingUp,
  Calendar,
  Sun,
  Moon,
} from "lucide-react";

export default function LeftSidebar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  const isActive = (path: string) => pathname === path;

  // Navigation items config with icons
  const navItems = [
    { href: "/", label: "Ana Sayfa", icon: Home },
    { href: "/events", label: "Etkinlikler", icon: Calendar },
    { href: "/events/odds/movements", label: "Oran Hareketleri", icon: TrendingUp },
    { href: "/about", label: "Hakkında", icon: Brain },
    { href: "/features", label: "Özellikler", icon: Trophy },
    { href: "/contact", label: "İletişim", icon: MessageCircle },
  ];

  return (
    <div className="w-full h-screen p-2 sticky top-0 flex flex-col">
      <div className="p-3">
        <Link href="/" className="block">
          {/* Header content */}
          <div className="flex flex-col">
            {/* Logo and main title on same line */}
            <div className="flex items-center">
              <Image
                src="/logo-200.png"
                alt="IddaaLens Logo"
                width={30}
                height={30}
                className="mr-1"
              />
              <h1 className="text-2xl font-bold text-iddaa-600 dark:text-iddaa-800">
                IddaaLens
              </h1>
            </div>

            {/* Tagline on second line */}
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-2">
              Bahis analiz paneli
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 mt-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 text-xl rounded-full transition-colors hover:bg-iddaa-50 dark:hover:bg-iddaa-950 ${
                isActive(item.href)
                  ? "font-bold text-iddaa-600 bg-iddaa-100 dark:text-iddaa-800 dark:bg-iddaa-900"
                  : "font-normal text-gray-900 dark:text-gray-100"
              }`}
            >
              <Icon size={24} className="mr-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-4 mb-2 space-y-3">
        {/* Theme Toggle */}
        <div className="flex justify-center">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-iddaa-50 hover:bg-iddaa-100 dark:bg-iddaa-950 dark:hover:bg-iddaa-900 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} className="text-iddaa-600 dark:text-iddaa-400" /> : <Moon size={18} className="text-iddaa-600" />}
          </button>
        </div>
        
        {/* Version */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          IddaaLens v1.0
        </p>
      </div>
    </div>
  );
}
