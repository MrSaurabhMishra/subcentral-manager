import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { subscriptions } from "@/lib/mockData";
import { Plus, Filter, Users } from "lucide-react";

const Subscriptions = () => {
  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage all your digital subscriptions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Add New
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptions.map((sub) => (
          <Card key={sub.id} className="glass-card hover:shadow-md transition-shadow cursor-pointer animate-fade-in">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{sub.icon}</span>
                  <div>
                    <p className="font-semibold text-sm">{sub.service}</p>
                    <p className="text-xs text-muted-foreground">{sub.category}</p>
                  </div>
                </div>
                <Badge
                  variant={sub.status === "active" ? "default" : "secondary"}
                  className={
                    sub.status === "active"
                      ? "bg-success/15 text-success border-0"
                      : "bg-muted text-muted-foreground border-0"
                  }
                >
                  {sub.status === "active" ? "Active" : "Paused"}
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Cost</span>
                  <span className="font-semibold">${sub.monthlyCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Next Billing</span>
                  <span>{sub.nextBilling}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Used</span>
                  <span>{sub.lastUsed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Usage</span>
                  <span>{sub.currentMonthUsage}</span>
                </div>
                {sub.shared && (
                  <div className="flex items-center gap-1.5 pt-1 text-primary">
                    <Users className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">Shared with {sub.sharedWith?.join(", ")}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;
