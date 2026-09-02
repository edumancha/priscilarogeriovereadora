import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useComments, useCreateComment, type ItemType } from "@/hooks/useComments";

interface CommentsSectionProps {
  itemType: ItemType;
  itemId: string;
}

export function CommentsSection({ itemType, itemId }: CommentsSectionProps) {
  const { data: comments = [], isLoading, error } = useComments(itemType, itemId, true);
  const createComment = useCreateComment();
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createComment.mutateAsync({ itemType, itemId, content, authorName });
      setContent("");
      toast.success("Comentário publicado!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao comentar");
    }
  };

  const formatDate = (value: string) => {
    try {
      return formatDistanceToNow(new Date(value), { addSuffix: true, locale: ptBR });
    } catch {
      return value;
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-border space-y-4">
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          maxLength={80}
          placeholder="Seu nome (opcional)"
          className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          maxLength={1000}
          required
          placeholder="Escreva seu comentário..."
          className="w-full px-3 py-2 text-sm bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
        />
        <button
          type="submit"
          disabled={createComment.isPending}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
        >
          {createComment.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          Comentar
        </button>
      </form>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">Erro ao carregar comentários.</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum comentário ainda. Seja o primeiro!</p>
      ) : (
        <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {comments.map((comment) => (
            <li key={comment.id} className="bg-muted rounded-lg p-3">
              <p className="text-xs font-medium text-foreground">
                {comment.is_anonymous || !comment.author_name ? "Cidadão Anônimo" : comment.author_name}
                <span className="ml-2 font-normal text-muted-foreground">{formatDate(comment.created_at)}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{comment.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
