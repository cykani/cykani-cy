import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader } from "@/ui/card";

export function KpiCards() {
  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-3xl tracking-tight">Workspace Overview</h2>
        <p className="text-muted-foreground text-sm">
          Real-time metrics across browser sessions, proxy pools, and automated workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Active Browser Sessions</CardDescription>
            <CardAction>
              <ArrowUpRight className="size-4" />
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none tracking-tight">1,247</span>

              <Badge
                variant="outline"
                className="border-green-200 bg-green-500/10 text-green-700 dark:border-green-900/40 dark:bg-green-500/15 dark:text-green-300"
              >
                <TrendingUp />
                +12%
              </Badge>
            </div>
            <p className="text-sm">
              <span className="font-medium text-foreground">1,112</span>{" "}
              <span className="text-muted-foreground">last month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Profile Success Rate</CardDescription>
            <CardAction>
              <ArrowUpRight className="size-4" />
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none tracking-tight">94.2%</span>

              <Badge variant="outline" className="border-destructive/20 bg-destructive/10 text-destructive">
                <TrendingDown />
                -2.5%
              </Badge>
            </div>
            <p className="text-sm">
              <span className="font-medium text-foreground">96.7%</span>{" "}
              <span className="text-muted-foreground">last month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Active Proxies</CardDescription>
            <CardAction>
              <ArrowUpRight className="size-4" />
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none tracking-tight">86</span>

              <Badge
                variant="outline"
                className="border-green-200 bg-green-500/10 text-green-700 dark:border-green-900/40 dark:bg-green-500/15 dark:text-green-300"
              >
                <TrendingUp />
                +7
              </Badge>
            </div>
            <p className="text-sm">
              <span className="font-medium text-foreground">79</span>{" "}
              <span className="text-muted-foreground">last month</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Task Completion Rate</CardDescription>
            <CardAction>
              <ArrowUpRight className="size-4" />
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none tracking-tight">76.3%</span>

              <Badge
                variant="outline"
                className="border-green-200 bg-green-500/10 text-green-700 dark:border-green-900/40 dark:bg-green-500/15 dark:text-green-300"
              >
                <TrendingUp />
                +1.6%
              </Badge>
            </div>
            <p className="text-sm">
              <span className="font-medium text-foreground">74.7%</span>{" "}
              <span className="text-muted-foreground">last month</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
