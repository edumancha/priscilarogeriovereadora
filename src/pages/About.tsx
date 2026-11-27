import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Users, Shield, Award } from "lucide-react";
import priscilaBiography from "@/assets/priscila-hero.jpeg";
import priscilaAction from "@/assets/priscila-speaking.jpeg";

const values = [
  {
    icon: Heart,
    title: "Fé e Família",
    description: "Valores cristãos como base para uma vida pública íntegra e comprometida com o bem comum.",
  },
  {
    icon: Users,
    title: "Proximidade",
    description: "Mandato participativo que ouve e representa os anseios reais da população.",
  },
  {
    icon: Shield,
    title: "Transparência",
    description: "Compromisso absoluto com a prestação de contas e clareza em todas as ações.",
  },
  {
    icon: Award,
    title: "Ética",
    description: "Conduta irrepreensível como base para a confiança entre representante e representados.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <section className="relative bg-gradient-hero text-primary-foreground py-16 md:py-24">
          <div className="section-container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Quem é Priscila Rogério
              </h1>
              <p className="text-lg text-primary-foreground/90">
                Conheça a história, os valores e os compromissos de quem trabalha por você
              </p>
            </div>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-secondary/20 rounded-3xl blur-2xl"></div>
                <img
                  src={priscilaBiography}
                  alt="Priscila Rogério em evento público do mandato"
                  className="relative mx-auto aspect-[4/5] w-full max-w-md rounded-2xl object-cover shadow-2xl"
                />
              </div>

              <div>
                <span className="text-primary font-medium text-sm uppercase tracking-wider">Minha História</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                  Uma trajetória de compromisso
                </h2>

                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Mãe dedicada, esposa amorosa e cristã convicta. Minha jornada na vida pública
                    nasceu do desejo genuíno de fazer a diferença na vida das pessoas da nossa cidade.
                  </p>
                  <p>
                    Acredito que a política é um instrumento de transformação social, e por isso
                    me dedico a um mandato participativo, onde cada cidadão tem voz e seu voto
                    realmente conta.
                  </p>
                  <p>
                    Minha formação e minha fé me ensinaram que servir ao próximo é a mais nobre
                    das missões. É com esse espírito que assumo cada projeto, cada votação,
                    cada decisão no exercício do mandato.
                  </p>
                  <p>
                    Sou defensora da família, do trabalho digno, da cultura local e da fé como
                    pilares de uma sociedade justa e solidária. Contra burocracias excessivas
                    e a favor de uma gestão pública eficiente e transparente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-muted/50">
          <div className="section-container">
            <div className="text-center mb-12">
              <span className="text-primary font-medium text-sm uppercase tracking-wider">Princípios</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
                Meus Valores
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="card-elevated p-6 text-center group hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                >
                  <div className="w-14 h-14 bg-accent group-hover:bg-primary-foreground/20 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                    <value.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground group-hover:text-primary-foreground/80 transition-colors">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-primary font-medium text-sm uppercase tracking-wider">Em Ação</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                  Trabalhando pela cidade
                </h2>

                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    No dia a dia do mandato, estou presente nas comunidades, ouvindo as demandas,
                    levando as necessidades do povo para a Câmara e fiscalizando as ações do
                    poder público.
                  </p>
                  <p>
                    Através deste portal participativo, você pode acompanhar cada projeto,
                    sugerir novas ideias e votar nas propostas que considera mais importantes
                    para nossa cidade.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Link to="/compromissos" className="btn-hero-primary">
                    Ver Compromissos
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/projetos"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    Ver Projetos
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl"></div>
                <img
                  src={priscilaAction}
                  alt="Priscila Rogério discursando na tribuna"
                  className="relative mx-auto aspect-[4/5] w-full max-w-md rounded-2xl object-cover shadow-2xl lg:ml-auto"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
