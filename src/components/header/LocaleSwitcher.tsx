import { useState, useMemo } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { locales, LocaleConfig } from "@/lib/locales";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Globe, Search, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function LocaleSwitcher() {
  const { localeConfig, setLocaleConfig } = useLocale();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return locales;
    const q = search.toLowerCase();
    return locales.filter(l =>
      l.label.toLowerCase().includes(q) ||
      l.currency.toLowerCase().includes(q) ||
      l.code.includes(q)
    );
  }, [search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 gap-1.5 px-2 text-xs font-medium">
          <Globe className="h-3.5 w-3.5" />
          <span>{localeConfig.flag} {localeConfig.currency}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <div className="p-2 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search country..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs border-0 bg-muted/50"
            />
          </div>
        </div>
        <ScrollArea className="h-64">
          <div className="p-1">
            {filtered.map(l => (
              <button
                key={l.code}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs hover:bg-muted transition-colors text-left"
                onClick={() => { setLocaleConfig(l); setOpen(false); setSearch(""); }}
              >
                <span className="text-base">{l.flag}</span>
                <span className="flex-1 truncate">{l.label}</span>
                <span className="text-muted-foreground">{l.currencySymbol}</span>
                {l.code === localeConfig.code && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
