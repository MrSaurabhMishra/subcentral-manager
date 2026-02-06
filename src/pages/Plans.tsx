import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    current: true,
    features: ["Track up to 5 subscriptions", "Basic analytics", "Email alerts", "1 shared account"],
  },
  {
    name: "Pro",
    price: "$4.99",
    period: "/month",
    current: false,
    popular: true,
    features: [
      "Unlimited subscriptions",
      "Advanced analytics & insights",
      "Smart usage alerts",
      "Unlimited shared accounts",
      "Virtual credit card",
      "Priority support",
    ],
  },
  {
    name: "Team",
    price: "$12.99",
    period: "/month",
    current: false,
    features: [
      "Everything in Pro",
      "Team dashboard",
      "Budget controls",
      "Admin roles",
      "API access",
      "Dedicated support",
    ],
  },
];

const Plans = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">Plans & Pricing</h1>
        <p className="text-muted-foreground text-sm mt-1">Choose the plan that fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`glass-card relative animate-fade-in ${
              plan.popular ? "ring-2 ring-primary shadow-lg" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
            )}
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <div className="pt-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.current ? "outline" : "default"}
                disabled={plan.current}
              >
                {plan.current ? "Current Plan" : "Upgrade"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Plans;
