import type { MonthlyEntry, YearlyEntry } from "../types/loan";

export interface EndfaelligeInput {
  kreditsumme: number;
  zinssatz: number;   // annual percent
  laufzeitMonate: number;
}

export interface EndfaelligeResult {
  monatlicheZinsrate: number;
  schlussrate: number;
  gesamtzahlung: number;
  gesamtzinsen: number;
  tilgungsplan: YearlyEntry[];
  tilgungsplanMonatlich: MonthlyEntry[];
}

export function calcEndfaellige(input: EndfaelligeInput): EndfaelligeResult {
  const { kreditsumme, zinssatz, laufzeitMonate } = input;
  const r = zinssatz / 100 / 12;
  const n = laufzeitMonate;

  const monatlicheZinsrate = kreditsumme * r;
  const schlussrate = monatlicheZinsrate + kreditsumme;
  const gesamtzinsen = monatlicheZinsrate * n;
  const gesamtzahlung = gesamtzinsen + kreditsumme;

  const tilgungsplanMonatlich: MonthlyEntry[] = [];
  const tilgungsplan: YearlyEntry[] = [];
  let jahresZinsen = 0;
  let currentJahr = 1;

  for (let monat = 1; monat <= n; monat++) {
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

    const isEndOfYear = monat % 12 === 0;
    if (isEndOfYear || isLastMonth) {
      const isLastYear = monat === n;
      tilgungsplan.push({
        jahr: currentJahr++,
        zinsbetrag: jahresZinsen,
        tilgungsbetrag: isLastYear ? kreditsumme : 0,
        restschuld: isLastYear ? 0 : kreditsumme,
        rate: isLastYear ? schlussrate * 12 : monatlicheZinsrate * 12,
      });
      jahresZinsen = 0;
    }
  }

  return { monatlicheZinsrate, schlussrate, gesamtzahlung, gesamtzinsen, tilgungsplan, tilgungsplanMonatlich };
}
