"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartDatum {
  title: string;
  view_count: number;
}

function truncate(title: string, max = 28) {
  return title.length > max ? `${title.slice(0, max - 1)}…` : title;
}

export function ArticlesChart({ data }: { data: ChartDatum[] }) {
  if (data.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Aucune donnée de vue pour le moment.
      </p>
    );
  }

  const chartData = data.map((d) => ({ ...d, label: truncate(d.title) }));

  return (
    <div style={{ height: Math.max(160, chartData.length * 48) }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 24 }}>
          <CartesianGrid horizontal={false} stroke="var(--chart-grid)" />
          <XAxis
            type="number"
            tick={{ fill: "var(--chart-ink-muted)", fontSize: 12 }}
            axisLine={{ stroke: "var(--chart-grid)" }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={160}
            tick={{ fill: "var(--foreground)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "var(--muted)" }}
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--card-border)",
              borderRadius: 8,
              fontSize: 12,
              color: "var(--foreground)",
            }}
            formatter={(value) => [`${value} vues`, ""]}
            labelFormatter={() => ""}
          />
          <Bar dataKey="view_count" fill="var(--chart-series-1)" radius={[0, 4, 4, 0]} barSize={22}>
            <LabelList
              dataKey="view_count"
              position="right"
              style={{ fill: "var(--foreground)", fontSize: 12 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
