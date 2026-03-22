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
import type { YearlyEntry, MonthlyEntry } from "../types/loan";
import { formatEuro } from "../utils/format";

type View = "jährlich" | "monatlich";

interface Props {
  yearly: YearlyEntry[];
  monthly: MonthlyEntry[];
  view: View;
  onViewChange: (v: View) => void;
}

const CustomTooltip = ({ active, payload, label, view }: any) => {
  if (!active || !payload?.length) return null;
  const periodLabel = view === "monatlich" ? `Monat ${label}` : `Jahr ${label}`;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-title">{periodLabel}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }} className="tooltip-row">
          <span>{entry.name}:</span>
          <span>{formatEuro(entry.value)}</span>
        </p>
      ))}
    </div>
  );
};

export default function AmortizationChart({ yearly, monthly, view, onViewChange }: Props) {
  const data: { period: number; zinsbetrag: number; tilgungsbetrag: number; restschuld: number }[] =
    view === "monatlich"
      ? monthly.map((m) => ({ period: m.monat, zinsbetrag: m.zinsbetrag, tilgungsbetrag: m.tilgungsbetrag, restschuld: m.restschuld }))
      : yearly.map((y) => ({ period: y.jahr, zinsbetrag: y.zinsbetrag, tilgungsbetrag: y.tilgungsbetrag, restschuld: y.restschuld }));

  // In monthly view with many data points, only show every 12th x-axis tick
  const tickCount = data.length;
  const xTickFormatter = (v: number) =>
    view === "monatlich"
      ? tickCount > 60 && v % 12 !== 0 ? "" : `M${v}`
      : `J${v}`;

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h2 className="section-title" style={{ marginBottom: 0 }}>Tilgungsplan – Übersicht</h2>
        <div className="view-toggle">
          {(["jährlich", "monatlich"] as View[]).map((v) => (
            <button
              key={v}
              className={`view-toggle-btn ${view === v ? "active" : ""}`}
              onClick={() => onViewChange(v)}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={340}>
        <ComposedChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="period"
            tickFormatter={xTickFormatter}
            tick={{ fontSize: 12, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
            interval={view === "monatlich" ? 11 : 0}
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
          <Tooltip content={<CustomTooltip view={view} />} cursor={{ fill: "var(--hover-bg)" }} />
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
          />
          <Bar
            yAxisId="left"
            dataKey="zinsbetrag"
            name="Zinsen"
            stackId="a"
            fill="var(--color-zinsen)"
            radius={[2, 2, 0, 0]}
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
