import { useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  Sun,
  Moon,
  ChevronDown,
  User,
  CreditCard,
  Layers,
  Clock,
  KeyRound,
  HelpCircle,
  LogOut,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6 gap-4">
      {/* Left spacer for mobile hamburger */}
      <div className="w-10 lg:hidden" />

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search subscriptions..."
          className="pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>

      <div className="flex items-center gap-2">
        {/* Add New */}
        <Button size="sm" className="hidden sm:flex gap-2">
          <Plus className="h-4 w-4" />
          <span>Add New</span>
        </Button>
        <Button size="icon" className="sm:hidden h-9 w-9">
          <Plus className="h-4 w-4" />
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setDark(!dark)}
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-2"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
              JD
            </div>
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", profileOpen && "rotate-180")} />
          </Button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-lg border border-border bg-card shadow-lg z-50 animate-fade-in overflow-hidden">
              {/* Profile header */}
              <div className="p-4 border-b border-border">
                <p className="font-semibold text-sm">John Doe</p>
                <p className="text-xs text-muted-foreground">john.doe@email.com</p>
              </div>

              <div className="py-1">
                {[
                  { icon: User, label: "Profile" },
                  { icon: BarChart3, label: "Usage Summary" },
                  { icon: CreditCard, label: "Virtual Credit Card" },
                  { icon: Layers, label: "Your Plan" },
                  { icon: Clock, label: "Payment History" },
                  { icon: KeyRound, label: "Reset Password" },
                  { icon: HelpCircle, label: "Support" },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="border-t border-border py-1">
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-muted transition-colors"
                  onClick={() => setProfileOpen(false)}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
