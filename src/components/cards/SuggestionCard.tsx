import { ThumbsUp, ThumbsDown, MessageCircle, User, Clock, MapPin, Tag } from "lucide-react";
import { useState } from "react";
import { useVote } from "@/hooks/useSuggestions";
import { toast } from "sonner";
import { CommentsSection } from "@/components/CommentsSection";
import { getSuggestionStatus } from "@/lib/suggestionStatus";

interface SuggestionCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  neighborhood?: string;
  author: string;
  isAnonymous: boolean;
  createdAt: string;
  votesUp: number;
  votesDown: number;
  comments: number;
  status?: string | null;
  adminResponse?: string | null;
}

const categoryLabels: Record<string, string> = {
  infraestrutura: "Infraestrutura",
  saude: "Saúde",
  educacao: "Educação",
  seguranca: "Segurança",
  social: "Social",
  meio_ambiente: "Meio Ambiente",
  cultura: "Cultura",
  transporte: "Transporte",
};

export function SuggestionCard({
  id,
  title,
  description,
  category,
  neighborhood,
  author,
  isAnonymous,
  createdAt,
  votesUp,
  votesDown,
  comments,
  status,
  adminResponse,
}: SuggestionCardProps) {
  const [showComments, setShowComments] = useState(false);
  const statusInfo = getSuggestionStatus(status);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [localVotesUp, setLocalVotesUp] = useState(votesUp);
  const [localVotesDown, setLocalVotesDown] = useState(votesDown);
  const [isVoting, setIsVoting] = useState(false);
  
  const voteMutation = useVote();

  const handleVote = async (type: "up" | "down") => {
    if (isVoting) return;
    
    setIsVoting(true);
    
    const previousVote = userVote;
    const previousUp = localVotesUp;
    const previousDown = localVotesDown;
    
    // Optimistic update
    if (userVote === type) {
      setUserVote(null);
      if (type === "up") setLocalVotesUp((prev) => prev - 1);
      else setLocalVotesDown((prev) => prev - 1);
    } else {
      if (userVote) {
        if (userVote === "up") setLocalVotesUp((prev) => prev - 1);
        else setLocalVotesDown((prev) => prev - 1);
      }
      setUserVote(type);
      if (type === "up") setLocalVotesUp((prev) => prev + 1);
      else setLocalVotesDown((prev) => prev + 1);
    }

    try {
      const result = await voteMutation.mutateAsync({
        itemType: "suggestion",
        itemId: id,
        vote: type,
      });
      
      setLocalVotesUp(result.votes_up);
      setLocalVotesDown(result.votes_down);
      setUserVote(result.user_vote);
    } catch (error) {
      setUserVote(previousVote);
      setLocalVotesUp(previousUp);
      setLocalVotesDown(previousDown);
      toast.error(error instanceof Error ? error.message : "Erro ao votar");
    } finally {
      setIsVoting(false);
    }
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      infraestrutura: "bg-blue-100 text-blue-700",
      saude: "bg-green-100 text-green-700",
      educacao: "bg-purple-100 text-purple-700",
      seguranca: "bg-red-100 text-red-700",
      social: "bg-orange-100 text-orange-700",
      meio_ambiente: "bg-emerald-100 text-emerald-700",
      cultura: "bg-pink-100 text-pink-700",
      transporte: "bg-cyan-100 text-cyan-700",
    };
    return colors[cat] || "bg-muted text-muted-foreground";
  };

  const displayCategory = categoryLabels[category] || category;

  return (
    <article className="card-interactive p-6 flex flex-col h-full border-l-4 border-l-secondary">
      {/* Author & Time */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-accent-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {isAnonymous ? "Cidadão Anônimo" : author}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {createdAt}
            </p>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`badge-status ${getCategoryColor(category)}`}>
          <Tag className="w-3 h-3" />
          {displayCategory}
        </span>
        {neighborhood && (
          <span className="badge-status bg-muted text-muted-foreground">
            <MapPin className="w-3 h-3" />
            {neighborhood}
          </span>
        )}
      </div>

      {/* Content */}
      <h3 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-2">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow line-clamp-4">
        {description}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVote("up")}
            disabled={isVoting}
            className={`vote-btn-positive ${userVote === "up" ? "vote-btn-active bg-success text-success-foreground" : ""} ${isVoting ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label="Apoiar sugestão"
          >
            <ThumbsUp className="w-4 h-4" />
            <span className="font-semibold">{localVotesUp}</span>
          </button>
          <button
            onClick={() => handleVote("down")}
            disabled={isVoting}
            className={`vote-btn-negative ${userVote === "down" ? "vote-btn-active bg-destructive text-destructive-foreground" : ""} ${isVoting ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label="Não apoiar sugestão"
          >
            <ThumbsDown className="w-4 h-4" />
            <span className="font-semibold">{localVotesDown}</span>
          </button>
        </div>
        <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-medium">{comments} comentários</span>
        </button>
      </div>
    </article>
  );
}
