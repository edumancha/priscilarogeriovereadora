import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <div className="w-24 h-24 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-8 shadow-glow">
          <span className="text-primary-foreground font-display text-4xl font-bold">404</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
          Página não encontrada
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:brightness-110 transition-all"
          >
            <Home className="w-5 h-5" />
            Voltar ao Início
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-border text-foreground font-medium rounded-xl hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Página Anterior
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
