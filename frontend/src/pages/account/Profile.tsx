import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Profile() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="bg-card rounded-xl border border-border p-6 max-w-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground">SM</div>
          <div>
            <p className="font-semibold">Sarah Miller</p>
            <p className="text-sm text-muted-foreground">sarah@example.com</p>
          </div>
        </div>
        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>First Name</Label><Input defaultValue="Sarah" className="mt-1.5 rounded-lg" /></div>
            <div><Label>Last Name</Label><Input defaultValue="Miller" className="mt-1.5 rounded-lg" /></div>
          </div>
          <div><Label>Email</Label><Input defaultValue="sarah@example.com" className="mt-1.5 rounded-lg" /></div>
          <div><Label>Phone</Label><Input defaultValue="+1 (555) 123-4567" className="mt-1.5 rounded-lg" /></div>
          <Button className="rounded-lg">Save Changes</Button>
        </form>
      </div>
    </div>
  );
}
