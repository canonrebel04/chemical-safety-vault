import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Rocket, Loader2, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useReducer } from 'spacetimedb/react';
import { reducers } from '@/module_bindings';
import { toast } from 'sonner';

export default function Billing() {
  const { shop } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const createSubscription = useReducer(reducers.createSubscription);

  const isPremium = shop?.plan === 'premium';

  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'true' && !isPremium) {
      handleSuccess();
    }
  }, [searchParams, isPremium]);

  const handleSuccess = async () => {
    setIsProcessing(true);
    try {
      const mockSubId = `sub_${Math.random().toString(36).substring(7)}`;
      await createSubscription({ subscriptionId: mockSubId });
      toast.success("Upgrade successful! Welcome to Premium.");
      // Clear params
      setSearchParams({});
    } catch (e) {
      toast.error("Failed to finalize subscription.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpgrade = () => {
    setIsProcessing(true);
    toast.info("Redirecting to Stripe Checkout...");
    
    // In a real app, you would hit an endpoint to create a session and redirect:
    // const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    // await stripe.redirectToCheckout({ sessionId });
    
    // For this scaffold, we mock the redirect delay and return with success
    setTimeout(() => {
      window.location.search = '?success=true';
    }, 1500);
  };

  const features = [
    "Unlimited Chemical Inventory",
    "Unlimited SDS Cloud Storage",
    "Multi-Technician Support",
    "Priority Compliance Alerts",
    "Custom Safety Reports",
    "Offline Data Sync"
  ];

  if (!shop) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-3xl font-bold tracking-tight">Billing & Plan</h1>

      <Card className={isPremium ? "border-primary bg-primary/5" : ""}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Manage your subscription and features.</CardDescription>
          </div>
          <Badge variant={isPremium ? "default" : "secondary"} className="text-lg px-4 py-1">
            {isPremium ? "PREMIUM" : "FREE"}
          </Badge>
        </CardHeader>
        <CardContent>
          {isPremium ? (
            <div className="flex items-center gap-2 text-green-500 font-medium">
              <Zap className="h-5 w-5 fill-current" />
              Your shop has unlimited access to all features.
            </div>
          ) : (
            <div className="text-muted-foreground">
              You are currently on the limited free tier. Upgrade to unlock the full vault.
            </div>
          )}
        </CardContent>
      </Card>

      {!isPremium && (
        <Card>
          <CardHeader className="text-center">
            <Rocket className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl">Professional Safety Vault</CardTitle>
            <div className="text-4xl font-bold mt-2">$59<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
            <CardDescription className="mt-4">
              The complete solution for auto-parts and blender shops.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button 
              size="lg" 
              className="w-full text-lg py-6 shadow-xl" 
              onClick={handleUpgrade}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
              ) : (
                <><CreditCard className="mr-2 h-5 w-5" /> Upgrade to Premium</>
              )}
            </Button>
            <p className="text-[10px] text-center text-muted-foreground italic">
              Payments secured by Stripe. Cancel anytime.
            </p>
          </CardContent>
        </Card>
      )}

      {isPremium && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stripe ID:</span>
              <span className="font-mono">{shop.stripeSubscriptionId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Billing Cycle:</span>
              <span>Monthly</span>
            </div>
            <Button variant="outline" className="w-full mt-4" size="sm">
              Manage in Stripe Portal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
