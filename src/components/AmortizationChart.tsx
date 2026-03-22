import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";
import type { YearlyEntry } from "../types/loan";
import { formatEuro } from "../utils/format";

interface Props {
  data: YearlyEntry[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-title">Jahr {label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }} className="tooltip-row">
          <span>{entry.name}:</span>
          <span>{formatEuro(entry.value)}</span>
        </p>
      ))}
    </div>
  );
};

export default function AmortizationChart({ data }: Props) {
  return (
    <div className="chart-container">
      <h2 className="section-title">Tilgungsplan – Übersicht</h2>
      <ResponsiveContainer width="100%" height={340}>
        <ComposedChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="jahr"
            tickFormatter={(v) => `J${v}`}
            tick={{ fontSize: 12, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 12, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
            width={45}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 12, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
            width={45}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--hover-bg)" }} />
          <Legend
            formatter={(value) => (
              <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>{value}</span>
            )}
          />
          <Bar
            yAxisId="left"
            dataKey="tilgungsbetrag"
            name="Tilgung"
            stackId="a"
            fill="var(--color-tilgung)"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            yAxisId="left"
            dataKey="zinsbetrag"
            name="Zinsen"
            stackId="a"
            fill="var(--color-zinsen)"
            radius={[4, 4, 0, 0]}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="restschuld"
            name="Restschuld"
            stroke="var(--color-restschuld)"
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 3"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
