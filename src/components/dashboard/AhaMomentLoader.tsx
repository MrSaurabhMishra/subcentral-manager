import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const funFacts = [
  "Did you know the average person wastes $200/year on forgotten subs? 💸",
  "70% of people forget at least one active subscription they never use! 🤯",
  "You could save enough for a vacation just by pausing unused subs! ✈️",
  "The average household has 12 active subscriptions! 📱",
  "Americans spend over $219/month on subscriptions on average! 💰",
];

const STORAGE_KEY = "subcentral-aha-shown";

export function AhaMomentLoader({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);
  const fact = funFacts[Math.floor(Math.random() * funFacts.length)];

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 400);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="text-center max-w-md space-y-5"
          >
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <p className="text-lg font-semibold leading-relaxed">{fact}</p>
            <div className="flex gap-1 justify-center">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="h-2 w-2 rounded-full bg-primary"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useAhaMoment() {
  const [shouldShow, setShouldShow] = useState(() => {
    return !localStorage.getItem(STORAGE_KEY);
  });

  const markShown = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setShouldShow(false);
  };

  return { shouldShow, markShown };
}
