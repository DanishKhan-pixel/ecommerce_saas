import { Outlet, Link, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { User, Package, MapPin, Star, LayoutDashboard, LogOut, Store, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { label: "Dashboard", to: "/account", icon: LayoutDashboard },
  { label: "My Orders", to: "/account/orders", icon: Package },
  { label: "Addresses", to: "/account/addresses", icon: MapPin },
  { label: "My Reviews", to: "/account/reviews", icon: Star },
  { label: "Profile", to: "/account/profile", icon: User },
];

export function CustomerLayout() {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-10">
          <aside className="w-full md:w-56 shrink-0 md:self-start md:sticky md:top-24">
            <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
              {links.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap",
                    (pathname === l.to || (l.to !== "/account" && pathname.startsWith(l.to)))
                      ? "bg-accent text-accent-foreground shadow-soft"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <l.icon className="h-4 w-4" />
                  {l.label}
                </Link>
              ))}
              
              {user?.role === 'vendor' && (
                <Link
                  to="/vendor-dashboard"
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap text-primary hover:bg-primary/10 mt-2 border-t border-border/50 pt-4 md:mt-4"
                >
                  <Store className="h-4 w-4" />
                  My Store
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap text-primary hover:bg-primary/10 mt-2 border-t border-border/50 pt-4 md:mt-4"
                >
                  <Shield className="h-4 w-4" />
                  Admin Console
                </Link>
              )}
              <button
                onClick={() => logout()}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap text-destructive hover:bg-destructive/10 mt-2 border-t border-border/50 pt-4 md:mt-4"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </nav>
          </aside>
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
