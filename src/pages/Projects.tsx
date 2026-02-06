import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { useProjects } from "@/hooks/useProjects";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search, Filter, TrendingUp, Clock, MessageCircle, Loader2, AlertCircle } from "lucide-react";

const categories = [
  { value: "todos", label: "Todos" },
  { value: "infraestrutura", label: "Infraestrutura" },
  { value: "saude", label: "Saúde" },
  { value: "educacao", label: "Educação" },
  { value: "seguranca", label: "Segurança" },
  { value: "social", label: "Social" },
  { value: "meio_ambiente", label: "Meio Ambiente" },
];

const sortOptions = [
  { value: "popular", label: "Mais votados", icon: TrendingUp },
  { value: "recent", label: "Mais recentes", icon: Clock },
  { value: "comments", label: "Mais comentados", icon: MessageCircle },
];

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  
  const { data: projects = [], isLoading, error } = useProjects();

  const filteredProjects = projects
    .filter((project) => {
      const matchesCategory = selectedCategory === "todos" || project.category === selectedCategory;
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "popular") return (b.votes_up - b.votes_down) - (a.votes_up - a.votes_down);
      if (sortBy === "comments") return b.comments_count - a.comments_count;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: ptBR });
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
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Projetos do Mandato
              </h1>
              <p className="text-lg text-primary-foreground/90">
                Acompanhe, vote e comente nos projetos apresentados pela vereadora
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-16 md:top-20 z-40 bg-card border-b border-border shadow-sm">
          <div className="section-container py-4">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar projetos..."
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

        {/* Projects Grid */}
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
                  Erro ao carregar projetos. Tente novamente.
                </p>
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard 
                    key={project.id}
                    id={project.id}
                    title={project.title}
                    description={project.description}
                    category={project.category}
                    date={formatDate(project.created_at)}
                    area={project.area}
                    votesUp={project.votes_up}
                    votesDown={project.votes_down}
                    comments={project.comments_count}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  {projects.length === 0 
                    ? "Nenhum projeto publicado ainda." 
                    : "Nenhum projeto encontrado com os filtros selecionados."}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
