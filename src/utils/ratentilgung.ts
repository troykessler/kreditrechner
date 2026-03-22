import type { AnnuitaetParams, MonthlyEntry, YearlyEntry } from "../types/loan";

export interface RatentilgungResult {
  monatlicheTilgung: number;   // fixed principal portion per month
  ersteRate: number;           // highest rate (month 1)
  letzteRate: number;          // lowest rate (last month)
  gesamtzahlung: number;
  gesamtzinsen: number;
  tilgungsplan: YearlyEntry[];
  tilgungsplanMonatlich: MonthlyEntry[];
}

export function calcRatentilgung(params: AnnuitaetParams): RatentilgungResult {
  const { kreditsumme, zinssatz, laufzeit } = params;

  const r = zinssatz / 100 / 12;
  const n = laufzeit * 12;

  // Fixed monthly principal repayment
  const monatlicheTilgung = kreditsumme / n;

  const tilgungsplan: YearlyEntry[] = [];
  const tilgungsplanMonatlich: MonthlyEntry[] = [];

  let restschuld = kreditsumme;
  let gesamtzahlung = 0;
  let gesamtzinsen = 0;
  let ersteRate = 0;

  for (let jahr = 1; jahr <= laufzeit; jahr++) {
    let jahresZinsen = 0;
    let jahresTilgung = 0;
    let jahresStartRate = 0;

    for (let m = 0; m < 12; m++) {
      const monat = (jahr - 1) * 12 + m + 1;
      const zinsbetrag = restschuld * r;
      const rate = monatlicheTilgung + zinsbetrag;

      restschuld -= monatlicheTilgung;
      if (Math.abs(restschuld) < 0.01) restschuld = 0;

      jahresZinsen += zinsbetrag;
      jahresTilgung += monatlicheTilgung;
      gesamtzahlung += rate;
      gesamtzinsen += zinsbetrag;

      if (monat === 1) ersteRate = rate;
      if (m === 0) jahresStartRate = rate;

      tilgungsplanMonatlich.push({
        monat,
        rate,
        zinsbetrag,
        tilgungsbetrag: monatlicheTilgung,
        restschuld: Math.max(0, restschuld),
      });
    }

    tilgungsplan.push({
      jahr,
      zinsbetrag: jahresZinsen,
      tilgungsbetrag: jahresTilgung,
      restschuld: Math.max(0, restschuld),
      // store annualised start-of-year rate so table can show /12
      rate: jahresStartRate * 12,
    });
  }

  const letzteRate = tilgungsplanMonatlich[tilgungsplanMonatlich.length - 1].rate;

  return {
    monatlicheTilgung,
    ersteRate,
    letzteRate,
    gesamtzahlung,
    gesamtzinsen,
    tilgungsplan,
    tilgungsplanMonatlich,
  };
}
