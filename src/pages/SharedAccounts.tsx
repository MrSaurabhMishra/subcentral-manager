import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { subscriptions } from "@/lib/mockData";
import { UserPlus } from "lucide-react";

const sharedSubs = subscriptions.filter((s) => s.shared);

const SharedAccounts = () => {
  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shared Accounts</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage subscriptions shared with others
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <UserPlus className="h-4 w-4" /> Invite Member
        </Button>
      </div>

      {sharedSubs.length === 0 ? (
        <Card className="glass-card p-12 text-center">
          <p className="text-muted-foreground">No shared subscriptions yet</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sharedSubs.map((sub) => (
            <Card key={sub.id} className="glass-card animate-fade-in">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{sub.icon}</span>
                    <div>
                      <p className="font-semibold text-sm">{sub.service}</p>
                      <p className="text-xs text-muted-foreground">${sub.monthlyCost.toFixed(2)}/mo</p>
                    </div>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-0">{sub.sharedWith?.length} members</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Shared with:</span>
                  <div className="flex gap-1.5">
                    {sub.sharedWith?.map((name) => (
                      <Badge key={name} variant="secondary" className="text-xs">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SharedAccounts;
