import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { paymentHistory } from "@/lib/mockData";
import { CreditCard, Check } from "lucide-react";

const SettingsPage = () => {
  const [notifications, setNotifications] = useState({
    email7: true,
    email3: true,
    email1: true,
    push7: false,
    push3: true,
    push1: true,
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="payments">Payments & Plans</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <CardTitle className="text-base">Account Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john.doe@email.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input id="password" type="password" placeholder="Enter new password" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Current Plan</p>
                  <p className="text-xs text-muted-foreground">Free plan — 5 subscriptions</p>
                </div>
                <Button variant="outline" size="sm">Upgrade Plan</Button>
              </div>
              <Separator />
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-4">
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <CardTitle className="text-base">Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">Free Plan</p>
                    <Badge variant="secondary">Current</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">5 subscriptions, basic analytics</p>
                </div>
                <Button size="sm">Upgrade to Pro</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <CardTitle className="text-base">Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">•••• •••• •••• 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 12/2027</p>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">Update</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <CardTitle className="text-base">Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentHistory.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">{p.description}</p>
                      <p className="text-xs text-muted-foreground">{p.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">${p.amount.toFixed(2)}</span>
                      <Badge variant="secondary" className="bg-success/10 text-success border-0 text-xs">
                        <Check className="h-3 w-3 mr-1" /> Paid
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <CardTitle className="text-base">Renewal Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { label: "7 days before renewal", emailKey: "email7" as const, pushKey: "push7" as const },
                { label: "3 days before renewal", emailKey: "email3" as const, pushKey: "push3" as const },
                { label: "1 day before renewal", emailKey: "email1" as const, pushKey: "push1" as const },
              ].map((item) => (
                <div key={item.label} className="space-y-3">
                  <p className="text-sm font-medium">{item.label}</p>
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={notifications[item.emailKey]}
                        onCheckedChange={(v) =>
                          setNotifications((n) => ({ ...n, [item.emailKey]: v }))
                        }
                      />
                      <Label className="text-sm text-muted-foreground">Email</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={notifications[item.pushKey]}
                        onCheckedChange={(v) =>
                          setNotifications((n) => ({ ...n, [item.pushKey]: v }))
                        }
                      />
                      <Label className="text-sm text-muted-foreground">Push</Label>
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
