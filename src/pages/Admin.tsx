import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";
import { Loader2, Trash2, ShieldAlert, MessageSquare, FileWarning, LogOut, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Tab = "reports" | "suggestions";

export default function Admin() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("reports");
  const [reports, setReports] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (isAdmin) loadAll();
  }, [isAdmin]);

  const loadAll = async () => {
    setBusy(true);
    const [r, s] = await Promise.all([
      supabase.from("reports").select("*").order("created_at", { ascending: false }),
      supabase.from("suggestions").select("*").order("created_at", { ascending: false }),
    ]);
    if (r.data) setReports(r.data);
    if (s.data) setSuggestions(s.data);
    setBusy(false);
  };

  const deleteReport = async (id: string) => {
    if (!confirm("Apagar esta denúncia permanentemente?")) return;
    const { error } = await supabase.from("reports").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Denúncia apagada");
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  const updateReportStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("reports").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    toast.success("Status atualizado");
  };

  const deleteSuggestion = async (id: string) => {
    if (!confirm("Apagar esta sugestão do mandato participativo?")) return;
    const { error } = await supabase.from("suggestions").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Sugestão apagada");
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-8">
          <div className="max-w-md text-center bg-card border border-border rounded-2xl p-8 shadow-lg">
            <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-foreground tracking-tighter mb-2">Acesso negado</h1>
            <p className="text-muted-foreground mb-6">
              Sua conta ({user?.email}) não tem permissão de administrador.
              Solicite a um administrador que conceda acesso ao seu usuário.
            </p>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/70 text-sm"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-muted/40 py-10">
        <div className="section-container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tighter">Painel Administrativo</h1>
              <p className="text-muted-foreground text-sm mt-1">Logada como {user?.email}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={loadAll} className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted text-sm">
                <RefreshCw className="w-4 h-4" /> Atualizar
              </button>
              <button onClick={signOut} className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted text-sm">
                <LogOut className="w-4 h-4" /> Sair
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-card border border-border rounded-lg w-fit">
            <button
              onClick={() => setTab("reports")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                tab === "reports" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileWarning className="w-4 h-4" /> Denúncias ({reports.length})
            </button>
            <button
              onClick={() => setTab("suggestions")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                tab === "suggestions" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Mandato Participativo ({suggestions.length})
            </button>
          </div>

          {busy ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : tab === "reports" ? (
            <div className="space-y-4">
              {reports.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">Nenhuma denúncia recebida.</div>
              ) : reports.map((r) => (
                <div key={r.id} className="bg-card border border-border rounded-xl p-5 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">{r.category}</span>
                        <select
                          value={r.status}
                          onChange={(e) => updateReportStatus(r.id, e.target.value)}
                          className="text-xs px-2 py-1 bg-muted rounded border border-border"
                        >
                          <option value="pending">Pendente</option>
                          <option value="in_review">Em análise</option>
                          <option value="resolved">Resolvida</option>
                          <option value="archived">Arquivada</option>
                        </select>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(r.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{r.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 whitespace-pre-wrap">{r.description}</p>
                      <div className="grid sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div><strong>Denunciante:</strong> {r.reporter_name}</div>
                        <div><strong>Contato:</strong> {r.reporter_contact}</div>
                        {r.location && <div><strong>Local:</strong> {r.location}</div>}
                        {r.neighborhood && <div><strong>Bairro:</strong> {r.neighborhood}</div>}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteReport(r.id)}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-all text-sm"
                    >
                      <Trash2 className="w-4 h-4" /> Apagar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {suggestions.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">Nenhuma sugestão recebida.</div>
              ) : suggestions.map((s) => (
                <div key={s.id} className="bg-card border border-border rounded-xl p-5 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">{s.category}</span>
                        {s.neighborhood && <span className="text-xs text-muted-foreground">📍 {s.neighborhood}</span>}
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(s.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{s.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2 whitespace-pre-wrap">{s.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Por: {s.is_anonymous ? "Anônimo" : s.author_name || "—"} • 👍 {s.votes_up} • 👎 {s.votes_down}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteSuggestion(s.id)}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-all text-sm"
                    >
                      <Trash2 className="w-4 h-4" /> Apagar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
