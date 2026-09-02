import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-background">
        <section className="section-padding">
          <div className="section-container max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground tracking-tighter">
                Política de Privacidade
              </h1>
            </div>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Esta plataforma do mandato participativo da vereadora Priscila Rogério trata dados
                pessoais em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
              </p>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Quais dados coletamos</h2>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Sugestões e comentários enviados, com nome apenas quando você opta por se identificar.</li>
                  <li>Denúncias, incluindo nome e contato informados no formulário.</li>
                  <li>Dados técnicos mínimos (identificador do dispositivo e endereço IP) usados exclusivamente para evitar spam e votos duplicados.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Como usamos</h2>
                <p>
                  Os dados são usados para analisar demandas, dar retorno público sobre o andamento
                  das sugestões e apurar denúncias. Não vendemos nem compartilhamos dados com
                  terceiros para fins comerciais.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Quem tem acesso</h2>
                <p>
                  Denúncias e dados de contato são visíveis apenas para a equipe administrativa do
                  mandato, mediante login autenticado. Sugestões e comentários aprovados são públicos.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Seus direitos</h2>
                <p>
                  Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento
                  entrando em contato com o gabinete pelos canais divulgados neste site.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
