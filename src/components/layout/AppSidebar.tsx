import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BarChart3,
  CreditCard,
  Layers,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/LocaleContext";

const navItems = [
  { titleKey: "nav.dashboard", url: "/", icon: LayoutDashboard },
  { titleKey: "nav.analytics", url: "/analytics", icon: BarChart3 },
  { titleKey: "nav.subscriptions", url: "/subscriptions", icon: CreditCard },
  { titleKey: "nav.plans", url: "/plans", icon: Layers },
  { titleKey: "nav.shared", url: "/shared", icon: Users },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { t } = useLocale();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <LayoutDashboard className="h-5 w-5" />
      </Button>

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
          collapsed ? "w-[68px]" : "w-[240px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            SC
          </div>
          {!collapsed && (
            <span className="font-bold text-lg text-sidebar-foreground tracking-tight">
              SubCentral
            </span>
          )}
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.titleKey}
              to={item.url}
              end={item.url === "/"}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                collapsed && "justify-center px-2"
              )}
              activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{t(item.titleKey)}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex p-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-8 w-8 text-sidebar-foreground/50 hover:text-sidebar-foreground"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </aside>
    </>
  );
}
