"use client";

import { useRouter } from "next/navigation";
import {
  Calendar,
  Brain,
  Bot,
  Users,
  Trophy,
  Gamepad2,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface LeftDrawerProps {
  open: boolean;
  onClose: () => void;
}

const menuItems: MenuItem[] = [
  {
    label: "Etkinlikler",
    href: "/events",
    icon: Calendar,
  },
  {
    label: "Tahminler",
    href: "/predictions",
    icon: Brain,
  },
  {
    label: "AI Modelleri",
    href: "/ai-models",
    icon: Bot,
  },
  {
    label: "Takımlar",
    href: "/teams",
    icon: Users,
  },
  {
    label: "Ligler",
    href: "/leagues",
    icon: Trophy,
  },
  {
    label: "Sporlar",
    href: "/sports",
    icon: Gamepad2,
  },
];

export function LeftDrawer({ open, onClose }: LeftDrawerProps) {
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />
      </div>

      {/* Drawer */}
      <div
        className={`fixed top-12 sm:top-14 left-0 h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.5rem)] w-64 bg-white dark:bg-gray-950 z-50 transform transition-all duration-300 shadow-xl ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="h-full flex items-center justify-center">
          <nav className="space-y-2 w-full px-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  variant="navMenu"
                  size="navMenu"
                  leftIcon={<Icon className="w-4 h-4" />}
                  className="rounded-md w-full"
                >
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}