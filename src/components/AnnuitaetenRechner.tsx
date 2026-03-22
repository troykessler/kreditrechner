import { useMemo, useState } from "react";
import { calcAnnuitaetendarlehen } from "../utils/annuitaetendarlehen";
import InputField from "./InputField";
import SummaryCards from "./SummaryCards";
import { formatEuro, formatLaufzeit } from "../utils/format";
import AmortizationChart from "./AmortizationChart";
import AmortizationTable from "./AmortizationTable";
import type { SharedLoanParams } from "../types/loan";

type View = "jährlich" | "monatlich";

const formatK = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)} Mio €`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}k €`;
  return `${v} €`;
};

export default function AnnuitaetenRechner({ kreditsumme, zinssatz, monatlicheRate, setKreditsumme, setZinssatz, setMonatlicheRate }: SharedLoanParams) {
  const [view, setView] = useState<View>("jährlich");

  const minRate = 100;
  const maxRate = 5_000;

  const result = useMemo(
    () => calcAnnuitaetendarlehen({ kreditsumme, zinssatz, monatlicheRate }),
    [kreditsumme, zinssatz, monatlicheRate]
  );

  const tilgungsanteil = result.laufzeitMonate > 0
    ? (((monatlicheRate - kreditsumme * zinssatz / 100 / 12) / kreditsumme) * 100).toFixed(2)
    : "—";

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
          label="Monatliche Rate"
          value={monatlicheRate}
          onChange={setMonatlicheRate}
          min={minRate}
          max={maxRate}
          step={10}
          unit="€"
          formatDisplay={(v) => `${formatEuro(v)}`}
        />

        <div className="sidebar-info">
          <div className="info-row">
            <span>Anfängliche Tilgungsrate</span>
            <strong>{tilgungsanteil} %</strong>
          </div>
          <div className="info-row">
            <span>Laufzeit</span>
            <strong>{formatLaufzeit(result.laufzeitMonate)}</strong>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <SummaryCards cards={[
          { label: "Laufzeit", value: formatLaufzeit(result.laufzeitMonate), variant: "primary" },
          { label: "Letzte Rate", value: formatEuro(monatlicheRate) },
          {
            label: "Gesamtzinsen",
            value: formatEuro(result.gesamtzinsen),
            sub: result.gesamtzahlung > 0 ? `${((result.gesamtzinsen / result.gesamtzahlung) * 100).toFixed(1)}% der Gesamtzahlung` : undefined,
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
