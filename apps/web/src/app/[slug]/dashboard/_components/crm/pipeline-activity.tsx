"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@cykani/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@cykani/ui/chart";
import { Progress } from "@cykani/ui/progress";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@cykani/ui/select";

const sessionChartValues = [34, 38, 31, 47, 42, 51, 44, 40, 58, 46, 43, 49] as const;

const sessionChartConfig = {
  sessions: {
    label: "Sessions",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const axisMonthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });
const tooltipMonthFormatter = new Intl.DateTimeFormat("en-US", { month: "short", year: "2-digit" });

function getRollingMonthData(values: readonly number[]) {
  return values.map((sessions, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (values.length - 1 - index));

    return {
      date: date.toISOString(),
      sessions,
    };
  });
}

export function PipelineActivity() {
  const sessionChartData = getRollingMonthData(sessionChartValues);
  const totalSessions = sessionChartData.reduce((sum, item) => sum + item.sessions, 0);
  const automatedRuns = 184;
  const automationProgress = Math.round((automatedRuns / totalSessions) * 100);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <Card className="xl:col-span-12">
        <CardHeader>
          <CardTitle>Session Activity</CardTitle>
          <CardAction>
            <Select defaultValue="last-12-months">
              <SelectTrigger size="sm" className="min-w-40">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="last-30-days">Last 30 days</SelectItem>
                  <SelectItem value="last-quarter">Last quarter</SelectItem>
                  <SelectItem value="last-12-months">Last 12 months</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <ChartContainer config={sessionChartConfig} className="h-72 w-full lg:col-span-8">
              <BarChart data={sessionChartData} margin={{ left: 0, right: 0, top: 0, bottom: 0 }} barSize={38}>
                <defs>
                  <pattern
                    id="crm-sessions-pattern"
                    width="4"
                    height="4"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(45)"
                  >
                    <rect width="6" height="6" fill="var(--color-sessions)" fillOpacity="0.15" />
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="6"
                      stroke="var(--color-sessions)"
                      strokeWidth="1.25"
                      strokeOpacity="0.40"
                    />
                  </pattern>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="0" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => axisMonthFormatter.format(new Date(String(value)))}
                />
                <YAxis hide />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      hideIndicator
                      labelFormatter={(value) => tooltipMonthFormatter.format(new Date(String(value)))}
                    />
                  }
                />
                <Bar
                  dataKey="sessions"
                  fill="url(#crm-sessions-pattern)"
                  radius={[8, 8, 0, 0]}
                  stroke="var(--color-sessions)"
                  strokeOpacity={0.5}
                  strokeWidth={0.5}
                />
              </BarChart>
            </ChartContainer>

            <div className="flex flex-col gap-5 rounded-lg p-4 lg:col-span-4">
              <div className="flex flex-col gap-1">
                <div className="font-medium text-4xl tabular-nums leading-none">
                  {totalSessions} <span className="font-normal text-lg text-muted-foreground">sessions</span>
                </div>
                <p className="text-muted-foreground text-sm">Total browser sessions created over the last 12 months.</p>
              </div>

              <div className="flex flex-col gap-3 rounded-lg border border-border/60 p-3">
                <div className="text-[11px] text-muted-foreground uppercase tracking-widest">
                  Automated Workflows
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="font-medium text-2xl tabular-nums leading-none">
                    {automatedRuns} <span className="font-normal text-muted-foreground text-sm">runs</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {automationProgress}% of sessions triggered an automated workflow.
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-0.5">
                  <Progress
                    value={automationProgress}
                    className="h-2.5 bg-chart-2/12 *:data-[slot='progress-indicator']:bg-chart-2"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-medium tabular-nums">{automatedRuns} automated</div>
                    <div className="text-muted-foreground tabular-nums">{totalSessions} total</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
