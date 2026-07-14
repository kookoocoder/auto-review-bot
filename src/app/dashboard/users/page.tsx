import { getConvexClient } from "@/lib/convex";
import { api } from "../../../../convex/_generated/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CreateUserForm } from "./create-user-form";
import { UserRow } from "./user-row";

export default async function UsersPage() {
  const client = getConvexClient();

  // Load all data
  const users = await client.query(api.users.list);
  const businesses = await client.query(api.businesses.list, { ownerId: "demo-owner" });
  
  // Load services for all businesses
  const services: any[] = [];
  for (const b of businesses) {
    const businessServices = await client.query(api.services.listForBusiness, { businessId: b._id });
    services.push(...businessServices.map((s) => ({ ...s, businessName: b.name })));
  }

  const assignments = await client.query(api.assignments.listAll);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create staff accounts, set passwords, and assign them to specific businesses and services.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Create Staff Account</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateUserForm />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Staff Accounts ({users.length})</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border/60 p-0">
              {users.map((user) => {
                const userAssignments = assignments.filter((a) => a.user_id === user._id);
                return (
                  <UserRow
                    key={user._id}
                    user={user}
                    businesses={businesses}
                    services={services}
                    assignments={userAssignments}
                  />
                );
              })}

              {users.length === 0 && (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No staff accounts created yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
