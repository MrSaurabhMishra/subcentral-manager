import { StatCards } from "@/components/dashboard/StatCards";
import { SubscriptionTable } from "@/components/dashboard/SubscriptionTable";
import { UsageAlerts } from "@/components/dashboard/UsageAlerts";
import { DailyPoll } from "@/components/dashboard/DailyPoll";
import { UpcomingRenewals } from "@/components/dashboard/UpcomingRenewals";
import { useLocale } from "@/contexts/LocaleContext";

const Dashboard = () => {
  const { t } = useLocale();

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t("dashboard.subtitle")}</p>
      </div>

      <DailyPoll />
      <StatCards />
      <UpcomingRenewals />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <SubscriptionTable />
        <UsageAlerts />
      </div>
    </div>
  );
};

export default Dashboard;
