import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useCart } from "@/hooks/useCart";
import { Lock, Loader2 } from "lucide-react";
import { addressService, orderService, paymentService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface AddressForm {
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  country: string;
}

export default function Checkout() {
  const { items, subtotal } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(true);
  const [existingAddressId, setExistingAddressId] = useState<number | null>(null);
  const { toast } = useToast();

  const [form, setForm] = useState<AddressForm>({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    country: "",
  });

  // On page load, fetch saved addresses and pre-fill with the default one
  useEffect(() => {
    const loadAddress = async () => {
      try {
        const res = await addressService.list();
        const addresses: Array<{ id: number; is_default: boolean } & AddressForm> = res.data;
        if (addresses && addresses.length > 0) {
          // Use the default address, or the most recently added one
          const defaultAddr = addresses.find(a => a.is_default) || addresses[0];
          setForm({
            full_name: defaultAddr.full_name,
            phone: defaultAddr.phone,
            address_line: defaultAddr.address_line,
            city: defaultAddr.city,
            state: defaultAddr.state,
            country: defaultAddr.country,
          });
          setExistingAddressId(defaultAddr.id);
        }
      } catch {
        // No saved addresses — form remains blank, which is fine
      } finally {
        setIsFetchingAddress(false);
      }
    };
    loadAddress();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // If the user manually edits a pre-filled field, clear the existingAddressId
    // so we know to save a new address on submit instead of reusing the old one
    setExistingAddressId(null);
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Link to="/shop"><Button className="mt-4 rounded-xl">Go to Shop</Button></Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    const { full_name, phone, address_line, city, state, country } = form;

    if (!full_name || !phone || !address_line || !city || !state || !country) {
      toast({
        title: "Shipping address required",
        description: "Please fill in all shipping address fields before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Save address only if it was edited or there is no existing one
      if (!existingAddressId) {
        await addressService.create({ full_name, phone, address_line, city, state, country });
      }

      // 2. Create orders from cart
      const orderRes = await orderService.create();
      const createdOrders = orderRes.data;

      if (!createdOrders || createdOrders.length === 0) {
        throw new Error("Failed to create orders.");
      }

      // 3. Initialize payment and redirect to Paystack
      const orderIds = createdOrders.map((o: { id: number }) => o.id);
      const callbackUrl = `${window.location.origin}/order-success`;
      const paymentRes = await paymentService.initialize(orderIds, callbackUrl);
      const { authorization_url } = paymentRes.data;

      if (authorization_url) {
        window.location.href = authorization_url;
      } else {
        throw new Error("No authorization URL returned.");
      }

    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } }; message?: string };
      console.error("Checkout error:", error);
      toast({
        title: "Checkout Failed",
        description: err.response?.data?.error || err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Cart", to: "/cart" }, { label: "Checkout" }]} />
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Shipping Address</h3>
              {existingAddressId && (
                <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                  Using saved address
                </span>
              )}
            </div>
            {isFetchingAddress ? (
              <div className="animate-pulse space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 bg-muted rounded-lg" />
                  <div className="h-10 bg-muted rounded-lg" />
                </div>
                <div className="h-10 bg-muted rounded-lg" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 bg-muted rounded-lg" />
                  <div className="h-10 bg-muted rounded-lg" />
                  <div className="h-10 bg-muted rounded-lg" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name <span className="text-destructive">*</span></Label>
                  <Input id="full_name" name="full_name" className="mt-1.5 rounded-lg" placeholder="Sarah Miller" value={form.full_name} onChange={handleChange} disabled={isProcessing} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone <span className="text-destructive">*</span></Label>
                  <Input id="phone" name="phone" className="mt-1.5 rounded-lg" placeholder="+1 (555) 000-0000" value={form.phone} onChange={handleChange} disabled={isProcessing} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address_line">Street Address <span className="text-destructive">*</span></Label>
                  <Input id="address_line" name="address_line" className="mt-1.5 rounded-lg" placeholder="123 Oak Avenue" value={form.address_line} onChange={handleChange} disabled={isProcessing} />
                </div>
                <div>
                  <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
                  <Input id="city" name="city" className="mt-1.5 rounded-lg" placeholder="Portland" value={form.city} onChange={handleChange} disabled={isProcessing} />
                </div>
                <div>
                  <Label htmlFor="state">State <span className="text-destructive">*</span></Label>
                  <Input id="state" name="state" className="mt-1.5 rounded-lg" placeholder="Oregon" value={form.state} onChange={handleChange} disabled={isProcessing} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="country">Country <span className="text-destructive">*</span></Label>
                  <Input id="country" name="country" className="mt-1.5 rounded-lg" placeholder="United States" value={form.country} onChange={handleChange} disabled={isProcessing} />
                </div>
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold mb-2">Payment</h3>
            <p className="text-sm text-muted-foreground mb-4">Payment will be processed securely via Paystack.</p>
            <div className="bg-muted rounded-lg p-4 flex items-center gap-3 text-sm text-muted-foreground">
              <Lock className="h-5 w-5 shrink-0" />
              <span>You'll be redirected to Paystack's secure gateway to complete your payment.</span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-xl border border-border p-6 h-fit lg:sticky lg:top-24">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="space-y-3 mb-4">
            {items.map(item => (
              <div key={item.product.id} className="flex gap-3">
                <img src={item.product.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-success">Free</span></div>
          </div>
          <div className="border-t border-border my-4" />
          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Total</span><span>${subtotal.toFixed(2)}</span>
          </div>
          <Button className="w-full rounded-xl h-11" onClick={handlePlaceOrder} disabled={isProcessing || isFetchingAddress}>
            {isProcessing ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
            ) : (
              <><Lock className="mr-2 h-4 w-4" /> Place Order & Pay</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
