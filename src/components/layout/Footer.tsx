import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="section-container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Sobre */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-secondary-foreground font-display font-bold text-xl">PR</span>
              </div>
              <div>
                <p className="font-display font-semibold text-lg">Priscila Rogério</p>
                <p className="text-sm text-primary-foreground/80">Vereadora</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Mandato participativo digital. Trabalhando com transparência e próxima do povo 
              para construir uma cidade melhor para todos.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Links Rápidos</h4>
            <nav className="flex flex-col gap-3">
              <Link to="/quem-sou" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                Quem é Priscila
              </Link>
              <Link to="/compromissos" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                Compromissos
              </Link>
              <Link to="/projetos" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                Projetos
              </Link>
              <Link to="/forum" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                Mandato Participativo
              </Link>
              <Link to="/denuncias" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                Portal de Denúncias
              </Link>
            </nav>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Contato</h4>
            <div className="flex flex-col gap-4">
              <a href="mailto:contato@priscilariogerio.com.br" className="flex items-center gap-3 text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                <Mail className="w-4 h-4" />
                contato@priscilariogerio.com.br
              </a>
              <a href="tel:+5500000000000" className="flex items-center gap-3 text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                <Phone className="w-4 h-4" />
                (00) 0000-0000
              </a>
              <p className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <MapPin className="w-4 h-4" />
                Câmara Municipal
              </p>
            </div>
          </div>

          {/* Redes Sociais */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Redes Sociais</h4>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all duration-200"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <p className="mt-6 text-sm text-primary-foreground/60">
              Acompanhe nosso trabalho nas redes sociais
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-primary-foreground/60">
              © {new Date().getFullYear()} Priscila Rogério. Todos os direitos reservados.
            </p>
            <p className="text-sm text-primary-foreground/60">
              Mandato Participativo Digital • Transparência e Proximidade
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
