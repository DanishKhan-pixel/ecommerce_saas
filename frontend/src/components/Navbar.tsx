import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Vendors", to: "/vendors" },
  { label: "Categories", to: "/categories" },
  { label: "Sell", to: "/become-vendor" },
];

export function Navbar() {
  const { itemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border/60">
      <div className="container mx-auto flex items-center justify-between h-[72px] px-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight text-foreground select-none">
          Vend<span className="text-primary font-extrabold">ora</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "text-[13px] font-medium transition-colors duration-200 tracking-wide uppercase",
                (pathname === l.to || (l.to !== "/" && pathname.startsWith(l.to)))
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-1">
          <Link to="/search">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-10 w-10 rounded-xl">
              <Search className="h-[18px] w-[18px]" />
            </Button>
          </Link>
          <Link to="/cart" className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-10 w-10 rounded-xl transition-colors duration-200",
                pathname.startsWith("/cart") ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ShoppingCart className="h-[18px] w-[18px]" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-[18px] w-[18px] flex items-center justify-center shadow-soft">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>
          
          {isAuthenticated && (
            <Link to="/account">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "h-10 w-10 rounded-xl transition-colors duration-200",
                  pathname.startsWith("/account") ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <User className="h-[18px] w-[18px]" />
              </Button>
            </Link>
          )}
          
          {!isAuthenticated && (
            <div className="hidden md:flex items-center gap-1.5 ml-3 pl-3 border-l border-border/60">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-muted-foreground rounded-xl h-9 px-4 text-[13px]">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="rounded-xl h-9 px-5 text-[13px] shadow-soft">Get Started</Button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground h-10 w-10 rounded-xl ml-1" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/60 bg-card px-4 py-5 space-y-1 animate-fade-in">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-foreground py-2.5 px-3 rounded-xl hover:bg-muted transition-colors">
              {l.label}
            </Link>
          ))}
          {!isAuthenticated ? (
            <div className="flex gap-2 pt-4 mt-2 border-t border-border/60">
              <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full rounded-xl h-11" size="sm">Sign In</Button>
              </Link>
              <Link to="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button className="w-full rounded-xl h-11" size="sm">Get Started</Button>
              </Link>
            </div>
          ) : (
            <Link to="/account" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-foreground py-2.5 px-3 rounded-xl hover:bg-muted transition-colors mt-2 border-t border-border/60">
              My Account
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
