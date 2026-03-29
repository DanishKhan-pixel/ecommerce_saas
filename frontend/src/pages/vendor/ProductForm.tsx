import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Link, useParams, useNavigate } from "react-router-dom";
import { vendorProductService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { baseURL } from "@/lib/axios";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [generatingDesc, setGeneratingDesc] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    const initData = async () => {
      try {
        setFetching(true);
        // Fetch categories dynamically
        const catRes = await vendorProductService.getCategories();
        setCategories(catRes.data || []);

        if (isEdit) {
          // Find product details
          const prodRes = await vendorProductService.getAll();
          const p = prodRes.data.find((item: Record<string, unknown>) => String(item.id) === String(id));
          if (p) {
            setName(p.name || "");
            if (p.category?.id) setCategoryId(String(p.category.id));
            setDescription(p.description || "");
            setPrice(p.price !== undefined ? String(p.price) : "");
            setStock(p.stock !== undefined ? String(p.stock) : "");
            setIsAvailable(p.is_available ?? true);
            if (p.image) setImagePreview(`${baseURL}${p.image}`);
          } else {
            toast({ title: "Error", description: "Product not found", variant: "destructive" });
          }
        }
      } catch (err) {
        toast({ title: "Error", description: "Failed to load product data", variant: "destructive" });
      } finally {
        setFetching(false);
      }
    };
    initData();
  }, [id, isEdit, toast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Please select an image under 5MB.", variant: "destructive" });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleGenerateDescription = async () => {
    if (!name.trim()) {
      toast({ title: "Validation Error", description: "Please provide a product name to generate description.", variant: "destructive" });
      return;
    }
    try {
      setGeneratingDesc(true);
      const res = await vendorProductService.generateDescription(name);
      // The API usually returns JSON like { description: "..." }
      if (res.data?.description) {
        setDescription(res.data.description);
        toast({ title: "Success", description: "Description generated via AI!" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to generate description", variant: "destructive" });
    } finally {
      setGeneratingDesc(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !categoryId) {
      toast({ title: "Validation Error", description: "Name, Price, and Category are required.", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category_id", categoryId);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock || "0");
      formData.append("is_available", String(isAvailable));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (isEdit) {
        await vendorProductService.update(id as string, formData);
        toast({ title: "Success", description: "Product updated successfully!" });
      } else {
        await vendorProductService.create(formData);
        toast({ title: "Success", description: "Product created successfully!" });
      }
      navigate("/vendor-dashboard/products");
    } catch (err) {
      toast({ title: "Error", description: "Failed to save product. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-8 text-center text-muted-foreground flex justify-center items-center"><Loader2 className="animate-spin h-6 w-6" /></div>;
  }

  return (
    <div>
      <Link to="/vendor-dashboard/products" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Products
      </Link>
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
      <div className="bg-card rounded-xl border border-border p-6 max-w-xl">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label>Product Name</Label>
            <Input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="mt-1.5 rounded-lg" 
              placeholder="Product name" 
              required
            />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="mt-1.5 rounded-lg"><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              className="mt-1.5 rounded-lg" 
              rows={4} 
              placeholder="Product description" 
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-2 gap-1.5" 
              onClick={handleGenerateDescription}
              disabled={generatingDesc}
            >
              {generatingDesc ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              Generate with AI
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Price ($)</Label>
              <Input 
                type="number" 
                step="0.01"
                min="0"
                value={price} 
                onChange={e => setPrice(e.target.value)} 
                className="mt-1.5 rounded-lg" 
                placeholder="0.00" 
                required
              />
            </div>
            <div>
              <Label>Stock</Label>
              <Input 
                type="number" 
                min="0"
                value={stock} 
                onChange={e => setStock(e.target.value)} 
                className="mt-1.5 rounded-lg" 
                placeholder="0" 
              />
            </div>
          </div>
          
          {/* Image Upload Field */}
          <div className="space-y-2">
            <Label>Product Image</Label>
            {imagePreview ? (
              <div className="relative rounded-lg overflow-hidden mt-1.5">
                <img src={imagePreview} alt="Product preview" className="w-full h-40 object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 mt-1.5 rounded-lg border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground"
              >
                <Upload className="h-5 w-5" />
                <span className="text-sm">Click to upload image</span>
                <span className="text-xs">PNG, JPG up to 5MB</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="flex items-center justify-between bg-muted rounded-lg p-3">
            <Label className="cursor-pointer">Available for purchase</Label>
            <Switch checked={isAvailable} onCheckedChange={setIsAvailable} />
          </div>
          <Button type="submit" className="rounded-lg" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {isEdit ? 'Save Changes' : 'Create Product'}
          </Button>
        </form>
      </div>
    </div>
  );
}
