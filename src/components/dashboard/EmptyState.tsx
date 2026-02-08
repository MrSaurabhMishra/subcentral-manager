import { Plus, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocale } from "@/contexts/LocaleContext";

interface Props {
  onAdd: () => void;
}

export function EmptyState({ onAdd }: Props) {
  const { locale } = useLocale();

  return (
    <Card className="glass-card">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
          <CreditCard className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">
          {locale === "hi" ? "कोई सब्सक्रिप्शन नहीं" : "No Subscriptions Yet"}
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          {locale === "hi"
            ? "अपना पहला सब्सक्रिप्शन जोड़ें और अपने खर्चों को ट्रैक करना शुरू करें"
            : "Add your first subscription to start tracking your spending, usage, and savings."}
        </p>
        <Button size="lg" className="gap-2" onClick={onAdd}>
          <Plus className="h-5 w-5" />
          {locale === "hi" ? "सब्सक्रिप्शन जोड़ें" : "Add Subscription"}
        </Button>
      </CardContent>
    </Card>
  );
}
