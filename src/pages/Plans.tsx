import { Check, X, Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTier, Tier } from "@/contexts/TierContext";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface PlanFeature {
  label: string;
  basic: boolean;
  premium: boolean;
  premiumPlus: boolean;
}

const features: PlanFeature[] = [
  { label: "Track subscriptions", basic: true, premium: true, premiumPlus: true },
  { label: "Daily Vibe Check", basic: true, premium: true, premiumPlus: true },
  { label: "Subscription limit", basic: false, premium: false, premiumPlus: true }, // special
  { label: "Full Analytics page", basic: false, premium: true, premiumPlus: true },
  { label: "Low Usage Alerts", basic: false, premium: true, premiumPlus: true },
  { label: "Email Monthly Summary", basic: false, premium: true, premiumPlus: true },
  { label: "Data Export (CSV/PDF)", basic: false, premium: false, premiumPlus: true },
  { label: "Billing/Invoice Download", basic: false, premium: false, premiumPlus: true },
  { label: "Priority Support", basic: false, premium: true, premiumPlus: true },
  { label: "FAQ Support", basic: true, premium: true, premiumPlus: true },
];

const plans: { id: Tier; name: string; price: string; priceNote: string; highlight?: boolean; subLimit: string }[] = [
  { id: "basic", name: "Basic", price: "$0", priceNote: "Free forever", subLimit: "Up to 4 subscriptions" },
  { id: "premium", name: "Premium", price: "$15", priceNote: "/year", highlight: true, subLimit: "Up to 10 subscriptions" },
  { id: "premiumPlus", name: "Premium+", price: "$25", priceNote: "/year", subLimit: "Unlimited subscriptions" },
];

const Plans = () => {
  const { tier, setTier } = useTier();

  const handleSelect = (planId: Tier) => {
    setTier(planId);
    toast.success(`Switched to ${plans.find(p => p.id === planId)?.name} plan!`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Plans & Pricing</h1>
        <p className="text-muted-foreground text-sm mt-1">Choose the plan that fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {plans.map((plan, i) => {
          const isCurrent = tier === plan.id;
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                className={`glass-card relative h-full ${plan.highlight ? "ring-2 ring-primary shadow-lg" : ""}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground gap-1">
                      <Crown className="h-3 w-3" /> Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="pt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.priceNote}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{plan.subLimit}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {features.map((f) => {
                      const enabled = f[plan.id];
                      // Special row for sub limit
                      if (f.label === "Subscription limit") {
                        return (
                          <li key={f.label} className="flex items-start gap-2 text-sm">
                            {plan.id === "premiumPlus" ? (
                              <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                            ) : (
                              <span className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground text-xs font-bold flex items-center justify-center">
                                {plan.id === "basic" ? "4" : "10"}
                              </span>
                            )}
                            <span className={plan.id === "premiumPlus" ? "" : "text-muted-foreground"}>
                              {plan.subLimit}
                            </span>
                          </li>
                        );
                      }
                      return (
                        <li key={f.label} className={`flex items-start gap-2 text-sm ${!enabled ? "text-muted-foreground/50" : ""}`}>
                          {enabled ? (
                            <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground/30 mt-0.5 shrink-0" />
                          )}
                          <span>{f.label}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <Button
                    className="w-full"
                    variant={isCurrent ? "outline" : "default"}
                    disabled={isCurrent}
                    onClick={() => handleSelect(plan.id)}
                  >
                    {isCurrent ? "Current Plan" : "Select Plan"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Plans;
