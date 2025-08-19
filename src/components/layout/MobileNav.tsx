import { Home, Mic, Upload, FolderOpen, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/record", icon: Mic, label: "Record" },
    { href: "/upload", icon: Upload, label: "Upload" },
    { href: "/memories", icon: FolderOpen, label: "Memories" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ href, icon: Icon, label }) => (
          <NavLink
            key={href}
            to={href}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-0",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )
            }
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className="text-xs font-medium truncate">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;