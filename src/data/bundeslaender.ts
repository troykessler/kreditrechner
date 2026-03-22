export interface Bundesland {
  name: string;
  grunderwerbsteuer: number; // percent
}

export const BUNDESLAENDER: Bundesland[] = [
  { name: "Baden-Württemberg", grunderwerbsteuer: 5.0 },
  { name: "Bayern", grunderwerbsteuer: 3.5 },
  { name: "Berlin", grunderwerbsteuer: 6.0 },
  { name: "Brandenburg", grunderwerbsteuer: 6.5 },
  { name: "Bremen", grunderwerbsteuer: 5.0 },
  { name: "Hamburg", grunderwerbsteuer: 5.5 },
  { name: "Hessen", grunderwerbsteuer: 6.0 },
  { name: "Mecklenburg-Vorpommern", grunderwerbsteuer: 6.0 },
  { name: "Niedersachsen", grunderwerbsteuer: 5.0 },
  { name: "Nordrhein-Westfalen", grunderwerbsteuer: 6.5 },
  { name: "Rheinland-Pfalz", grunderwerbsteuer: 5.0 },
  { name: "Saarland", grunderwerbsteuer: 6.5 },
  { name: "Sachsen", grunderwerbsteuer: 5.5 },
  { name: "Sachsen-Anhalt", grunderwerbsteuer: 5.0 },
  { name: "Schleswig-Holstein", grunderwerbsteuer: 6.5 },
  { name: "Thüringen", grunderwerbsteuer: 6.5 },
];
