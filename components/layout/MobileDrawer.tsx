"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  TrendingUp,
  CalendarDays,
  LineChart,
  Brain,
  Trophy,
  Users,
  Award,
  UserCircle,
  Settings,
  X,
  Twitter,
  MessageCircle,
} from "lucide-react";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);


  const isActive = (path: string) => pathname === path;

  // All navigation items for the drawer
  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/predictions", icon: TrendingUp, label: "Predictions" },
    { href: "/events", icon: CalendarDays, label: "Events" },
    { href: "/events/odds/movements", icon: LineChart, label: "Odds Movements" },
    { href: "/models", icon: Brain, label: "AI Models" },
    { href: "/leagues", icon: Trophy, label: "Leagues" },
    { href: "/teams", icon: Users, label: "Teams" },
    { href: "/leaderboard", icon: Award, label: "Leaderboard" },
    { href: "/profile", icon: UserCircle, label: "Profile" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  // Close drawer on route change (but not on initial mount)
  useEffect(() => {
    // Only close if pathname actually changed and drawer is open
    if (pathname !== previousPathnameRef.current && isOpen) {
      onClose();
    }
    previousPathnameRef.current = pathname;
  }, [pathname, isOpen, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 md:hidden ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-xl transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isOpen ? "transform translate-x-0" : "transform -translate-x-full"
        }`}
        style={{ 
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 300ms ease-in-out'
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <Link href="/" onClick={onClose} className="block">
              <div className="flex items-center">
                <Image
                  src="/logo_transparent_larger.png"
                  alt="SignalOdds Logo"
                  width={32}
                  height={32}
                  className="mr-3"
                />
                <div>
                  <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    SignalOdds
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    AI signals. Bettor wins.
                  </p>
                </div>
              </div>
            </Link>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                  isActive(item.href)
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <Icon size={22} className="mr-4" />
                <span className="text-base">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer with social links */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://x.com/SignalOdds"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on X"
              className="rounded-full p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Twitter size={20} className="text-gray-600 dark:text-gray-400" />
            </a>
            <a
              href="https://whatsapp.com/channel/0029VbBAn5KHQbSAZNpZ6m33"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join WhatsApp Channel"
              className="rounded-full p-3 hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
            >
              <MessageCircle size={20} className="text-green-600 dark:text-green-400" />
            </a>
            <a
              href="https://t.me/signaloddscom"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join Telegram Channel"
              className="rounded-full p-3 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="inline-block"
              >
                <circle cx="12" cy="12" r="12" fill="#229ED9" />
                <path
                  d="M17.472 7.768c.084-.372-.144-.52-.38-.43L6.68 11.44c-.36.14-.356.34-.062.43l2.62.82 1.02 3.14c.13.36.23.5.47.5.24 0 .33-.11.45-.36l1.23-2.01 2.56 1.89c.47.26.81.13.93-.44l1.68-7.13zm-7.1 4.3l5.3-3.34c.25-.16.48-.07.29.1l-4.5 4.08-.18 2.02-.91-2.86z"
                  fill="#fff"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}