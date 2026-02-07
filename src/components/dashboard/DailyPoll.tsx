import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useLocale, getPollQuestions } from "@/contexts/LocaleContext";
import { Sparkles, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function DailyPoll() {
  const { locale, t } = useLocale();
  const [hours, setHours] = useState([2]);
  const [submitted, setSubmitted] = useState(false);

  const question = useMemo(() => {
    const questions = getPollQuestions(locale);
    const dayIndex = new Date().getDate() % questions.length;
    return questions[dayIndex];
  }, [locale]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="glass-card overflow-hidden border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        <CardContent className="p-5 sm:p-6 relative">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-xl bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-base sm:text-lg leading-snug">{question}</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div key="form" exit={{ opacity: 0, scale: 0.95 }} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0h</span>
                    <span className="font-semibold text-sm text-foreground">{hours[0]}h</span>
                    <span>5h</span>
                  </div>
                  <Slider
                    value={hours}
                    onValueChange={setHours}
                    max={5}
                    step={0.5}
                    className="w-full"
                  />
                </div>
                <Button size="sm" onClick={() => setSubmitted(true)} className="w-full sm:w-auto">
                  {t("poll.logUsage")} — {hours[0]} {t("poll.hours")}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-success font-medium"
              >
                <Check className="h-5 w-5" />
                {t("poll.logged")} ✨
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
