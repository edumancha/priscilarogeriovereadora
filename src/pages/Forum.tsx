import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SuggestionCard } from "@/components/cards/SuggestionCard";
import { useSuggestions, useCreateSuggestion } from "@/hooks/useSuggestions";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  MessageCircle,
  Plus,
  X,
  Send,
  User,
  UserX,
  AlertCircle,
  Loader2
} from "lucide-react";

const categories = [
  { value: "todos", label: "Todos" },
  { value: "infraestrutura", label: "Infraestrutura" },
  { value: "saude", label: "Saúde" },
  { value: "educacao", label: "Educação" },
  { value: "seguranca", label: "Segurança" },
  { value: "social", label: "Social" },
  { value: "meio_ambiente", label: "Meio Ambiente" },
  { value: "cultura", label: "Cultura" },
  { value: "transporte", label: "Transporte" },
];

const sortOptions = [
  { value: "popular", label: "Mais votados", icon: TrendingUp },
  { value: "recent", label: "Mais recentes", icon: Clock },
  { value: "comments", label: "Mais comentados", icon: MessageCircle },
];

export default function Forum() {
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [showForm, setShowForm] = useState(false);
  
  const { data: suggestions = [], isLoading, error } = useSuggestions();
  const createSuggestion = useCreateSuggestion();
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "infraestrutura",
    neighborhood: "",
    author_name: "",
    is_anonymous: true,
  });

  const filteredSuggestions = suggestions
    .filter((suggestion) => {
      const matchesCategory = selectedCategory === "todos" || suggestion.category === selectedCategory;
      const matchesSearch = suggestion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        suggestion.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "popular") return (b.votes_up - b.votes_down) - (a.votes_up - a.votes_down);
      if (sortBy === "comments") return b.comments_count - a.comments_count;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await createSuggestion.mutateAsync({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        neighborhood: formData.neighborhood || undefined,
        author_name: formData.is_anonymous ? undefined : formData.author_name,
        is_anonymous: formData.is_anonymous,
      });

      setFormData({
        title: "",
        description: "",
        category: "infraestrutura",
        neighborhood: "",
        author_name: "",
        is_anonymous: true,
      });
      setShowForm(false);
      toast.success("Sugestão enviada com sucesso!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao enviar sugestão");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ptBR });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative bg-gradient-hero text-primary-foreground py-16 md:py-24">
          <div className="section-container">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                Participação Cidadã
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Fórum de Sugestões
              </h1>
              <p className="text-lg text-primary-foreground/90 mb-8">
                Sua voz importa! Envie sugestões, vote e comente nas ideias da comunidade
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-hero-primary"
              >
                <Plus className="w-5 h-5" />
                Enviar Nova Sugestão
              </button>
            </div>
          </div>
        </section>

        {/* Suggestion Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
              <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Nova Sugestão
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Anonymous Toggle */}
                <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_anonymous: true })}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                      formData.is_anonymous
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <UserX className="w-4 h-4" />
                    Anônimo
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_anonymous: false })}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                      !formData.is_anonymous
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Identificado
                  </button>
                </div>

                {/* Author Name (if not anonymous) */}
                {!formData.is_anonymous && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Seu nome
                    </label>
                    <input
                      type="text"
                      value={formData.author_name}
                      onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                      placeholder="Como você quer ser identificado?"
                      className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Título da sugestão *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Resuma sua ideia em poucas palavras"
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Descrição *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva sua sugestão com mais detalhes. Quanto mais informações, melhor!"
                    rows={4}
                    className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    required
                  />
                </div>

                {/* Category & Neighborhood */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Categoria *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >
                      {categories.filter(c => c.value !== "todos").map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Bairro (opcional)
                    </label>
                    <input
                      type="text"
                      value={formData.neighborhood}
                      onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                      placeholder="Ex: Centro, Vila Nova..."
                      className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* Security Note */}
                <div className="p-4 bg-accent rounded-xl">
                  <p className="text-sm text-accent-foreground">
                    <strong>🔒 Segurança:</strong> Para evitar spam, você pode enviar uma sugestão a cada 10 minutos. 
                    Todas as sugestões são registradas para moderação.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-6 py-3 border-2 border-border text-foreground font-medium rounded-xl hover:bg-muted transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={createSuggestion.isPending}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground font-semibold rounded-xl hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createSuggestion.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Enviar Sugestão
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filters */}
        <section className="sticky top-16 md:top-20 z-40 bg-card border-b border-border shadow-sm">
          <div className="section-container py-4">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar sugestões..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Categories & Sort */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-muted rounded-lg text-sm font-medium border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Suggestions Grid */}
        <section className="section-padding bg-background">
          <div className="section-container">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  Erro ao carregar sugestões. Tente novamente.
                </p>
              </div>
            ) : filteredSuggestions.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredSuggestions.map((suggestion) => (
                  <SuggestionCard 
                    key={suggestion.id} 
                    id={suggestion.id}
                    title={suggestion.title}
                    description={suggestion.description}
                    category={suggestion.category}
                    neighborhood={suggestion.neighborhood}
                    author={suggestion.author_name || ""}
                    isAnonymous={suggestion.is_anonymous}
                    createdAt={formatDate(suggestion.created_at)}
                    votesUp={suggestion.votes_up}
                    votesDown={suggestion.votes_down}
                    comments={suggestion.comments_count}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-4">
                  {suggestions.length === 0 
                    ? "Seja o primeiro a enviar uma sugestão!" 
                    : "Nenhuma sugestão encontrada com os filtros selecionados."}
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:brightness-110 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Enviar Sugestão
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Floating Action Button (Mobile) */}
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-6 right-6 md:hidden w-14 h-14 bg-secondary text-secondary-foreground rounded-full shadow-xl flex items-center justify-center hover:brightness-110 transition-all animate-float"
          aria-label="Enviar sugestão"
        >
          <Plus className="w-6 h-6" />
        </button>
      </main>

      <Footer />
    </div>
  );
}
