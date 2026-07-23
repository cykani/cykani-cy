"use client";

import { Download } from "lucide-react";

import { Button } from "@/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";

import type { RecentCustomerRow } from "./recent-customers-table/schema";
import { RecentCustomersTable } from "./recent-customers-table/table";

interface SubscriberOverviewProps {
  readonly data: RecentCustomerRow[];
}

export function SubscriberOverview({ data }: SubscriberOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="leading-none">18,426 Customers</CardTitle>
        <CardDescription>Recent customer records with plan, billing, status, and signup activity.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            <Download />
            Export
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="pt-0">
        <RecentCustomersTable data={data} />
      </CardContent>
    </Card>
  );
}
