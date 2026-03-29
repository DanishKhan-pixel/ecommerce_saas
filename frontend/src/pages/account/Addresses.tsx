import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, MapPin, Loader2, Pencil, Trash2, X, Check } from "lucide-react";
import { addressService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface Address {
  id: number;
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  country: string;
  is_default: boolean;
}

type FormData = Omit<Address, "id" | "is_default">;

const emptyForm: FormData = {
  full_name: "",
  phone: "",
  address_line: "",
  city: "",
  state: "",
  country: "",
};

// ─── Extracted outside parent component to prevent focus loss on re-render ───

interface AddressFormProps {
  form: FormData;
  isNew: boolean;
  saving: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

function AddressForm({ form, isNew, saving, onChange, onSave, onCancel }: AddressFormProps) {
  return (
    <div className="bg-muted/40 border border-border rounded-xl p-5 space-y-4">
      <h4 className="font-medium text-sm">{isNew ? "New Address" : "Edit Address"}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="full_name" className="text-xs">Full Name</Label>
          <Input id="full_name" name="full_name" className="mt-1 rounded-lg h-9 text-sm" placeholder="Sarah Miller" value={form.full_name} onChange={onChange} disabled={saving} />
        </div>
        <div>
          <Label htmlFor="phone" className="text-xs">Phone</Label>
          <Input id="phone" name="phone" className="mt-1 rounded-lg h-9 text-sm" placeholder="+1 (555) 000-0000" value={form.phone} onChange={onChange} disabled={saving} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="address_line" className="text-xs">Street Address</Label>
          <Input id="address_line" name="address_line" className="mt-1 rounded-lg h-9 text-sm" placeholder="123 Oak Avenue" value={form.address_line} onChange={onChange} disabled={saving} />
        </div>
        <div>
          <Label htmlFor="city" className="text-xs">City</Label>
          <Input id="city" name="city" className="mt-1 rounded-lg h-9 text-sm" placeholder="Portland" value={form.city} onChange={onChange} disabled={saving} />
        </div>
        <div>
          <Label htmlFor="state" className="text-xs">State</Label>
          <Input id="state" name="state" className="mt-1 rounded-lg h-9 text-sm" placeholder="Oregon" value={form.state} onChange={onChange} disabled={saving} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="country" className="text-xs">Country</Label>
          <Input id="country" name="country" className="mt-1 rounded-lg h-9 text-sm" placeholder="United States" value={form.country} onChange={onChange} disabled={saving} />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <Button size="sm" className="rounded-lg h-8 text-xs" onClick={onSave} disabled={saving}>
          {saving ? <><Loader2 className="mr-1.5 h-3 w-3 animate-spin" /> Saving...</> : <><Check className="mr-1.5 h-3 w-3" /> Save Address</>}
        </Button>
        <Button size="sm" variant="ghost" className="rounded-lg h-8 text-xs text-muted-foreground" onClick={onCancel} disabled={saving}>
          <X className="mr-1.5 h-3 w-3" /> Cancel
        </Button>
      </div>
    </div>
  );
}

// ─── Main page component ──────────────────────────────────────────────────────

export default function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // null = form closed, -1 = adding new, any positive int = editing that address
  const [activeFormId, setActiveFormId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);

  const { toast } = useToast();

  const fetchAddresses = async () => {
    try {
      const res = await addressService.list();
      setAddresses(res.data);
    } catch {
      toast({ title: "Failed to load addresses", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const openAddForm = () => {
    setForm(emptyForm);
    setActiveFormId(-1);
  };

  const openEditForm = (address: Address) => {
    setForm({
      full_name: address.full_name,
      phone: address.phone,
      address_line: address.address_line,
      city: address.city,
      state: address.state,
      country: address.country,
    });
    setActiveFormId(address.id);
  };

  const closeForm = () => {
    setActiveFormId(null);
    setForm(emptyForm);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    const { full_name, phone, address_line, city, state, country } = form;
    if (!full_name || !phone || !address_line || !city || !state || !country) {
      toast({ title: "All fields are required.", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      if (activeFormId === -1) {
        await addressService.create(form);
        toast({ title: "Address added successfully." });
      } else if (activeFormId !== null) {
        await addressService.update(activeFormId, form);
        toast({ title: "Address updated successfully." });
      }
      closeForm();
      await fetchAddresses();
    } catch {
      toast({ title: "Failed to save address.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await addressService.delete(id);
      toast({ title: "Address deleted." });
      setAddresses(prev => prev.filter(a => a.id !== id));
    } catch {
      toast({ title: "Failed to delete address.", variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Saved Addresses</h1>
        {activeFormId === null && (
          <Button size="sm" className="rounded-lg" onClick={openAddForm}>
            <Plus className="h-4 w-4 mr-1" /> Add Address
          </Button>
        )}
      </div>

      {activeFormId === -1 && (
        <div className="mb-4">
          <AddressForm
            form={form}
            isNew={true}
            saving={saving}
            onChange={handleChange}
            onSave={handleSave}
            onCancel={closeForm}
          />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="bg-muted animate-pulse rounded-xl h-40" />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <MapPin className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No saved addresses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map(a => (
            <div key={a.id}>
              {activeFormId === a.id ? (
                <AddressForm
                  form={form}
                  isNew={false}
                  saving={saving}
                  onChange={handleChange}
                  onSave={handleSave}
                  onCancel={closeForm}
                />
              ) : (
                <div className="bg-card rounded-xl border border-border p-5 relative">
                  {a.is_default && (
                    <Badge className="absolute top-3 right-3 text-[10px]">Default</Badge>
                  )}
                  <MapPin className="h-5 w-5 text-muted-foreground mb-2" />
                  <p className="font-medium text-sm">{a.full_name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.phone}</p>
                  <p className="text-sm text-muted-foreground mt-1">{a.address_line}</p>
                  <p className="text-sm text-muted-foreground">{a.city}, {a.state}</p>
                  <p className="text-sm text-muted-foreground">{a.country}</p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="text-xs rounded-lg h-8" onClick={() => openEditForm(a)}>
                      <Pencil className="mr-1.5 h-3 w-3" /> Edit
                    </Button>
                    {!a.is_default && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs rounded-lg h-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(a.id)}
                        disabled={deletingId === a.id}
                      >
                        {deletingId === a.id
                          ? <Loader2 className="h-3 w-3 animate-spin" />
                          : <><Trash2 className="mr-1.5 h-3 w-3" /> Delete</>
                        }
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
