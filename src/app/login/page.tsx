"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { Logo } from "@/components/logo";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-muted/30 px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(45,70,185,0.05),_transparent_50%)]"
      />
      
      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <Logo href={null} className="mb-2" />
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Sign in to your account
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter your password to access the dashboard
          </p>
        </div>

        <Card className="border-border/60 shadow-lg shadow-foreground/5">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg font-semibold">Password Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••••••"
                  autoFocus
                  required
                  className="w-full bg-muted/10 border-border/60 focus:border-primary"
                />
              </div>

              {state?.error && (
                <Alert variant="destructive" className="py-2.5">
                  <AlertDescription className="text-xs font-medium">
                    {state.error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full font-semibold"
                disabled={isPending}
              >
                {isPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
