import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Sparkles, Check, ArrowRight, ThumbsUp, ThumbsDown } from "lucide-react";
import { useSubscriptions } from "@/contexts/SubscriptionContext";

export function VibeCheckOverlay() {
  const { subscriptions, logUsage, shouldShowVibeCheck, dismissVibeCheck } = useSubscriptions();

  const activeSubs = useMemo(() => subscriptions.filter(s => s.status === "active"), [subscriptions]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [done, setDone] = useState(false);

  const questions = useMemo(() =>
    activeSubs.map(sub => ({
      sub,
      question: `Did you and your beloved ${sub.service} hang out today?`,
    })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeSubs.length]
  );

  if (!shouldShowVibeCheck || activeSubs.length === 0) return null;

  const current = questions[currentIndex];
  const isLast = currentIndex >= questions.length - 1;

  const handleAnswer = (usedToday: boolean) => {
    logUsage(current.sub.id, usedToday ? 1 : 0);
    if (isLast) {
      setDone(true);
      setTimeout(dismissVibeCheck, 2000);
    } else {
      setCurrentIndex(i => i + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card rounded-xl shadow-2xl border border-border w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-muted-foreground">
              Daily Vibe Check ({currentIndex + 1}/{questions.length})
            </span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={dismissVibeCheck}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-5 pt-3">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div key={currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-2xl shrink-0">
                    {current.sub.icon || <span className="text-base font-bold text-muted-foreground">{current.sub.service[0]}</span>}
                  </div>
                  <p className="font-bold text-lg leading-snug">{current.question}</p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 gap-2 h-12 text-base"
                    onClick={() => handleAnswer(false)}
                  >
                    <ThumbsDown className="h-5 w-5" /> No
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1 gap-2 h-12 text-base"
                    onClick={() => handleAnswer(true)}
                  >
                    <ThumbsUp className="h-5 w-5" /> Yes
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                <Check className="h-10 w-10 text-success mx-auto mb-3" />
                <p className="text-lg font-bold">Thanks for your cooperation! ✨</p>
                <p className="text-sm text-muted-foreground mt-1">Your usage data is updated</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!done && (
          <div className="px-5 pb-4">
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= currentIndex ? "bg-primary" : "bg-muted"}`} />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
