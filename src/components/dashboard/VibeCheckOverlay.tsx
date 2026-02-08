import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X, Sparkles, Check, ArrowRight } from "lucide-react";
import { useSubscriptions } from "@/contexts/SubscriptionContext";
import { useLocale } from "@/contexts/LocaleContext";

const tones = ["funny", "cringe", "romantic"] as const;

function generateQuestion(service: string, tone: typeof tones[number], locale: string): string {
  const isHi = locale === "hi";
  const templates: Record<typeof tones[number], string[]> = {
    funny: isHi
      ? [`बाबू, आज ${service} खोला भी? 😏`, `${service} ने आज तुम्हें देखा क्या? 🤣`, `${service} आज बोर हो रहा तुम्हारे बिना! 😴`]
      : [`Did you even open ${service} today? 😏`, `Was ${service} lonely without you? 🤣`, `${service} is crying in the corner. Did you visit? 😭`],
    cringe: isHi
      ? [`${service} ने पूछा — "मैं तुम्हारे लिए कुछ हूँ?" 🥺`, `आज ${service} को कितना प्यार दिया? 💕`, `${service} बोला: "notice me senpai!" 😬`]
      : [`${service} asked: "Am I nothing to you?" 🥺`, `How much love did you give ${service} today? 💕`, `${service} says: "Notice me senpai!" 😬`],
    romantic: isHi
      ? [`आज ${service} के साथ कितना वक्त बिताया, जानू? 💖`, `${service} और तुम — आज की love story? 🌹`, `बताओ, ${service} के साथ आज romance हुआ? 😘`]
      : [`How much quality time with ${service} today, darling? 💖`, `${service} and you — today's love story? 🌹`, `Tell me about your romance with ${service} today 😘`],
  };
  const list = templates[tone];
  return list[Math.floor(Math.random() * list.length)];
}

export function VibeCheckOverlay() {
  const { subscriptions, logUsage, shouldShowVibeCheck, dismissVibeCheck } = useSubscriptions();
  const { locale } = useLocale();

  const activeSubs = useMemo(() => subscriptions.filter(s => s.status === "active"), [subscriptions]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hours, setHours] = useState([1]);
  const [done, setDone] = useState(false);

  const questions = useMemo(() =>
    activeSubs.map(sub => {
      const tone = tones[Math.floor(Math.random() * tones.length)];
      return { sub, question: generateQuestion(sub.service, tone, locale) };
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeSubs.length, locale]
  );

  if (!shouldShowVibeCheck || activeSubs.length === 0) return null;

  const current = questions[currentIndex];
  const isLast = currentIndex >= questions.length - 1;

  const handleNext = () => {
    logUsage(current.sub.id, hours[0]);
    if (isLast) {
      setDone(true);
      setTimeout(dismissVibeCheck, 2000);
    } else {
      setCurrentIndex(i => i + 1);
      setHours([1]);
    }
  };

  const handleSkip = () => {
    if (isLast) {
      setDone(true);
      setTimeout(dismissVibeCheck, 2000);
    } else {
      setCurrentIndex(i => i + 1);
      setHours([1]);
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
        className="bg-card rounded-2xl shadow-2xl border border-border w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-muted-foreground">
              {locale === "hi" ? "डेली वाइब चेक" : "Daily Vibe Check"} ({currentIndex + 1}/{questions.length})
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
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-2xl shrink-0">
                    {current.sub.icon || <span className="text-base font-bold text-muted-foreground">{current.sub.service[0]}</span>}
                  </div>
                  <p className="font-bold text-lg leading-snug">{current.question}</p>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0h</span>
                    <span className="font-semibold text-sm text-foreground">{hours[0]}h</span>
                    <span>8h</span>
                  </div>
                  <Slider value={hours} onValueChange={setHours} max={8} step={0.5} className="w-full" />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={handleSkip}>
                    {locale === "hi" ? "छोड़ें" : "Skip"}
                  </Button>
                  <Button size="sm" className="flex-1 gap-1.5" onClick={handleNext}>
                    {isLast ? (locale === "hi" ? "पूरा करें" : "Finish") : (locale === "hi" ? "अगला" : "Next")}
                    {isLast ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                <Check className="h-10 w-10 text-success mx-auto mb-3" />
                <p className="text-lg font-bold">{locale === "hi" ? "धन्यवाद! 🙏" : "Thanks for your cooperation! ✨"}</p>
                <p className="text-sm text-muted-foreground mt-1">{locale === "hi" ? "आपका डेटा अपडेट हो गया" : "Your usage data is updated"}</p>
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
