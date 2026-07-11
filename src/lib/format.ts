import type { Money } from "./mono/types";

export function formatMoney({ amount, currency }: Money): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount / 100);
}
