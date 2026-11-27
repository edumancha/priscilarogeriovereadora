import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CommitmentCard } from "@/components/cards/CommitmentCard";
import {
  Ban,
  DollarSign,
  FileX,
  Heart,
  Home,
  Briefcase,
  Church,
  Building2,
  Users,
} from "lucide-react";
import priscilaCommitments from "@/assets/priscila-library-desk.jpeg";

const commitments = [
  {
    title: "Contra aumento de impostos",
    description: "Compromisso firme contra qualquer aumento da carga tributária sobre os cidadãos e comerciantes locais.",
    status: "active" as const,
    icon: <Ban className="w-6 h-6" />,
  },
  {
    title: "Contra aumento de salários de políticos",
    description: "Posição contrária a qualquer reajuste de subsídios de vereadores enquanto a população enfrenta dificuldades.",
    status: "active" as const,
    icon: <DollarSign className="w-6 h-6" />,
  },
  {
    title: "Contra burocracias excessivas",
    description: "Luta pela simplificação de processos administrativos, facilitando a vida do cidadão e do empreendedor.",
    status: "active" as const,
    icon: <FileX className="w-6 h-6" />,
  },
  {
    title: "A favor de pautas sociais e pessoas vulneráveis",
    description: "Defesa intransigente de políticas públicas que protejam idosos, crianças, pessoas com deficiência e famílias em situação de vulnerabilidade.",
    status: "active" as const,
    icon: <Heart className="w-6 h-6" />,
  },
  {
    title: "Valorização da família",
    description: "Apoio a programas e ações que fortaleçam os vínculos familiares como base da sociedade.",
    status: "active" as const,
    icon: <Home className="w-6 h-6" />,
  },
  {
    title: "Valorização do trabalho",
    description: "Incentivo ao emprego, ao empreendedorismo local e à capacitação profissional para geração de renda.",
    status: "active" as const,
    icon: <Briefcase className="w-6 h-6" />,
  },
  {
    title: "Valorização da cultura e da fé",
    description: "Respeito e promoção das tradições culturais e religiosas que fazem parte da identidade da nossa cidade.",
    status: "active" as const,
    icon: <Church className="w-6 h-6" />,
  },
  {
    title: "Redução da máquina pública",
    description: "Busca por uma gestão pública mais enxuta, eficiente e menos onerosa para o contribuinte.",
    status: "monitoring" as const,
    icon: <Building2 className="w-6 h-6" />,
  },
  {
    title: "Valorização coerente dos servidores públicos",
    description: "Defesa de condições dignas de trabalho e remuneração justa para os servidores que atendem a população.",
    status: "monitoring" as const,
    icon: <Users className="w-6 h-6" />,
  },
];

export default function Commitments() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <section className="relative bg-gradient-hero text-primary-foreground py-16 md:py-24">
          <div className="section-container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Compromissos do Mandato
              </h1>
              <p className="text-lg text-primary-foreground/90">
                Conheça os princípios que guiam cada decisão e voto na Câmara Municipal
              </p>
            </div>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="section-container">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-4">
                {commitments.map((commitment, index) => (
                  <CommitmentCard key={index} {...commitment} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-muted/50">
          <div className="section-container">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div className="max-w-2xl">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Transparência Total
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Cada compromisso é acompanhado publicamente neste portal. Você pode verificar
                  as votações, projetos e ações relacionadas a cada um deles na página de Projetos.
                  A prestação de contas é um dever de todo representante público.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl"></div>
                <img
                  src={priscilaCommitments}
                  alt="Priscila Rogério em atividade de mandato no gabinete"
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
