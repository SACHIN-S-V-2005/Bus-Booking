import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { routes, trips, buses } from "@/lib/data";
import { Bus, Route as RouteIcon, Ticket } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
            <RouteIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{routes.length}</div>
            <p className="text-xs text-muted-foreground">
              Managed routes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips Scheduled</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trips.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all routes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Buses</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buses.length}</div>
            <p className="text-xs text-muted-foreground">
              In the fleet
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <h2 className="font-headline text-2xl font-bold mb-4">Quick Actions</h2>
        <p className="text-muted-foreground">
          Use the sidebar to manage routes, trips, buses, and predict fares.
        </p>
      </div>
    </div>
  );
}
