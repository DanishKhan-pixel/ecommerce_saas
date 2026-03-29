import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-foreground text-background/80">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <Link to="/" className="text-xl font-bold text-background">
              Vend<span className="text-primary">ora</span>
            </Link>
            <p className="mt-4 text-sm text-background/50 leading-relaxed max-w-xs">
              A curated platform connecting you with independent artisans and
              premium brands worldwide.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-background text-xs tracking-wider uppercase mb-5">
              Shop
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/shop"
                  className="text-background/50 hover:text-primary transition-colors duration-200"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="text-background/50 hover:text-primary transition-colors duration-200"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/vendors"
                  className="text-background/50 hover:text-primary transition-colors duration-200"
                >
                  Vendors
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-background text-xs tracking-wider uppercase mb-5">
              Account
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/account"
                  className="text-background/50 hover:text-primary transition-colors duration-200"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  to="/account/orders"
                  className="text-background/50 hover:text-primary transition-colors duration-200"
                >
                  My Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/become-vendor"
                  className="text-background/50 hover:text-primary transition-colors duration-200"
                >
                  Sell with Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-background text-xs tracking-wider uppercase mb-5">
              Newsletter
            </h4>
            <p className="text-sm text-background/50 mb-4 leading-relaxed">
              Get the latest updates on new products and upcoming sales.
            </p>
            <div className="flex gap-2 min-w-0">
              <input
                type="email"
                placeholder="your@email.com"
                className="min-w-0 flex-1 bg-background/5 border border-background/10 rounded-xl px-4 py-2.5 text-sm text-background placeholder:text-background/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
              <button className="shrink-0 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-soft">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-background/8 mt-16 pt-8 text-center text-sm text-background/30">
          © 2026 Vendora. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
