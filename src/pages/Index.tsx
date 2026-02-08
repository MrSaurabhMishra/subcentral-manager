import { useState } from "react";
import { StatCards } from "@/components/dashboard/StatCards";
import { SubscriptionTable } from "@/components/dashboard/SubscriptionTable";
import { UsageAlerts } from "@/components/dashboard/UsageAlerts";
import { UpcomingRenewals } from "@/components/dashboard/UpcomingRenewals";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { SubscriptionDeepDive } from "@/components/dashboard/SubscriptionDeepDive";
import { AddSubscriptionModal } from "@/components/dashboard/AddSubscriptionModal";
import { VibeCheckOverlay } from "@/components/dashboard/VibeCheckOverlay";
import { useLocale } from "@/contexts/LocaleContext";
import { useSubscriptions } from "@/contexts/SubscriptionContext";

const Dashboard = () => {
  const { t } = useLocale();
  const { subscriptions, selectedSubId } = useSubscriptions();
  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const selectedSub = selectedSubId ? subscriptions.find(s => s.id === selectedSubId) : null;

  return (
    <>
      <VibeCheckOverlay />
      <div className="space-y-6 max-w-7xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("dashboard.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("dashboard.subtitle")}</p>
        </div>

        {subscriptions.length === 0 ? (
          <EmptyState onAdd={() => setAddOpen(true)} />
        ) : (
          <>
            <StatCards />

            {selectedSub ? (
              <SubscriptionDeepDive sub={selectedSub} />
            ) : (
              <>
                <UpcomingRenewals />
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
                  <SubscriptionTable />
                  <UsageAlerts />
                </div>
              </>
            )}
          </>
        )}
      </div>

      <AddSubscriptionModal open={addOpen || !!editId} onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditId(null); } }} editId={editId} />
    </>
  );
};

export default Dashboard;
