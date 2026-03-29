import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { paymentService } from "@/services/api";
import { useCart } from "@/hooks/useCart";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  
  const [status, setStatus] = useState<"verifying" | "success" | "failed">(
    reference ? "verifying" : "success"
  );
  const [errorMessage, setErrorMessage] = useState("");
  // We call useCart to ensure it triggers its initial fetch to clear the frontend cart (since backend cleared it)
  useCart(); 

  useEffect(() => {
    if (reference) {
      verifyPayment(reference);
    }
  }, [reference]);

  const verifyPayment = async (ref: string) => {
    try {
      await paymentService.verify(ref);
      setStatus("success");
    } catch (error: any) {
      console.error("Payment verification failed", error);
      setStatus("failed");
      setErrorMessage(error.response?.data?.error || "Payment verification failed.");
    }
  };

  if (status === "verifying") {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-md">
        <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-6" />
        <h1 className="text-2xl font-bold">Verifying Payment...</h1>
        <p className="text-muted-foreground mt-3">Please wait while we confirm your transaction securely.</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-destructive/10 mx-auto flex items-center justify-center mb-6">
          <XCircle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold">Payment Failed</h1>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          {errorMessage || "There was an issue verifying your payment. Please contact support if you have been charged."}
        </p>
        <div className="flex flex-col gap-2 mt-8">
          <Link to="/checkout"><Button className="rounded-xl w-full">Return to Checkout</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-md">
      <div className="w-16 h-16 rounded-full bg-accent mx-auto flex items-center justify-center mb-6">
        <CheckCircle className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold">Payment Successful!</h1>
      <p className="text-muted-foreground mt-3 leading-relaxed">
        Thank you for your order. We've received your payment and will process your order shortly.
      </p>
      {reference && (
        <p className="text-sm font-medium mt-4 text-muted-foreground">Reference: {reference}</p>
      )}
      <div className="flex flex-col gap-2 mt-8">
        <Link to="/account/orders"><Button className="rounded-xl w-full">View My Orders <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        <Link to="/shop"><Button variant="outline" className="rounded-xl w-full">Continue Shopping</Button></Link>
      </div>
    </div>
  );
}
