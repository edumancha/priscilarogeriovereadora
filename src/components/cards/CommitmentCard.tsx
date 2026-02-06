import { CheckCircle2, Clock } from "lucide-react";

interface CommitmentCardProps {
  title: string;
  description: string;
  status: "active" | "monitoring";
  icon?: React.ReactNode;
}

export function CommitmentCard({ title, description, status, icon }: CommitmentCardProps) {
  return (
    <div className="card-elevated p-6 flex gap-4">
      {icon && (
        <div className="flex-shrink-0 w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-primary">
          {icon}
        </div>
      )}
      <div className="flex-grow">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="font-display text-lg font-semibold text-foreground">
            {title}
          </h3>
          <span
            className={`flex-shrink-0 ${
              status === "active" ? "badge-active" : "badge-pending"
            }`}
          >
            {status === "active" ? (
              <>
                <CheckCircle2 className="w-3 h-3" />
                Ativo
              </>
            ) : (
              <>
                <Clock className="w-3 h-3" />
                Em acompanhamento
              </>
            )}
          </span>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
