import type { AnnuitaetParams, MonthlyEntry, YearlyEntry } from "../types/loan";

export interface EndfaelligeResult {
  monatlicheZinsrate: number; // constant monthly interest payment
  schlussrate: number;        // final lump sum (principal + last interest)
  gesamtzahlung: number;
  gesamtzinsen: number;
  tilgungsplan: YearlyEntry[];
  tilgungsplanMonatlich: MonthlyEntry[];
}

export function calcEndfaellige(params: AnnuitaetParams): EndfaelligeResult {
  const { kreditsumme, zinssatz, laufzeit } = params;

  const r = zinssatz / 100 / 12;
  const n = laufzeit * 12;

  const monatlicheZinsrate = kreditsumme * r;
  const gesamtzinsen = monatlicheZinsrate * n;
  const gesamtzahlung = gesamtzinsen + kreditsumme;
  const schlussrate = monatlicheZinsrate + kreditsumme;

  const tilgungsplanMonatlich: MonthlyEntry[] = [];
  const tilgungsplan: YearlyEntry[] = [];

  for (let jahr = 1; jahr <= laufzeit; jahr++) {
    let jahresZinsen = 0;

    for (let m = 0; m < 12; m++) {
      const monat = (jahr - 1) * 12 + m + 1;
      const isLastMonth = monat === n;
      const tilgungsbetrag = isLastMonth ? kreditsumme : 0;
      const rate = monatlicheZinsrate + tilgungsbetrag;
      const restschuld = isLastMonth ? 0 : kreditsumme;

      jahresZinsen += monatlicheZinsrate;

      tilgungsplanMonatlich.push({
        monat,
        rate,
        zinsbetrag: monatlicheZinsrate,
        tilgungsbetrag,
        restschuld,
      });
    }

    const isLastYear = jahr === laufzeit;

    tilgungsplan.push({
      jahr,
      zinsbetrag: jahresZinsen,
      tilgungsbetrag: isLastYear ? kreditsumme : 0,
      restschuld: isLastYear ? 0 : kreditsumme,
      // annualised rate: last year includes principal, others are interest-only
      rate: isLastYear ? schlussrate * 12 : monatlicheZinsrate * 12,
    });
  }

  return {
    monatlicheZinsrate,
    schlussrate,
    gesamtzahlung,
    gesamtzinsen,
    tilgungsplan,
    tilgungsplanMonatlich,
  };
}
