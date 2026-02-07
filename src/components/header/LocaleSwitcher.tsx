import { useLocale, Locale } from "@/contexts/LocaleContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

const options: { value: Locale; label: string }[] = [
  { value: "en", label: "EN ($)" },
  { value: "hi", label: "HI (₹)" },
];

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center">
      <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
        <SelectTrigger className="h-9 w-[90px] gap-1 border-0 bg-muted/50 text-xs font-medium">
          <Globe className="h-3.5 w-3.5" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value} className="text-xs">
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
