import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import { getTrend, type ScenarioId } from "@/lib/research-data";
export function ResearchChart({
  scenario,
  ward = "all",
  activity = false,
  minute,
}: {
  scenario: ScenarioId;
  ward?: string;
  activity?: boolean;
  minute?: number;
}) {
  const data = getTrend(scenario, ward);
  const axes = [
    <CartesianGrid key="grid" vertical={false} stroke="var(--chart-grid)" strokeDasharray="3 4" />,
    <XAxis
      key="x"
      dataKey="minute"
      ticks={[0, 10, 20, 30, 40, 50, 58]}
      tickFormatter={(v) => `${v}m`}
      axisLine={false}
      tickLine={false}
      tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
      dy={8}
    />,
    <YAxis
      key="y"
      width={32}
      allowDecimals={false}
      axisLine={false}
      tickLine={false}
      tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
    />,
    <Tooltip
      key="tooltip"
      contentStyle={{
        background: "var(--popover)",
        border: "1px solid var(--border)",
        borderRadius: 6,
        color: "var(--foreground)",
        fontSize: 12,
      }}
      labelFormatter={(v) => `Simulated minute ${v}`}
      cursor={{ stroke: "var(--border)" }}
    />,
  ];
  return (
    <>
      <div className="chart-legend">
        <span className={`legend-dot ${activity ? "teal" : ""}`} />
        {activity ? "Events per 2-minute interval" : "Cumulative infected devices"}
        <span className="chart-unit">SIMULATED</span>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          {activity ? (
            <BarChart data={data} margin={{ top: 15, right: 8, bottom: 8, left: 0 }}>
              {axes}
              <Bar
                name="Synthetic events"
                dataKey="events"
                fill="var(--chart-teal)"
                radius={[3, 3, 0, 0]}
                maxBarSize={12}
              />
            </BarChart>
          ) : (
            <AreaChart data={data} margin={{ top: 15, right: 12, bottom: 8, left: 0 }}>
              <defs>
                <linearGradient id="infection-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.23} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              {axes}
              <Area
                name="Simulated infected devices"
                type="monotone"
                dataKey="infected"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="url(#infection-fill)"
                isAnimationActive={false}
              />
              {minute !== undefined && (
                <ReferenceLine
                  x={Math.round(minute / 2) * 2}
                  stroke="var(--warning)"
                  strokeDasharray="4 4"
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
      <div className="chart-caption">
        Elapsed simulation time <span>58-minute observation window</span>
      </div>
    </>
  );
}
