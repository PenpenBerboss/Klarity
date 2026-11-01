export function formatCfa(amount: number): string {
  const formattedAmount = new Intl.NumberFormat('fr-CM', {
    maximumFractionDigits: 0,
  }).format(amount);

  return `${formattedAmount} FCFA`;
}
