import { AdminLayout } from "@/components/admin/AdminLayout";
import { MetricCard } from "@/components/admin/MetricCard";
import { DataTable } from "@/components/admin/DataTable";
import { ChartCard } from "@/components/admin/ChartCard";
import { Button } from "@/components/ui/button";
import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Plus,
  Download,
} from "lucide-react";

const metricsData = [
  {
    title: "Total Users",
    value: "2,847",
    change: "+12% from last month",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Revenue",
    value: "$84,290",
    change: "+8% from last month",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "Growth Rate",
    value: "+23.4%",
    change: "+2.1% from last month",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
  {
    title: "Active Sessions",
    value: "1,432",
    change: "-3% from last month",
    changeType: "negative" as const,
    icon: Activity,
  },
];

const recentUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "active" as const,
    date: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "pending" as const,
    date: "2024-01-14",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    status: "active" as const,
    date: "2024-01-13",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    status: "inactive" as const,
    date: "2024-01-12",
  },
];

const recentOrders = [
  {
    id: "1",
    name: "Order #12345",
    status: "active" as const,
    date: "2024-01-15",
    amount: "$299.00",
  },
  {
    id: "2",
    name: "Order #12346",
    status: "pending" as const,
    date: "2024-01-14",
    amount: "$199.00",
  },
  {
    id: "3",
    name: "Order #12347",
    status: "active" as const,
    date: "2024-01-13",
    amount: "$399.00",
  },
];

const chartData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
  { name: "Jun", value: 900 },
];

const lineChartData = [
  { name: "Week 1", value: 120 },
  { name: "Week 2", value: 190 },
  { name: "Week 3", value: 300 },
  { name: "Week 4", value: 250 },
  { name: "Week 5", value: 400 },
  { name: "Week 6", value: 350 },
];

export default function Index() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your business.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New User
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metricsData.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              changeType={metric.changeType}
              icon={metric.icon}
            />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard title="Monthly Revenue" data={chartData} type="bar" />
          <ChartCard title="User Growth" data={lineChartData} type="area" />
        </div>

        {/* Data Tables Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <DataTable title="Recent Users" data={recentUsers} />
          <DataTable title="Recent Orders" data={recentOrders} />
        </div>
      </div>
    </AdminLayout>
  );
}
