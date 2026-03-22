import { useState } from "react";
import AnnuitaetenRechner from "./components/AnnuitaetenRechner";
import "./App.css";

type LoanType = "annuitaeten";

const LOAN_TYPES: { id: LoanType; label: string; available: boolean }[] = [
  { id: "annuitaeten", label: "Annuitätendarlehen", available: true },
];

export default function App() {
  const [active, setActive] = useState<LoanType>("annuitaeten");

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">📊</span>
            <span className="logo-text">Kreditrechner</span>
          </div>
          <nav className="loan-tabs">
            {LOAN_TYPES.map((t) => (
              <button
                key={t.id}
                className={`tab-btn ${active === t.id ? "active" : ""} ${!t.available ? "disabled" : ""}`}
                onClick={() => t.available && setActive(t.id)}
                disabled={!t.available}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="page-wrapper">
        {active === "annuitaeten" && <AnnuitaetenRechner />}
      </div>
    </div>
  );
}
