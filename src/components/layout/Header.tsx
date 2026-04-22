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
  { path: "/denuncias", label: "Denúncias" },
];

export function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="section-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-hero rounded-full flex items-center justify-center shadow-glow">
              <span className="text-primary-foreground font-bold text-lg md:text-xl tracking-tight">PR</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-semibold text-foreground text-sm md:text-base tracking-tight">Priscila Rogério</p>
              <p className="text-xs text-muted-foreground">Vereadora • Mandato Participativo</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
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

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/denuncias"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive bg-destructive/10 rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
            >
              <AlertTriangle className="w-4 h-4" />
              Denunciar
            </Link>
            <Link
              to="/forum"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded-lg hover:brightness-110 transition-all duration-200 shadow-sm"
            >
              <MessageSquarePlus className="w-4 h-4" />
              Envie sua Ideia
            </Link>
            <Link
              to={isAdmin ? "/admin" : "/auth"}
              className="inline-flex items-center justify-center w-9 h-9 text-muted-foreground hover:text-primary hover:bg-accent rounded-lg transition-all"
              title={isAdmin ? "Painel Admin" : "Login Admin"}
            >
              <Shield className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:bg-accent rounded-lg transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-border">
              <Link
                to="/denuncias"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-destructive bg-destructive/10 rounded-lg"
              >
                <AlertTriangle className="w-4 h-4" />
                Denunciar
              </Link>
              <Link
                to="/forum"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium bg-secondary text-secondary-foreground rounded-lg"
              >
                <MessageSquarePlus className="w-4 h-4" />
                Envie sua Ideia
              </Link>
              <Link
                to={isAdmin ? "/admin" : "/auth"}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground border border-border rounded-lg"
              >
                <Shield className="w-4 h-4" />
                {isAdmin ? "Painel Admin" : "Acesso Admin"}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
