import { useState, useMemo, useRef, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { BUNDESLAENDER } from "../data/bundeslaender";
import InputField from "./InputField";
import SummaryCards from "./SummaryCards";
import { formatEuro } from "../utils/format";

const NOTAR_PROZENT = 1.5;
const GRUNDBUCH_PROZENT = 0.5;
const MAKLER_PROZENT = 3.57;

const DONUT_COLORS = ["#f87171", "#fb923c", "#facc15", "#c084fc"];

type CreditType = "annuitaeten" | "ratentilgung" | "endfaellige";
const KREDIT_TYPEN: { id: CreditType; label: string }[] = [
  { id: "annuitaeten", label: "Annuitätendarlehen" },
  { id: "ratentilgung", label: "Ratentilgung" },
  { id: "endfaellige", label: "Endfällige Tilgung" },
];

export interface KreditbedarfState {
  kaufpreis: number;
  eigenkapitalRaw: number;
  bundeslandIndex: number;
  withMakler: boolean;
}

interface Props {
  state: KreditbedarfState;
  setState: (s: KreditbedarfState) => void;
  onAdopt: (kreditsumme: number, loanType: CreditType) => void;
  onKreditsummeChange: (v: number) => void;
}

const formatK = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)} Mio €`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}k €`;
  return `${v} €`;
};

const DonutTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, value, payload: p } = payload[0];
  return (
    <div className="chart-tooltip">
      <p className="tooltip-title">{name}</p>
      <p className="tooltip-row">
        <span>{p.prozent.toFixed(2)} %</span>
        <span>{formatEuro(value)}</span>
      </p>
    </div>
  );
};

export default function KreditbedarfRechner({ state, setState, onAdopt, onKreditsummeChange }: Props) {
  const { kaufpreis, eigenkapitalRaw, bundeslandIndex, withMakler } = state;
  const set = (patch: Partial<KreditbedarfState>) => setState({ ...state, ...patch });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const eigenkapital = Math.min(eigenkapitalRaw, kaufpreis);
  const setKaufpreis = (v: number) => set({ kaufpreis: v });
  const setEigenkapital = (v: number) => set({ eigenkapitalRaw: Math.min(v, kaufpreis) });
  const setBundeslandIndex = (v: number) => set({ bundeslandIndex: v });
  const setWithMakler = (v: boolean) => set({ withMakler: v });
  const bundesland = BUNDESLAENDER[bundeslandIndex];

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const nebenkosten = useMemo(() => [
    { label: "Grunderwerbsteuer", prozent: bundesland.grunderwerbsteuer, betrag: kaufpreis * bundesland.grunderwerbsteuer / 100, included: true },
    { label: "Notarkosten",        prozent: NOTAR_PROZENT,               betrag: kaufpreis * NOTAR_PROZENT / 100,               included: true },
    { label: "Grundbucheintragung",prozent: GRUNDBUCH_PROZENT,           betrag: kaufpreis * GRUNDBUCH_PROZENT / 100,           included: true },
    { label: "Maklercourtage",     prozent: MAKLER_PROZENT,              betrag: kaufpreis * MAKLER_PROZENT / 100,              included: withMakler },
  ], [kaufpreis, bundesland, withMakler]);

  const activeNebenkosten = nebenkosten.filter(r => r.included);
  const gesamtNebenkosten = activeNebenkosten.reduce((s, r) => s + r.betrag, 0);
  const nebenkostenProzent = (gesamtNebenkosten / kaufpreis) * 100;
  const benötigteKreditsumme = Math.max(0, kaufpreis + gesamtNebenkosten - eigenkapital);
  const eigenkapitalProzent = (eigenkapital / (kaufpreis + gesamtNebenkosten)) * 100;
  const roundedKreditsumme = Math.round(benötigteKreditsumme / 1000) * 1000;

  useEffect(() => { onKreditsummeChange(roundedKreditsumme); }, [roundedKreditsumme]);

  const donutData = activeNebenkosten.map((r) => ({ name: r.label, value: r.betrag, prozent: r.prozent }));

  return (
    <div className="rechner-layout">
      <aside className="sidebar">
        <h2 className="sidebar-title">Parameter</h2>

        <InputField
          label="Kaufpreis"
          value={kaufpreis}
          onChange={setKaufpreis}
          min={50_000}
          max={5_000_000}
          step={5_000}
          unit="€"
          formatDisplay={formatK}
        />

        <InputField
          label="Eigenkapital"
          value={eigenkapital}
          onChange={setEigenkapital}
          min={0}
          max={kaufpreis}
          step={1_000}
          unit="€"
          formatDisplay={formatK}
        />

        <div className="input-field">
          <label className="input-label">Bundesland</label>
          <select
            className="dropdown"
            value={bundeslandIndex}
            onChange={(e) => setBundeslandIndex(Number(e.target.value))}
          >
            {BUNDESLAENDER.map((bl, i) => (
              <option key={bl.name} value={i}>{bl.name} ({bl.grunderwerbsteuer} %)</option>
            ))}
          </select>
        </div>

        <div className="checkbox-row">
          <input type="checkbox" id="makler" className="checkbox" checked={withMakler} onChange={(e) => setWithMakler(e.target.checked)} />
          <label htmlFor="makler">
            Maklercourtage ({MAKLER_PROZENT} %)
            <span className="checkbox-sub">Käuferanteil inkl. MwSt.</span>
          </label>
        </div>

        <div className="sidebar-info">
          <div className="info-row">
            <span>Eigenkapitalquote</span>
            <strong>{eigenkapitalProzent.toFixed(1)} %</strong>
          </div>
          <div className="info-row">
            <span>Nebenkosten gesamt</span>
            <strong>{nebenkostenProzent.toFixed(1)} %</strong>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <SummaryCards cards={[
          { label: "Benötigte Kreditsumme", value: formatEuro(benötigteKreditsumme), variant: "primary" },
          { label: "Kaufpreis", value: formatEuro(kaufpreis) },
          { label: "Kaufnebenkosten", value: formatEuro(gesamtNebenkosten), sub: `${nebenkostenProzent.toFixed(1)}% des Kaufpreises`, variant: "zinsen" },
          { label: "Gesamtkosten", value: formatEuro(kaufpreis + gesamtNebenkosten) },
        ]} />

        <div className="breakdown-container">
          <h2 className="section-title">Kaufnebenkosten – Aufschlüsselung</h2>

          <div className="breakdown-body">
            <div>
              <div className="breakdown-rows">
                {activeNebenkosten.map((row, i) => (
                  <div key={row.label} className="breakdown-row">
                    <div className="breakdown-left">
                      <span className="breakdown-dot" style={{ background: DONUT_COLORS[i] }} />
                      <span className="breakdown-label">{row.label}</span>
                      <span className="breakdown-pct">{row.prozent.toFixed(2)} %</span>
                    </div>
                    <span className="breakdown-amount">{formatEuro(row.betrag)}</span>
                  </div>
                ))}
                <div className="breakdown-row breakdown-total">
                  <div className="breakdown-left">
                    <span className="breakdown-label">Gesamt Nebenkosten</span>
                  </div>
                  <span className="breakdown-amount">{formatEuro(gesamtNebenkosten)}</span>
                </div>
              </div>

              <div className="breakdown-stack">
                <div className="stack-label">
                  <span>Finanzierungsübersicht</span>
                  <span>{formatEuro(kaufpreis + gesamtNebenkosten)}</span>
                </div>
                <div className="stack-bar">
                  <div className="stack-segment stack-eigen" style={{ width: `${Math.min(100, eigenkapitalProzent)}%` }} />
                  <div className="stack-segment stack-kredit" style={{ width: `${Math.min(100, (benötigteKreditsumme / (kaufpreis + gesamtNebenkosten)) * 100)}%` }} />
                </div>
                <div className="stack-legend">
                  <span className="legend-dot eigen" /> Eigenkapital {eigenkapitalProzent.toFixed(1)}%
                  <span className="legend-dot kredit" /> Kredit {((benötigteKreditsumme / (kaufpreis + gesamtNebenkosten)) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Donut chart */}
            <div className="donut-wrapper">
              <PieChart width={200} height={200}>
                <Pie
                  data={donutData}
                  cx={100}
                  cy={100}
                  innerRadius={58}
                  outerRadius={88}
                  dataKey="value"
                  strokeWidth={2}
                  stroke="var(--surface)"
                >
                  {donutData.map((_, i) => (
                    <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<DonutTooltip />} />
              </PieChart>
              <div className="donut-center">
                <span className="donut-pct">{nebenkostenProzent.toFixed(1)}%</span>
                <span className="donut-sub">Nebenkosten</span>
              </div>
            </div>
          </div>
        </div>

        {/* Adopt button with loan type selector */}
        <div className="adopt-group" ref={dropdownRef}>
          <button className="adopt-btn-main" onClick={() => onAdopt(roundedKreditsumme, "annuitaeten")}>
            {formatEuro(roundedKreditsumme)} in Kreditrechner übernehmen
          </button>
          <button className="adopt-btn-arrow" onClick={() => setDropdownOpen((o) => !o)}>
            {dropdownOpen ? "▲" : "▼"}
          </button>
          {dropdownOpen && (
            <div className="adopt-dropdown">
              {KREDIT_TYPEN.map((t) => (
                <button
                  key={t.id}
                  className="adopt-dropdown-item"
                  onClick={() => { onAdopt(roundedKreditsumme, t.id); setDropdownOpen(false); }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
