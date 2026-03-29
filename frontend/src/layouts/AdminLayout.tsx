import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Package, ShoppingCart, FolderOpen, Shield, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Vendors", to: "/admin/vendors", icon: Users },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Orders", to: "/admin/orders", icon: ShoppingCart },
  { label: "Categories", to: "/admin/categories", icon: FolderOpen },
];

export function AdminLayout() {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden md:flex flex-col w-64 border-r border-border/60 bg-card p-5 sticky top-0 h-screen overflow-y-auto">
        <Link to="/" className="text-lg font-bold mb-10 px-3">
          Vend<span className="text-primary">ora</span>
          <span className="block text-[10px] text-muted-foreground font-medium tracking-[0.15em] uppercase mt-1">Admin Console</span>
        </Link>
        <nav className="flex flex-col gap-1">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                (pathname === l.to || (l.to !== "/admin" && pathname.startsWith(l.to)))
                  ? "bg-accent text-accent-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-destructive hover:bg-destructive/10 mt-auto pt-4 border-t border-border/50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border/60 flex items-center px-6 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-sm font-semibold">Admin</span>
          </div>
          <div className="ml-auto">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">← Back to Store</Link>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
