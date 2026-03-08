import { StatsCards } from '@/components/dashboard/StatsCards';
import { LoginChart } from '@/components/dashboard/LoginChart';
import { RecentEvents } from '@/components/dashboard/RecentEvents';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">Overview of your IAM platform</p>
      </div>
      <StatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LoginChart />
        <RecentEvents />
      </div>
    </div>
  );
}
