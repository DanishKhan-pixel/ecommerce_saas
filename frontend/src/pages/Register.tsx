import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email || !password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        first_name: firstName,
        last_name: lastName,
        email,
        password
      });

      toast({
        title: "Account Created!",
        description: "Welcome to Vendora.",
      });
      
      navigate("/");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { email?: string[], error?: string } } };
      toast({
        title: "Registration Failed",
        description: err.response?.data?.email?.[0] || err.response?.data?.error || "Registration failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <Link to="/" className="text-2xl font-bold">Vend<span className="text-primary">ora</span></Link>
        <h1 className="text-xl font-bold mt-6">Create your account</h1>
        <p className="text-sm text-muted-foreground mt-1">Start shopping from amazing vendors</p>
      </div>
      <form className="space-y-4" onSubmit={handleRegister}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="fname">First Name <span className="text-destructive">*</span></Label>
            <Input 
              id="fname" 
              placeholder="Sarah" 
              className="mt-1.5 h-11 rounded-xl"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="lname">Last Name <span className="text-destructive">*</span></Label>
            <Input 
              id="lname" 
              placeholder="Miller" 
              className="mt-1.5 h-11 rounded-xl" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="you@example.com" 
            className="mt-1.5 h-11 rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting} 
          />
        </div>
        <div>
          <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
          <div className="relative mt-1.5">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-11 rounded-xl pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <Button 
          className="w-full h-11 rounded-xl" 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</> : "Create Account"}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center"><span className="bg-background px-3 text-xs text-muted-foreground">or</span></div>
      </div>

      <Link to="/become-vendor" className="flex items-center justify-center gap-2 border border-border rounded-xl p-3 hover:bg-muted transition-colors">
        <Store className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Become a Vendor</span>
      </Link>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
