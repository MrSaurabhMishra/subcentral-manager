import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function FeedbackModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    try {
      const feedbacks = JSON.parse(localStorage.getItem("subcentral-feedback") || "[]");
      feedbacks.push({ rating, text, timestamp: new Date().toISOString() });
      localStorage.setItem("subcentral-feedback", JSON.stringify(feedbacks));
    } catch {}
    toast.success("Thank you for your feedback! 🎉");
    setRating(0);
    setText("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Give Feedback</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map(s => (
              <button
                key={s}
                onClick={() => setRating(s)}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    "h-8 w-8 transition-colors",
                    (hover || rating) >= s
                      ? "fill-warning text-warning"
                      : "text-muted-foreground/30"
                  )}
                />
              </button>
            ))}
          </div>
          <Textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Tell us what you think..."
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
