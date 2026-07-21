"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@cykani/ui/card";
import { Label } from "@cykani/ui/label";
import { Input } from "@cykani/ui/input";
import { Button } from "@cykani/ui/button";
import { useState } from "react";

import { ComingSoonOverlay } from "../../_components/coming-soon-overlay";

export function SettingsEmail() {
  const [enabled, setEnabled] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email</CardTitle>
        <CardDescription>Email service configuration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium text-xs">Email Service</Label>
            <p className="text-xs text-muted-foreground">Enable transactional emails (license keys, receipts)</p>
          </div>
          <Button
            variant={enabled ? "default" : "outline"}
            size="sm"
            onClick={() => setEnabled(!enabled)}
          >
            {enabled ? "Enabled" : "Disabled"}
          </Button>
        </div>

        <div className="grid gap-3">
          <div className="space-y-1">
            <Label className="font-medium text-xs">SMTP Provider</Label>
            <Input value="Listmonk" disabled className="text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="font-medium text-xs">From Address</Label>
            <Input value="noreply@cykani.app" disabled className="text-xs" />
          </div>
        </div>

        <ComingSoonOverlay>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Email service requires Listmonk to be running.</p>
            <code className="text-xs bg-muted px-2 py-1 rounded">docker compose -f docker-compose.email.yml up -d</code>
          </div>
        </ComingSoonOverlay>
      </CardContent>
    </Card>
  );
}
