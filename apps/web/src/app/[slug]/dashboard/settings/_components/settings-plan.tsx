"use client";

import { useEffect, useState } from "react";

import { api } from "@/lib/api/client";
import { Button } from "@/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";

interface PlanData {
  id: string;
  name: string;
  limits: { maxSessions: number; maxProfiles: number };
  price: number;
}

export function SettingsPlan() {
  const [org, setOrg] = useState<any>(null);
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [orgRes, plansRes] = await Promise.all([api.orgs.me(), api.billing.plans()]);
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
      const res = await api.billing.checkout({ plan: planId });
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
          <p className="text-muted-foreground text-sm">Loading plan...</p>
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
          <p className="text-red-500 text-sm">{error}</p>
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
            <p className="text-muted-foreground text-sm">
              {currentPlan?.limits.maxSessions} sessions / {currentPlan?.limits.maxProfiles} profiles
            </p>
          </div>
          {currentPlan && currentPlan.price > 0 && (
            <p className="font-medium text-lg">${currentPlan.price}/mo</p>
          )}
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
      </CardContent>
    </Card>
  );
}
