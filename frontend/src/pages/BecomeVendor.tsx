import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Store, CheckCircle, Upload, MapPin, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { vendorService } from "@/services/api";

export default function BecomeVendor() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    storeName: "",
    description: "",
    location: "",
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Please select an image under 5MB.", variant: "destructive" });
        return;
      }
      setBannerFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setBannerPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.storeName.trim() || !form.description.trim() || !form.location.trim()) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    if (form.description.trim().length < 20) {
      toast({ title: "Description too short", description: "Please add at least 20 characters.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("store_name", form.storeName.trim());
      formData.append("description", form.description.trim());
      formData.append("location", form.location.trim());
      if (bannerFile) {
        formData.append("banner", bannerFile);
      }

      await vendorService.apply(formData);
      setSubmitted(true);
      toast({ title: "Store created!", description: "Welcome to Vendora. Start adding products now." });
    } catch (error: unknown) {
      const err = error as { response?: { data?: Record<string, string[]> } };
      const errData = err.response?.data;
      const msg = errData
        ? Object.values(errData).flat()[0] || "Something went wrong. Please try again."
        : "Something went wrong. Please try again.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md animate-fade-in">
          <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">You're all set!</h1>
          <p className="text-muted-foreground mb-8">
            Your store has been created. You can now start adding products and customize your storefront.
          </p>
          <Button onClick={() => navigate("/vendor-dashboard")} className="rounded-xl px-8">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <Store className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Create Your Store</h1>
          <p className="text-muted-foreground text-sm">Set up your storefront in just a few steps</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Store Name */}
          <div className="space-y-2">
            <Label htmlFor="storeName" className="text-sm font-medium">Store Name <span className="text-destructive">*</span></Label>
            <Input
              id="storeName"
              placeholder="e.g. Artisan Goods Co."
              value={form.storeName}
              onChange={e => update("storeName", e.target.value)}
              maxLength={60}
              disabled={isSubmitting}
              className="h-12 rounded-xl bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description <span className="text-destructive">*</span></Label>
            <Textarea
              id="description"
              placeholder="Tell customers what makes your store special..."
              value={form.description}
              onChange={e => update("description", e.target.value)}
              maxLength={500}
              rows={3}
              disabled={isSubmitting}
              className="rounded-xl bg-secondary/50 border-0 resize-none focus-visible:ring-1 focus-visible:ring-primary"
            />
            <p className="text-[11px] text-muted-foreground text-right">{form.description.length}/500</p>
          </div>

          {/* Banner Image */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Banner Image</Label>
            {bannerPreview ? (
              <div className="relative rounded-xl overflow-hidden">
                <img src={bannerPreview} alt="Banner preview" className="w-full h-32 object-cover" />
                <button
                  type="button"
                  onClick={removeBanner}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 rounded-xl border-2 border-dashed border-border bg-secondary/30 hover:bg-secondary/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground"
              >
                <Upload className="h-5 w-5" />
                <span className="text-sm">Click to upload</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="hidden"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">Location <span className="text-destructive">*</span></Label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="City, Country"
                value={form.location}
                onChange={e => update("location", e.target.value)}
                maxLength={100}
                disabled={isSubmitting}
                className="h-12 pl-11 rounded-xl bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" size="lg" className="w-full h-12 rounded-xl mt-4" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Store...</> : "Create Store"}
          </Button>
        </form>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          By creating a store, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
