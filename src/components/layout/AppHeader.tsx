import { useState, useEffect, useRef } from "react";
import { Search, Plus, Sun, Moon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LocaleSwitcher } from "@/components/header/LocaleSwitcher";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { useLocale } from "@/contexts/LocaleContext";

export function AppHeader() {
  const { t } = useLocale();
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
      <div className="w-10 lg:hidden" />

      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("header.search")}
          className="pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" className="hidden sm:flex gap-2">
          <Plus className="h-4 w-4" />
          <span>{t("header.addNew")}</span>
        </Button>
        <Button size="icon" className="sm:hidden h-9 w-9">
          <Plus className="h-4 w-4" />
        </Button>

        <LocaleSwitcher />

        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setDark(!dark)}>
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <div className="relative" ref={dropdownRef}>
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-2"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
              JD
            </div>
            <ChevronDown
              className={cn("h-4 w-4 text-muted-foreground transition-transform", profileOpen && "rotate-180")}
            />
          </Button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 z-50">
              <AccountSidebar onClose={() => setProfileOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
