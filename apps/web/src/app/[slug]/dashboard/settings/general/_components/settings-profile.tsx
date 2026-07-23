"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";

export function SettingsProfile() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your name and email address</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label className="font-medium text-xs">Name</Label>
          <Input value={user?.name || ""} disabled className="text-xs" />
        </div>
        <div className="space-y-1">
          <Label className="font-medium text-xs">Email</Label>
          <Input value={user?.email || ""} disabled className="text-xs" />
        </div>
      </CardContent>
    </Card>
  );
}
