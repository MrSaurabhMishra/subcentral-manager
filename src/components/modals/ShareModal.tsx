import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SHARE_URL = "https://subcentral.app";
const SHARE_TEXT = "Check out SubCentral — the smartest way to manage your subscriptions! 🚀";

function logShareEvent(platform: string) {
  try {
    const logs = JSON.parse(localStorage.getItem("subcentral-share-logs") || "[]");
    logs.push({ platform, timestamp: new Date().toISOString() });
    localStorage.setItem("subcentral-share-logs", JSON.stringify(logs));
  } catch {}
}

export function ShareModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [copied, setCopied] = useState(false);

  const shareWhatsApp = () => {
    logShareEvent("whatsapp");
    window.open(`https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + " " + SHARE_URL)}`, "_blank");
  };

  const shareTwitter = () => {
    logShareEvent("twitter");
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}`, "_blank");
  };

  const shareLinkedIn = () => {
    logShareEvent("linkedin");
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`, "_blank");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(SHARE_URL);
    logShareEvent("copy_link");
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Share SubCentral</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">Spread the word and help others manage their subs!</p>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button variant="outline" className="gap-2" onClick={shareWhatsApp}>
            💬 WhatsApp
          </Button>
          <Button variant="outline" className="gap-2" onClick={shareTwitter}>
            🐦 Twitter
          </Button>
          <Button variant="outline" className="gap-2" onClick={shareLinkedIn}>
            💼 LinkedIn
          </Button>
          <Button variant="outline" className="gap-2" onClick={copyLink}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy Link"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
