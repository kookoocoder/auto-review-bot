"use client";

import { useActionState, useEffect, useRef } from "react";
import { createUserAction } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function CreateUserForm() {
  const [state, formAction, isPending] = useActionState(createUserAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="username">Username / Staff Name</Label>
        <Input
          id="username"
          name="username"
          placeholder="e.g. staff_cafe"
          required
          className="bg-muted/10 border-border/60"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Unique Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          className="bg-muted/10 border-border/60"
        />
      </div>

      {state?.error && (
        <Alert variant="destructive" className="py-2.5">
          <AlertDescription className="text-xs font-medium">
            {state.error}
          </AlertDescription>
        </Alert>
      )}

      {state?.success && (
        <Alert variant="default" className="py-2.5 border-success/30 bg-success/10 text-success-foreground">
          <AlertDescription className="text-xs font-medium">
            Staff account created successfully!
          </AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full font-semibold" disabled={isPending}>
        {isPending ? "Creating..." : "Create Staff Account"}
      </Button>
    </form>
  );
}
