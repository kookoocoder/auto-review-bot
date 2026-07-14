"use client";

import { useTransition } from "react";
import { deleteUserAction, toggleAssignmentAction } from "./actions";
import { Button } from "@/components/ui/button";
import { IconTrash } from "@/components/icons";

type Business = {
  _id: string;
  name: string;
};

type Service = {
  _id: string;
  name: string;
  businessName: string;
};

type Assignment = {
  _id: string;
  user_id: string;
  target_id: string;
  type: "business" | "service";
};

type Props = {
  user: {
    _id: string;
    username: string;
    created_at: number;
  };
  businesses: Business[];
  services: Service[];
  assignments: Assignment[];
};

export function UserRow({ user, businesses, services, assignments }: Props) {
  const [isPending, startTransition] = useTransition();

  const assignedTargetIds = new Set(assignments.map((a) => a.target_id));

  const handleToggle = (targetId: string, type: "business" | "service", checked: boolean) => {
    startTransition(async () => {
      await toggleAssignmentAction(user._id, targetId, type, checked);
    });
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete staff account "${user.username}"?`)) {
      startTransition(async () => {
        await deleteUserAction(user._id);
      });
    }
  };

  return (
    <div className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-6 opacity-90 hover:opacity-100 transition-opacity">
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
            {user.username.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{user.username}</h3>
            <p className="text-xs text-muted-foreground">
              Created {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Businesses Assignment */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Assign Businesses
            </h4>
            <div className="max-h-40 overflow-y-auto border border-border/40 rounded-lg p-2 space-y-1 bg-muted/5">
              {businesses.map((b) => {
                const isChecked = assignedTargetIds.has(b._id);
                return (
                  <label
                    key={b._id}
                    className="flex items-center gap-2 text-sm text-foreground hover:bg-muted/30 p-1 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={isPending}
                      onChange={(e) => handleToggle(b._id, "business", e.target.checked)}
                      className="rounded border-border/60 text-primary focus:ring-primary h-3.5 w-3.5"
                    />
                    <span className="truncate">{b.name}</span>
                  </label>
                );
              })}
              {businesses.length === 0 && (
                <p className="text-xs text-muted-foreground p-1">No businesses available.</p>
              )}
            </div>
          </div>

          {/* Services Assignment */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Assign Services
            </h4>
            <div className="max-h-40 overflow-y-auto border border-border/40 rounded-lg p-2 space-y-1 bg-muted/5">
              {services.map((s) => {
                const isChecked = assignedTargetIds.has(s._id);
                return (
                  <label
                    key={s._id}
                    className="flex items-center gap-2 text-sm text-foreground hover:bg-muted/30 p-1 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={isPending}
                      onChange={(e) => handleToggle(s._id, "service", e.target.checked)}
                      className="rounded border-border/60 text-primary focus:ring-primary h-3.5 w-3.5"
                    />
                    <span className="truncate">
                      {s.name} <span className="text-muted-foreground text-xs">({s.businessName})</span>
                    </span>
                  </label>
                );
              })}
              {services.length === 0 && (
                <p className="text-xs text-muted-foreground p-1">No services available.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDelete}
          disabled={isPending}
          className="text-destructive hover:bg-destructive/10 border-destructive/20"
        >
          <IconTrash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
