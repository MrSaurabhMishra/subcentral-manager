import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { subscriptions } from "@/lib/mockData";
import { Users } from "lucide-react";

export function SubscriptionTable() {
  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Your Subscriptions</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Next Billing</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead className="hidden lg:table-cell">Last Used</TableHead>
                <TableHead className="hidden lg:table-cell">Usage</TableHead>
                <TableHead className="hidden sm:table-cell">Shared</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub) => (
                <TableRow key={sub.id} className="cursor-pointer">
                  <TableCell className="pl-6 font-medium">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{sub.icon}</span>
                      <div>
                        <p className="font-medium text-sm">{sub.service}</p>
                        <p className="text-xs text-muted-foreground">{sub.category}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={sub.status === "active" ? "default" : "secondary"}
                      className={
                        sub.status === "active"
                          ? "bg-success/15 text-success border-0 hover:bg-success/20"
                          : "bg-muted text-muted-foreground border-0"
                      }
                    >
                      {sub.status === "active" ? "Active" : "Paused"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {sub.nextBilling}
                  </TableCell>
                  <TableCell className="font-semibold text-sm">
                    ${sub.monthlyCost.toFixed(2)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {sub.lastUsed}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {sub.currentMonthUsage}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {sub.shared ? (
                      <div className="flex items-center gap-1.5 text-primary">
                        <Users className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">{sub.sharedWith?.join(", ")}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
