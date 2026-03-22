import { useMemo, useState } from "react";
import { calcEndfaellige } from "../utils/endfaellige";
import InputField from "./InputField";
import SummaryCards from "./SummaryCards";
import AmortizationChart from "./AmortizationChart";
import AmortizationTable from "./AmortizationTable";
import { formatEuro } from "../utils/format";
import type { SharedLoanParams } from "../types/loan";

type View = "jährlich" | "monatlich";

const formatK = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)} Mio €`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}k €`;
  return `${v} €`;
};

export default function EndfaelligeRechner({ kreditsumme, zinssatz, setKreditsumme, setZinssatz }: SharedLoanParams) {
  const [laufzeit, setLaufzeit] = useState(20);
  const [view, setView] = useState<View>("jährlich");

  const result = useMemo(
    () => calcEndfaellige({ kreditsumme, zinssatz, laufzeitMonate: laufzeit * 12 }),
    [kreditsumme, zinssatz, laufzeit]
  );

  return (
    <div className="rechner-layout">
      <aside className="sidebar">
        <h2 className="sidebar-title">Parameter</h2>

        <InputField
          label="Kreditsumme"
          value={kreditsumme}
          onChange={setKreditsumme}
          min={10_000}
          max={2_000_000}
          step={5_000}
          unit="€"
          formatDisplay={formatK}
        />

        <InputField
          label="Sollzinssatz (p.a.)"
          value={zinssatz}
          onChange={setZinssatz}
          min={0}
          max={15}
          step={0.05}
          unit="%"
          formatDisplay={(v) => `${v.toFixed(2)} %`}
        />

        <InputField
          label="Laufzeit"
          value={laufzeit}
          onChange={setLaufzeit}
          min={1}
          max={40}
          step={1}
          unit="Jahre"
          formatDisplay={(v) => `${v} Jahre`}
        />

        <div className="sidebar-info">
          <div className="info-row">
            <span>Monatliche Zinszahlung</span>
            <strong>{formatEuro(result.monatlicheZinsrate)}</strong>
          </div>
          <div className="info-row">
            <span>Effektiver Jahreszins</span>
            <strong>{zinssatz.toFixed(2)} %</strong>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <SummaryCards cards={[
          { label: "Monatliche Zinszahlung", value: formatEuro(result.monatlicheZinsrate), variant: "primary" },
          { label: "Schlussrate", value: formatEuro(result.schlussrate) },
          {
            label: "Gesamtzinsen",
            value: formatEuro(result.gesamtzinsen),
            sub: `${((result.gesamtzinsen / result.gesamtzahlung) * 100).toFixed(1)}% der Gesamtzahlung`,
            variant: "zinsen",
          },
          { label: "Gesamtzahlung", value: formatEuro(result.gesamtzahlung) },
        ]} />

        <AmortizationChart yearly={result.tilgungsplan} monthly={result.tilgungsplanMonatlich} view={view} onViewChange={setView} />
        <AmortizationTable yearly={result.tilgungsplan} monthly={result.tilgungsplanMonatlich} view={view} />
      </main>
    </div>
  );
}
