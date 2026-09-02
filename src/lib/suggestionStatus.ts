export type SuggestionStatus =
  | "recebida"
  | "em_analise"
  | "encaminhada"
  | "em_andamento"
  | "concluida"
  | "nao_viavel";

export const suggestionStatusOptions: { value: SuggestionStatus; label: string; className: string }[] = [
  { value: "recebida", label: "Recebida", className: "bg-muted text-muted-foreground" },
  { value: "em_analise", label: "Em análise", className: "bg-blue-100 text-blue-700" },
  { value: "encaminhada", label: "Encaminhada", className: "bg-purple-100 text-purple-700" },
  { value: "em_andamento", label: "Em andamento", className: "bg-amber-100 text-amber-700" },
  { value: "concluida", label: "Concluída", className: "bg-emerald-100 text-emerald-700" },
  { value: "nao_viavel", label: "Não viável", className: "bg-red-100 text-red-700" },
];

export function getSuggestionStatus(status?: string | null) {
  return (
    suggestionStatusOptions.find((option) => option.value === status) ?? suggestionStatusOptions[0]
  );
}
