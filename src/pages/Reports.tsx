import { useState } from "react";
import { z } from "zod";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AlertTriangle, Send, Loader2, ShieldCheck, Lock, FileWarning } from "lucide-react";
import priscilaOffice from "@/assets/priscila-white-seated.png.asset.json";

const reportSchema = z.object({
  reporter_name: z.string().trim().min(2, "Informe seu nome completo").max(120),
  reporter_contact: z.string().trim().min(5, "Informe um contato válido").max(160),
  category: z.string().min(1, "Selecione uma categoria"),
  title: z.string().trim().min(5, "Título muito curto").max(160),
  description: z.string().trim().min(20, "Descreva com mais detalhes (mín. 20 caracteres)").max(2000),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  neighborhood: z.string().trim().max(120).optional().or(z.literal("")),
});

const categories = [
  { value: "corrupcao", label: "Corrupção / Desvio de recursos" },
  { value: "infraestrutura", label: "Problema de infraestrutura" },
  { value: "servico_publico", label: "Mau atendimento em serviço público" },
  { value: "saude", label: "Saúde pública" },
  { value: "educacao", label: "Educação" },
  { value: "seguranca", label: "Segurança" },
  { value: "meio_ambiente", label: "Meio ambiente" },
  { value: "outro", label: "Outro" },
];

export default function Reports() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    reporter_name: "",
    reporter_contact: "",
    category: "",
    title: "",
    description: "",
    location: "",
    neighborhood: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = reportSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("reports").insert({
        reporter_name: form.reporter_name,
        reporter_contact: form.reporter_contact,
        category: form.category,
        title: form.title,
        description: form.description,
        location: form.location || null,
        neighborhood: form.neighborhood || null,
      });
      if (error) throw error;
      toast.success("Denúncia enviada com sucesso. Sua identidade é protegida.");
      setForm({
        reporter_name: "",
        reporter_contact: "",
        category: "",
        title: "",
        description: "",
        location: "",
        neighborhood: "",
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar denúncia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <section className="relative bg-gradient-hero text-primary-foreground py-16 md:py-24">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                  <AlertTriangle className="w-4 h-4" />
                  Portal de Denúncias
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter">
                  Sua denúncia <span className="text-secondary">faz a diferença</span>
                </h1>
                <p className="text-lg text-primary-foreground/90 leading-relaxed max-w-xl">
                  Registre situações que precisam de atenção do mandato. Cada relato é tratado
                  com seriedade, sigilo e responsabilidade.
                </p>
                <div className="grid sm:grid-cols-3 gap-3 mt-8">
                  <div className="flex items-center gap-2 text-sm text-primary-foreground/90">
                    <ShieldCheck className="w-5 h-5 text-secondary" /> Sigilo garantido
                  </div>
                  <div className="flex items-center gap-2 text-sm text-primary-foreground/90">
                    <Lock className="w-5 h-5 text-secondary" /> Dados protegidos
                  </div>
                  <div className="flex items-center gap-2 text-sm text-primary-foreground/90">
                    <FileWarning className="w-5 h-5 text-secondary" /> Resposta rápida
                  </div>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="absolute -inset-4 bg-secondary/20 rounded-3xl blur-2xl" />
                <img
                  src={priscilaOffice.url}
                  alt="Priscila Rogério em retrato do gabinete do mandato"
                  className="relative aspect-[4/5] w-full rounded-2xl object-cover shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-background">
          <div className="section-container max-w-3xl">
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-lg border border-border p-6 md:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground tracking-tighter mb-1">Formulário de Denúncia</h2>
                <p className="text-sm text-muted-foreground">Todos os campos com * são obrigatórios.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Seu nome *</label>
                  <input
                    type="text"
                    required
                    value={form.reporter_name}
                    onChange={(e) => setForm({ ...form, reporter_name: e.target.value })}
                    className="w-full px-4 py-3 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Contato (email ou telefone) *</label>
                  <input
                    type="text"
                    required
                    value={form.reporter_contact}
                    onChange={(e) => setForm({ ...form, reporter_contact: e.target.value })}
                    className="w-full px-4 py-3 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Categoria *</label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Selecione...</option>
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Título *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Resumo do que está acontecendo"
                  className="w-full px-4 py-3 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Descrição detalhada *</label>
                <textarea
                  required
                  rows={6}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Descreva o ocorrido com o maior número de detalhes possível: o que aconteceu, quando, quem está envolvido..."
                  className="w-full px-4 py-3 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Local (endereço, ponto de referência)</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-3 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Bairro</label>
                  <input
                    type="text"
                    value={form.neighborhood}
                    onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                    className="w-full px-4 py-3 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="p-4 bg-accent rounded-lg text-sm text-accent-foreground">
                <strong>🔒 Privacidade:</strong> Seus dados pessoais são acessíveis apenas pela equipe administrativa do mandato e serão usados exclusivamente para tratar esta denúncia.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Enviar Denúncia
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
