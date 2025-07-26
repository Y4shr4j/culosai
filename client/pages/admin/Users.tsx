import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";

const usersData = [
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
    status: "active" as const,
    date: "2024-01-14",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    status: "pending" as const,
    date: "2024-01-13",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    status: "inactive" as const,
    date: "2024-01-12",
  },
  {
    id: "5",
    name: "David Brown",
    email: "david@example.com",
    status: "active" as const,
    date: "2024-01-11",
  },
  {
    id: "6",
    name: "Lisa Garcia",
    email: "lisa@example.com",
    status: "pending" as const,
    date: "2024-01-10",
  },
];

export default function Users() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Users</h1>
            <p className="text-muted-foreground">
              Manage and monitor user accounts across your platform.
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-10" />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Users Table */}
        <DataTable title="All Users" data={usersData} />
      </div>
    </AdminLayout>
  );
}
