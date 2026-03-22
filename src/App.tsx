import { useState } from "react";
import AnnuitaetenRechner from "./components/AnnuitaetenRechner";
import RatentilgungRechner from "./components/RatentilgungRechner";
import "./App.css";

type LoanType = "annuitaeten" | "ratentilgung";

const LOAN_TYPES: { id: LoanType; label: string }[] = [
  { id: "annuitaeten", label: "Annuitätendarlehen" },
  { id: "ratentilgung", label: "Ratentilgung" },
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
                className={`tab-btn ${active === t.id ? "active" : ""}`}
                onClick={() => setActive(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="page-wrapper">
        {active === "annuitaeten" && <AnnuitaetenRechner />}
        {active === "ratentilgung" && <RatentilgungRechner />}
      </div>
    </div>
  );
}
