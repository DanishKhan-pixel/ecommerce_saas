import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/hooks/useCart";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import { PublicLayout } from "@/layouts/PublicLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { CustomerLayout } from "@/layouts/CustomerLayout";
import { VendorLayout } from "@/layouts/VendorLayout";
import { AdminLayout } from "@/layouts/AdminLayout";

import Index from "@/pages/Index";
import Shop from "@/pages/Shop";
import ProductDetails from "@/pages/ProductDetails";
import Vendors from "@/pages/Vendors";
import VendorStore from "@/pages/VendorStore";
import Categories from "@/pages/Categories";
import SearchResults from "@/pages/SearchResults";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import BecomeVendor from "@/pages/BecomeVendor";
import NotFound from "@/pages/NotFound";

import AccountDashboard from "@/pages/account/Dashboard";
import MyOrders from "@/pages/account/Orders";
import OrderDetailsPage from "@/pages/account/OrderDetails";
import Addresses from "@/pages/account/Addresses";
import Profile from "@/pages/account/Profile";
import MyReviews from "@/pages/account/Reviews";

import VendorDashboard from "@/pages/vendor/Dashboard";
import VendorMyStore from "@/pages/vendor/MyStore";
import EditStore from "@/pages/vendor/EditStore";
import VendorProducts from "@/pages/vendor/Products";
import ProductForm from "@/pages/vendor/ProductForm";
import VendorOrders from "@/pages/vendor/Orders";
import VendorOrderDetails from "@/pages/vendor/OrderDetails";
import VendorSettings from "@/pages/vendor/Settings";

import AdminDashboard from "@/pages/admin/Dashboard";
import ManageVendors from "@/pages/admin/Vendors";
import AdminVendorDetails from "@/pages/admin/VendorDetails";
import ManageCategories from "@/pages/admin/Categories";
import ManageProducts from "@/pages/admin/Products";
import ManageOrders from "@/pages/admin/Orders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetails />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/vendor/:id" element={<VendorStore />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/become-vendor" element={
                <ProtectedRoute>
                  <BecomeVendor />
                </ProtectedRoute>
                } />
            </Route>

            {/* Auth */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Customer Account */}
            <Route element={
              <ProtectedRoute>
                <CustomerLayout />
              </ProtectedRoute>
            }>
              <Route path="/account" element={<AccountDashboard />} />
              <Route path="/account/orders" element={<MyOrders />} />
              <Route path="/account/orders/:id" element={<OrderDetailsPage />} />
              <Route path="/account/addresses" element={<Addresses />} />
              <Route path="/account/profile" element={<Profile />} />
              <Route path="/account/reviews" element={<MyReviews />} />
            </Route>

            {/* Vendor Dashboard */}
            <Route element={
              <ProtectedRoute requireVendor={true}>
                <VendorLayout />
              </ProtectedRoute>
            }>
              <Route path="/vendor-dashboard" element={<VendorDashboard />} />
              <Route path="/vendor-dashboard/store" element={<VendorMyStore />} />
              <Route path="/vendor-dashboard/store/edit" element={<EditStore />} />
              <Route path="/vendor-dashboard/products" element={<VendorProducts />} />
              <Route path="/vendor-dashboard/products/new" element={<ProductForm />} />
              <Route path="/vendor-dashboard/products/:id/edit" element={<ProductForm />} />
              <Route path="/vendor-dashboard/orders" element={<VendorOrders />} />
              <Route path="/vendor-dashboard/orders/:id" element={<VendorOrderDetails />} />
              <Route path="/vendor-dashboard/settings" element={<VendorSettings />} />
            </Route>

            {/* Admin */}
            <Route element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/vendors" element={<ManageVendors />} />
              <Route path="/admin/vendors/:id" element={<AdminVendorDetails />} />
              <Route path="/admin/categories" element={<ManageCategories />} />
              <Route path="/admin/products" element={<ManageProducts />} />
              <Route path="/admin/orders" element={<ManageOrders />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
