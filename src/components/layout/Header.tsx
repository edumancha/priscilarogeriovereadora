import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, MessageSquarePlus, AlertTriangle, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { path: "/", label: "Início" },
  { path: "/quem-sou", label: "Quem é Priscila" },
  { path: "/compromissos", label: "Compromissos" },
  { path: "/projetos", label: "Projetos" },
  { path: "/forum", label: "Mandato Participativo" },
];

export function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
      <div className="section-container">
        <div className="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-4 md:h-20 md:gap-6">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-hero shadow-glow md:h-12 md:w-12">
              <span className="text-lg font-bold tracking-tight text-primary-foreground md:text-xl">PR</span>
              <span className="absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-secondary" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-foreground md:text-base">
                Priscila Rogério
              </p>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground md:text-xs">
                <span className="truncate">Vereadora</span>
                <span className="h-1 w-1 rounded-full bg-secondary" />
                <span className="truncate">Mandato Participativo</span>
              </div>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center justify-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? "nav-link-active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-2 md:gap-3">
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/denuncias"
                className="inline-flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground"
              >
                <AlertTriangle className="h-4 w-4" />
                Denúncias
              </Link>
              <Link
                to="/forum"
                className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-all duration-200 hover:brightness-110"
              >
                <MessageSquarePlus className="h-4 w-4" />
                Participar
              </Link>
              <Link
                to={isAdmin ? "/admin" : "/auth"}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-accent hover:text-primary"
                title={isAdmin ? "Painel Admin" : "Login Admin"}
              >
                <Shield className="h-4 w-4" />
              </Link>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-lg p-2 text-foreground transition-colors hover:bg-accent xl:hidden"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="animate-fade-in border-t border-border py-4 xl:hidden">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`rounded-lg px-4 py-3 font-medium transition-colors ${
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
              <Link
                to="/denuncias"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
              >
                <AlertTriangle className="h-4 w-4" />
                Denúncias
              </Link>
              <Link
                to="/forum"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-3 text-sm font-medium text-secondary-foreground"
              >
                <MessageSquarePlus className="h-4 w-4" />
                Participar do Mandato
              </Link>
              <Link
                to={isAdmin ? "/admin" : "/auth"}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-medium text-muted-foreground"
              >
                <Shield className="h-4 w-4" />
                {isAdmin ? "Painel Admin" : "Acesso Admin"}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
