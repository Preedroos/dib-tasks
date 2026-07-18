export function formatShortDate(dateString: string | null): string {
  if (!dateString) return 'Sem prazo';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
}

export function formatLongDate(dateString: string | null): string {
  if (!dateString) return 'Sem prazo';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}
