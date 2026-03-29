import { useState, useEffect, useCallback } from "react";
import { Category } from "@/data/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { categoryService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { baseURL } from "@/lib/axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ManageCategories() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      setCats(response.data);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to fetch categories. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      setIsSubmitting(true);
      await categoryService.create(formData);
      toast({ title: "Success", description: "Category created successfully" });
      setOpenAdd(false);
      setPreview(null);
      fetchCategories();
    } catch (error: unknown) {
      const axiosError = error as any;
      toast({
        title: "Error",
        description: axiosError.response?.data?.error || "Failed to create category",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCategory) return;
    
    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get('image') as File;
    if (imageFile && imageFile.size === 0) {
      formData.delete('image');
    }

    try {
      setIsSubmitting(true);
      await categoryService.update(editingCategory.id, formData);
      toast({ title: "Success", description: "Category updated successfully" });
      setOpenEdit(false);
      setEditingCategory(null);
      setPreview(null);
      fetchCategories();
    } catch (error: unknown) {
      const axiosError = error as any;
      toast({
        title: "Error",
        description: axiosError.response?.data?.error || "Failed to update category",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      setIsSubmitting(true);
      await categoryService.delete(categoryToDelete);
      toast({ title: "Success", description: "Category deleted successfully" });
      setOpenDelete(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Categories</h1>
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Category</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Category</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={handleCreate}>
              <div><Label htmlFor="name">Name</Label><Input id="name" name="name" className="mt-1.5 rounded-lg" placeholder="Category name" required /></div>
              <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" className="mt-1.5 rounded-lg" placeholder="Short description" /></div>
              <div>
                <Label htmlFor="image">Image</Label>
                <Input id="image" type="file" name="image" className="mt-1.5 rounded-lg" accept="image/*" onChange={handleImageChange} />
                {preview && (
                  <div className="mt-2 text-center">
                    <img src={preview} alt="Preview" className="mx-auto h-32 w-full object-cover rounded-md border border-border" />
                    <Button type="button" variant="ghost" size="sm" onClick={() => setPreview(null)} className="mt-1 text-xs text-destructive">Remove preview</Button>
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full rounded-lg" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card rounded-xl border border-border overflow-hidden h-64">
              <Skeleton className="h-32 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : cats.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border">
          <p className="text-muted-foreground">No categories found. Add your first category!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cats.map(c => (
            <div key={c.id} className="bg-card rounded-xl border border-border overflow-hidden flex flex-col">
              <div className="h-32 overflow-hidden bg-muted flex items-center justify-center">
                {c.image ? (
                  <img src={`${baseURL}${c.image}`} alt={c.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="h-8 w-8 text-muted-foreground opacity-20" />
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-sm">{c.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{c.description}</p>
                <div className="flex gap-1 mt-auto pt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => {
                      setEditingCategory(c);
                      setPreview(`${baseURL}${c.image}`);
                      setOpenEdit(true);
                    }}
                  >
                    <Edit className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      setCategoryToDelete(c.id);
                      setOpenDelete(true);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category
              and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Category</DialogTitle></DialogHeader>
          <form className="space-y-4" onSubmit={handleUpdate}>
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input 
                id="edit-name" 
                name="name" 
                defaultValue={editingCategory?.name} 
                className="mt-1.5 rounded-lg" 
                placeholder="Category name" 
                required 
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description" 
                name="description" 
                defaultValue={editingCategory?.description} 
                className="mt-1.5 rounded-lg" 
                placeholder="Short description" 
              />
            </div>
            <div>
              <Label htmlFor="edit-image">Image (Leave blank to keep current)</Label>
              <Input id="edit-image" type="file" name="image" className="mt-1.5 rounded-lg" accept="image/*" onChange={handleImageChange} />
              {preview && (
                <div className="mt-2 text-center">
                  <img src={preview} alt="Preview" className="mx-auto h-32 w-full object-cover rounded-md border border-border" />
                  <Button type="button" variant="ghost" size="sm" onClick={() => setPreview(null)} className="mt-1 text-xs text-destructive">Remove preview</Button>
                </div>
              )}
            </div>
            <Button type="submit" className="w-full rounded-lg" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : "Update Category"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
