import { StatCards } from "@/components/dashboard/StatCards";
import { SubscriptionTable } from "@/components/dashboard/SubscriptionTable";
import { UsageAlerts } from "@/components/dashboard/UsageAlerts";

const Dashboard = () => {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of your subscription spending
        </p>
      </div>

      <StatCards />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <SubscriptionTable />
        <UsageAlerts />
      </div>
    </div>
  );
};

export default Dashboard;
