import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please provide both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast({
        title: "Login Failed",
        description: err.response?.data?.error || "Invalid credentials or network error.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-10">
        <Link to="/" className="text-2xl font-bold">Vend<span className="text-primary">ora</span></Link>
        <h1 className="text-xl font-bold mt-8 tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1.5">Sign in to your account</p>
      </div>
      <form className="space-y-5" onSubmit={handleLogin}>
        <div>
          <Label htmlFor="email" className="text-sm font-medium">Email <span className="text-destructive">*</span></Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="you@example.com" 
            className="mt-2 h-11 rounded-xl border-border/60" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-sm font-medium">Password <span className="text-destructive">*</span></Label>
            <button type="button" className="text-xs text-primary font-medium hover:text-primary/80 transition-colors">Forgot password?</button>
          </div>
          <div className="relative mt-2">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-11 rounded-xl border-border/60 pr-10"
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
          className="w-full h-11 rounded-xl text-sm font-semibold shadow-soft" 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</> : "Sign In"}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground mt-8">
        Don't have an account? <Link to="/register" className="text-primary font-semibold hover:text-primary/80 transition-colors">Create one</Link>
      </p>
    </div>
  );
}
