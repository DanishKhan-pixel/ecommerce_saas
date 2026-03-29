import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, X, Loader2, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { vendorService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { baseURL } from "@/lib/axios";

export default function EditStore() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    storeName: "",
    description: "",
    location: "",
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  // Pre-fill form with existing store data
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await vendorService.myStore();
        const store = response.data;
        setForm({
          storeName: store.store_name || "",
          description: store.description || "",
          location: store.location || "",
        });
        if (store.banner) {
          setBannerPreview(`${baseURL}${store.banner}`);
        }
      } catch {
        toast({ title: "Error", description: "Could not load store data.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStore();
  }, [toast]);

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

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("store_name", form.storeName.trim());
      formData.append("description", form.description.trim());
      formData.append("location", form.location.trim());
      if (bannerFile) {
        formData.append("banner", bannerFile);
      }

      await vendorService.updateStore(formData);
      toast({ title: "Store updated!", description: "Your store information has been saved." });
      navigate("/vendor-dashboard/store");
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <Link to="/vendor-dashboard/store" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Store
      </Link>
      <h1 className="text-2xl font-bold mb-6">Edit Store</h1>

      <div className="bg-card rounded-xl border border-border p-6 max-w-xl">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Store Name */}
          <div className="space-y-2">
            <Label htmlFor="storeName" className="text-sm font-medium">Store Name <span className="text-destructive">*</span></Label>
            <Input
              id="storeName"
              value={form.storeName}
              onChange={e => update("storeName", e.target.value)}
              maxLength={60}
              disabled={isSubmitting}
              className="h-11 rounded-xl"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description <span className="text-destructive">*</span></Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={e => update("description", e.target.value)}
              maxLength={500}
              rows={4}
              disabled={isSubmitting}
              className="rounded-xl resize-none"
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
                <span className="text-sm">Click to upload new banner</span>
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
                value={form.location}
                onChange={e => update("location", e.target.value)}
                maxLength={100}
                disabled={isSubmitting}
                className="h-11 pl-11 rounded-xl"
              />
            </div>
          </div>

          <Button type="submit" className="rounded-xl w-full h-11" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
