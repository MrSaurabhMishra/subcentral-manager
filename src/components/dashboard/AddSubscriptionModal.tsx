import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { useTier } from "@/contexts/TierContext";
import { useLocale } from "@/contexts/LocaleContext";
import { toast } from "sonner";

const categories = ["Entertainment", "Music", "Design", "AI", "Dev Tools", "Productivity", "Storage", "Career", "Writing", "Finance", "Health", "Education", "Other"];

const knownLogos: Record<string, string> = {
  netflix: "🎬", spotify: "🎵", figma: "🎨", chatgpt: "🤖", github: "💻",
  adobe: "🖌️", notion: "📝", icloud: "☁️", linkedin: "💼", grammarly: "✍️",
  youtube: "📺", slack: "💬", discord: "🎮", zoom: "📹", dropbox: "📦",
  canva: "🎯", trello: "📋", aws: "🌐", heroku: "🚀", vercel: "▲",
};

function getIcon(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(knownLogos)) {
    if (lower.includes(key)) return icon;
  }
  return "";
}

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editId?: string | null;
}

export function AddSubscriptionModal({ open, onOpenChange, editId }: Props) {
  const { subscriptions, addSubscription, updateSubscription, deleteSubscription } = useSubscriptions();
  const { canAddSubscription } = useTier();
  const { formatCurrency } = useLocale();

  const existing = editId ? subscriptions.find(s => s.id === editId) : null;

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Entertainment");
  const [cost, setCost] = useState("");
  const [renewal, setRenewal] = useState("");
  const [shared, setShared] = useState("");
  const [status, setStatus] = useState<"active" | "paused">("active");

  // Reset form when modal opens/editId changes
  useEffect(() => {
    if (open) {
      const e = editId ? subscriptions.find(s => s.id === editId) : null;
      setName(e?.service || "");
      setCategory(e?.category || "Entertainment");
      setCost(e?.monthlyCost?.toString() || "");
      setRenewal(e?.nextBilling || "");
      setShared(e?.sharedWith?.join(", ") || "");
      setStatus(e?.status || "active");
    }
  }, [open, editId, subscriptions]);

  const handleSave = () => {
    if (!name.trim() || !cost) return;

    // Date validation: no past dates
    if (renewal && renewal < getTodayString()) {
      toast.error("Renewal date cannot be in the past.");
      return;
    }

    if (!editId && !canAddSubscription(subscriptions.length)) {
      toast.error("Subscription limit reached! Upgrade your plan to add more.");
      return;
    }

    const icon = getIcon(name);
    const sharedArr = shared.split(",").map(s => s.trim()).filter(Boolean);
    const data = {
      service: name.trim(),
      icon,
      status,
      nextBilling: status === "paused" ? "—" : renewal,
      monthlyCost: parseFloat(cost),
      lastUsed: existing?.lastUsed || "Never",
      currentMonthUsage: existing?.currentMonthUsage || "0 days",
      shared: sharedArr.length > 0,
      sharedWith: sharedArr.length > 0 ? sharedArr : undefined,
      category,
    };

    if (editId && existing) {
      updateSubscription(editId, data);
      toast.success("Subscription updated!");
    } else {
      addSubscription(data);
      toast.success("Subscription added!");
    }
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (editId) {
      deleteSubscription(editId);
      toast.success("Subscription deleted.");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editId ? "Edit Subscription" : "Add Subscription"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Service Name</Label>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">
                {getIcon(name) || (name ? <span className="text-sm font-bold text-muted-foreground">{name[0]?.toUpperCase()}</span> : "?")}
              </div>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Netflix, Spotify..." />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Monthly Cost</Label>
              <Input type="number" step="0.01" value={cost} onChange={e => setCost(e.target.value)} placeholder="9.99" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Renewal Date</Label>
              <Input type="date" value={renewal} onChange={e => setRenewal(e.target.value)} min={getTodayString()} />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={v => setStatus(v as "active" | "paused")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Shared With (comma-separated)</Label>
            <Input value={shared} onChange={e => setShared(e.target.value)} placeholder="Alice, Bob, Team" />
          </div>
        </div>
        <DialogFooter className="flex-row justify-between sm:justify-between">
          {editId && (
            <Button variant="destructive" size="sm" onClick={handleDelete}>Delete</Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!name.trim() || !cost}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
