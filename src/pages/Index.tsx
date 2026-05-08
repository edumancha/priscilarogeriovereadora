import { Link } from "react-router-dom";
import { MessageSquarePlus, Vote, ArrowRight, Users, FileText, TrendingUp, Shield } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { SuggestionCard } from "@/components/cards/SuggestionCard";
import { useProjects } from "@/hooks/useProjects";
import { useSuggestions } from "@/hooks/useSuggestions";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import priscilaHero from "@/assets/priscila-office-smile.jpeg";

const stats = [
  { icon: Users, value: "2.847", label: "Cidadãos participando" },
  { icon: FileText, value: "156", label: "Projetos em votação" },
  { icon: TrendingUp, value: "89%", label: "Taxa de aprovação" },
  { icon: Shield, value: "100%", label: "Transparência" },
];

export default function Index() {
  const { data: projects = [] } = useProjects();
  const { data: suggestions = [] } = useSuggestions();
  
  // Get top 3 projects and suggestions
  const featuredProjects = projects
    .sort((a, b) => (b.votes_up - b.votes_down) - (a.votes_up - a.votes_down))
    .slice(0, 3);
    
  const popularSuggestions = suggestions
    .sort((a, b) => (b.votes_up - b.votes_down) - (a.votes_up - a.votes_down))
    .slice(0, 2);

  const formatProjectDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const formatSuggestionDate = (dateString: string) => {
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
        {/* Hero Section */}
        <section className="relative bg-gradient-hero text-primary-foreground overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          
          <div className="section-container relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center py-16 md:py-24">
              {/* Content */}
              <div className="text-center lg:text-left">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6 animate-fade-in">
                  <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                  Mandato Participativo Digital
                </span>
                
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up">
                  O povo decide{" "}
                  <span className="text-secondary">junto</span>
                </h1>
                
                <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0 animate-slide-up animation-delay-100">
                  Participe ativamente das decisões do mandato. Sugira projetos, vote em propostas 
                  e ajude a construir uma cidade melhor para todos.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up animation-delay-200">
                  <Link to="/forum" className="btn-hero-primary">
                    <MessageSquarePlus className="w-5 h-5" />
                    Envie sua Sugestão
                  </Link>
                  <Link to="/projetos" className="btn-hero-secondary">
                    <Vote className="w-5 h-5" />
                    Veja Projetos em Votação
                  </Link>
                </div>
              </div>
              
              {/* Image */}
              <div className="relative flex justify-center lg:justify-end animate-fade-in animation-delay-300">
                <div className="relative">
                  <div className="absolute -inset-6 bg-secondary/40 rounded-[2rem] blur-3xl"></div>
                  <img
                    src={priscilaHero}
                    alt="Vereadora Priscila Rogério em seu gabinete"
                    className="relative w-80 md:w-[26rem] lg:w-[34rem] rounded-2xl shadow-2xl object-cover aspect-[4/5]"
                    style={{
                      WebkitMaskImage:
                        "linear-gradient(to bottom, black 78%, transparent 100%)",
                      maskImage:
                        "linear-gradient(to bottom, black 78%, transparent 100%)",
                    }}
                  />
                  {/* Badge */}
                  <div className="absolute bottom-4 -right-4 bg-card text-foreground px-6 py-3 rounded-xl shadow-xl">
                    <p className="font-semibold text-lg tracking-tight">Priscila Rogério</p>
                    <p className="text-sm text-muted-foreground">Vereadora</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-card border-b border-border">
          <div className="section-container py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-accent rounded-xl mb-3">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-display text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="section-padding bg-background">
          <div className="section-container">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-primary font-medium text-sm uppercase tracking-wider">Projetos do Mandato</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                  Projetos em Destaque
                </h2>
                <p className="text-muted-foreground mt-2 max-w-xl">
                  Acompanhe e vote nos projetos que estão em andamento no mandato
                </p>
              </div>
              <Link 
                to="/projetos" 
                className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
              >
                Ver todos os projetos
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {featuredProjects.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProjects.map((project) => (
                  <ProjectCard 
                    key={project.id}
                    id={project.id}
                    title={project.title}
                    description={project.description}
                    category={project.category}
                    date={formatProjectDate(project.created_at)}
                    area={project.area}
                    votesUp={project.votes_up}
                    votesDown={project.votes_down}
                    comments={project.comments_count}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/50 rounded-2xl">
                <p className="text-muted-foreground">
                  Nenhum projeto publicado ainda. Acompanhe esta seção em breve!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Popular Suggestions */}
        <section className="section-padding bg-muted/50">
          <div className="section-container">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-secondary-dark font-medium text-sm uppercase tracking-wider">Voz do Povo</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                  Sugestões da Comunidade
                </h2>
                <p className="text-muted-foreground mt-2 max-w-xl">
                  Ideias enviadas pelos cidadãos para melhorar nossa cidade
                </p>
              </div>
              <Link 
                to="/forum" 
                className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
              >
                Ver todas as sugestões
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {popularSuggestions.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {popularSuggestions.map((suggestion) => (
                  <SuggestionCard 
                    key={suggestion.id}
                    id={suggestion.id}
                    title={suggestion.title}
                    description={suggestion.description}
                    category={suggestion.category}
                    neighborhood={suggestion.neighborhood}
                    author={suggestion.author_name || ""}
                    isAnonymous={suggestion.is_anonymous}
                    createdAt={formatSuggestionDate(suggestion.created_at)}
                    votesUp={suggestion.votes_up}
                    votesDown={suggestion.votes_down}
                    comments={suggestion.comments_count}
                  />
                ))}
              </div>
            ) : null}

            {/* CTA */}
            <div className="mt-12 text-center">
              <div className="inline-flex flex-col items-center p-8 bg-card rounded-2xl shadow-lg">
                <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                  Tem uma ideia para a cidade?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Envie sua sugestão e ajude a construir uma cidade melhor
                </p>
                <Link to="/forum" className="btn-hero-primary">
                  <MessageSquarePlus className="w-5 h-5" />
                  Enviar Sugestão
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* About Preview */}
        <section className="section-padding bg-background">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-primary font-medium text-sm uppercase tracking-wider">Conheça</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                  Quem é Priscila Rogério
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Mãe, esposa, cristã e comprometida com a nossa cidade. Acredito que a política 
                  deve ser feita com transparência, ética e proximidade com o povo.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Meu mandato é participativo porque acredito que as melhores decisões são tomadas 
                  junto com quem vive os problemas e desafios do dia a dia.
                </p>
                <Link 
                  to="/quem-sou" 
                  className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                >
                  Conhecer minha história
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-xl"></div>
                <div className="relative bg-card rounded-2xl p-8 shadow-xl">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                    Meus Compromissos
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-success/20 text-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                      <span className="text-foreground">Contra aumento de impostos</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-success/20 text-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                      <span className="text-foreground">Contra aumento de salário de políticos</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-success/20 text-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                      <span className="text-foreground">A favor de pautas sociais</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-success/20 text-success rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                      <span className="text-foreground">Valorização da família e do trabalho</span>
                    </li>
                  </ul>
                  <Link 
                    to="/compromissos" 
                    className="inline-flex items-center gap-2 text-primary font-medium mt-6 hover:gap-3 transition-all"
                  >
                    Ver todos os compromissos
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
