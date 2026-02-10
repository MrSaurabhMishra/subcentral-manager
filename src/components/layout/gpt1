import { LayoutDashboard, BarChart3, CreditCard, Download, ChevronUp } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/contexts/LocaleContext";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: CreditCard, label: "Plans", path: "/plans" },
  { icon: Download, label: "Data Export", path: "/export" },
];

export function Sidebar({ isCollapsed, toggleSidebar }) {
  return (
    <div className={`relative h-screen border-r bg-background transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* 2. Arrow at the Top */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-4 bg-primary text-white rounded-full p-1"
      >
        <ChevronUp className={`transition-transform ${isCollapsed ? 'rotate-90' : '-rotate-90'}`} size={16} />
      </button>

      <nav className="mt-16 space-y-2 px-3">
        {menuItems.map((item) => (
          <a key={item.label} href={item.path} className="flex items-center gap-3 p-3 rounded-[12px] hover:bg-secondary transition-all">
            <item.icon size={20} />
            {!isCollapsed && <span>{item.label}</span>}
          </a>
        ))}
      </nav>
    </div>
  );
}
