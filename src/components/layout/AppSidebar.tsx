import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BarChart3,
  CreditCard,
  Layers,
  Users,
  ChevronLeft,
  ChevronRight,
  Share2,
  MessageSquare,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/LocaleContext";
import { ShareModal } from "@/components/modals/ShareModal";
import { FeedbackModal } from "@/components/modals/FeedbackModal";

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
  const [shareOpen, setShareOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
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
        {/* Header with collapse arrow at top */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            SC
          </div>
          {!collapsed && (
            <span className="font-bold text-lg text-sidebar-foreground tracking-tight flex-1">
              SubCentral
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex h-8 w-8 text-sidebar-foreground/50 hover:text-sidebar-foreground shrink-0"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.titleKey}
              to={item.url}
              end={item.url === "/"}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                collapsed && "justify-center px-2"
              )}
              activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{t(item.titleKey)}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions: Share & Feedback */}
        <div className="px-2 pb-3 space-y-1">
          <button
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors w-full",
              collapsed && "justify-center px-2"
            )}
            onClick={() => setShareOpen(true)}
          >
            <Share2 className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Share SubCentral</span>}
          </button>
          <button
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors w-full",
              collapsed && "justify-center px-2"
            )}
            onClick={() => setFeedbackOpen(true)}
          >
            <MessageSquare className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Give Feedback</span>}
          </button>
        </div>
      </aside>

      <ShareModal open={shareOpen} onOpenChange={setShareOpen} />
      <FeedbackModal open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </>
  );
}
