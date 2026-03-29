import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function VendorSettings() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="bg-card rounded-xl border border-border p-6 max-w-xl">
        <h3 className="font-semibold mb-4">Account Settings</h3>
        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          <div><Label>Email</Label><Input defaultValue="vendor@luxeatelier.com" className="mt-1.5 rounded-lg" /></div>
          <div><Label>Phone</Label><Input defaultValue="+1 (555) 987-6543" className="mt-1.5 rounded-lg" /></div>
          <div><Label>Business Address</Label><Textarea defaultValue="123 Fashion Blvd, Milan, Italy" className="mt-1.5 rounded-lg" rows={2} /></div>
          <Button className="rounded-lg">Save Changes</Button>
        </form>
      </div>
    </div>
  );
}
