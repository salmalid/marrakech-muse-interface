import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export const ChatMessage = ({ role, content, timestamp }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div className={cn("flex gap-3 mb-4 animate-fade-in", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-moroccan flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-semibold">M</span>
        </div>
      )}
      <div className={cn("max-w-[80%] md:max-w-[70%]", isUser && "order-first")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 shadow-soft",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : "bg-card text-card-foreground rounded-bl-sm border border-border"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
        {timestamp && (
          <p className={cn("text-xs text-muted-foreground mt-1 px-2", isUser && "text-right")}>
            {timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-semibold">U</span>
        </div>
      )}
    </div>
  );
};
