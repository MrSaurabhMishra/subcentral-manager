import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import Subscriptions from "./pages/Subscriptions";
import Plans from "./pages/Plans";
import SharedAccounts from "./pages/SharedAccounts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/shared" element={<SharedAccounts />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LocaleProvider>
        <SubscriptionProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppLayout>
              <AnimatedRoutes />
            </AppLayout>
          </BrowserRouter>
        </SubscriptionProvider>
      </LocaleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
