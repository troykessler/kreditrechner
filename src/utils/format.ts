export const formatEuro = (value: number): string =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const formatPercent = (value: number): string =>
  new Intl.NumberFormat("de-DE", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);

export const formatLaufzeit = (monate: number): string => {
  if (monate <= 0) return "—";
  const jahre = Math.floor(monate / 12);
  const restMonate = monate % 12;
  if (restMonate === 0) return `${jahre} Jahre`;
  if (jahre === 0) return `${restMonate} Monate`;
  return `${jahre} J. ${restMonate} M.`;
};
