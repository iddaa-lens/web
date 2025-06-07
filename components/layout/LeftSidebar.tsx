"use client";

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
} from "lucide-react";

export default function LeftSidebar() {
  const pathname = usePathname();

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
                src="/logo_transparent_larger.png"
                alt="Web Logo"
                width={30}
                height={30}
                className="mr-1"
              />
              <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                IddaaLens
              </h1>
            </div>

            {/* Tagline on second line */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-2">
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
              className={`flex items-center px-4 py-3 text-xl rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-800 ${
                isActive(item.href)
                  ? "font-bold"
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
      <div className="text-center mt-4 mb-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          IddaaLens v1.0
        </p>
      </div>
    </div>
  );
}
