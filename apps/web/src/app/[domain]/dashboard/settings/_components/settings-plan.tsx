"use client";

import { Button } from "@cykani/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@cykani/ui/card";
import { Label } from "@cykani/ui/label";
import { RadioGroup, RadioGroupItem } from "@cykani/ui/radio-group";
import { useEffect, useState } from "react";

import { api } from "@cykani/lib/api/client";

interface PlanData {
  id: string;
  name: string;
  limits: { maxSessions: number; maxProfiles: number };
}

export function SettingsPlan() {
  const [org, setOrg] = useState<any>(null);
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<"lemonsqueezy" | "stripe">("lemonsqueezy");

  useEffect(() => {
    async function load() {
      try {
        const [orgRes, plansRes] = await Promise.all([
          api.orgs.me(),
          api.billing.plans(),
        ]);
        setOrg(orgRes.org);
        setPlans(plansRes.plans);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load plan");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleChangePlan(planId: string) {
    if (planId === org?.plan) return;
    setUpgrading(planId);
    try {
      const res = await api.billing.checkout({ plan: planId, provider });
      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else {
        setOrg((prev: any) => ({ ...prev, plan: res.subscription?.plan ?? planId }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to change plan");
    } finally {
      setUpgrading(null);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Plan</CardTitle>
          <CardDescription>Current subscription plan</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading plan...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Plan</CardTitle>
          <CardDescription>Current subscription plan</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  const currentPlan = plans.find((p) => p.id === org?.plan) ?? plans[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan</CardTitle>
        <CardDescription>Current subscription plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{currentPlan?.name ?? "Free"}</p>
            <p className="text-sm text-muted-foreground">
              {currentPlan?.limits.maxSessions} sessions / {currentPlan?.limits.maxProfiles} profiles
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-medium text-xs">Payment Provider</Label>
          <RadioGroup value={provider} onValueChange={(v: "lemonsqueezy" | "stripe") => setProvider(v)}>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="lemonsqueezy" id="lemonsqueezy" />
              <Label htmlFor="lemonsqueezy" className="text-xs">LemonSqueezy (subscription)</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="stripe" id="stripe" />
              <Label htmlFor="stripe" className="text-xs">Stripe (subscription)</Label>
            </div>
          </RadioGroup>
        </div>

        {plans.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {plans.map((plan) => (
              <Button
                key={plan.id}
                variant={org?.plan === plan.id ? "default" : "outline"}
                size="sm"
                disabled={upgrading !== null || org?.plan === plan.id}
                onClick={() => handleChangePlan(plan.id)}
              >
                {upgrading === plan.id ? "Redirecting..." : plan.name}
              </Button>
            ))}
          </div>
        )}

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">
            Prefer to support the project? Donate via Ko-fi:
          </p>
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a href="https://ko-fi.com/your-username" target="_blank" rel="noopener noreferrer">
              Donate on Ko-fi
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
