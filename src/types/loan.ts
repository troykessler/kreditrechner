export interface AnnuitaetParams {
  kreditsumme: number;
  zinssatz: number; // annual, in percent
  laufzeit: number; // in years
  tilgungssatz?: number; // optional initial tilgungssatz in percent (alternative to laufzeit)
}

export interface SharedLoanParams {
  kreditsumme: number;
  zinssatz: number;
  monatlicheRate: number;
  setKreditsumme: (v: number) => void;
  setZinssatz: (v: number) => void;
  setMonatlicheRate: (v: number) => void;
}

export interface MonthlyEntry {
  monat: number;
  rate: number;
  zinsbetrag: number;
  tilgungsbetrag: number;
  restschuld: number;
}

export interface YearlyEntry {
  jahr: number;
  zinsbetrag: number;
  tilgungsbetrag: number;
  restschuld: number;
  rate: number;
}

export interface AnnuitaetResult {
  monatlicheRate: number;
  gesamtzahlung: number;
  gesamtzinsen: number;
  tilgungsplan: YearlyEntry[];
  tilgungsplanMonatlich: MonthlyEntry[];
}
