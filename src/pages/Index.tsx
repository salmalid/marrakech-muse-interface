import { useState, useRef, useEffect } from "react";
import { Send, Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatSidebar } from "@/components/ChatSidebar";
import { SuggestionCard } from "@/components/SuggestionCard";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/moroccan-hero.jpg";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Marhaba! 🌟 Welcome to Moroccan Hospitality Guide. I'm here to help you discover the finest restaurants, hotels, riads, cafés, and attractions across Morocco. What are you looking for today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: "I'd be delighted to help you with that! Let me show you some wonderful options that match your preferences. 🏰✨",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setShowSuggestions(true);
    }, 1000);
  };

  const mockSuggestions = [
    {
      name: "Riad Yasmine",
      type: "Riad",
      location: "Marrakech Medina",
      rating: 4.9,
      price: "$$",
      image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800",
      description: "Traditional Moroccan riad with stunning courtyard and authentic decor",
    },
    {
      name: "Le Jardin",
      type: "Restaurant",
      location: "Marrakech",
      rating: 4.7,
      price: "$$$",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800",
      description: "Beautiful garden restaurant serving contemporary Moroccan cuisine",
    },
    {
      name: "Café Clock",
      type: "Café",
      location: "Fes",
      rating: 4.6,
      price: "$",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
      description: "Cultural café famous for camel burgers and live music",
    },
  ];

  return (
    <div className="flex h-screen bg-gradient-warm overflow-hidden">
      {/* Sidebar - Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-80 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full bg-background">
          <div className="p-4 border-b border-border flex items-center justify-between lg:hidden">
            <h2 className="font-semibold">Filters</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <ChatSidebar />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="relative h-32 overflow-hidden border-b border-border/50">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Moroccan hospitality"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80 moroccan-pattern" />
          </div>
          <div className="relative h-full flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-white/20"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Moroccan Hospitality Guide
                </h1>
                <p className="text-sm text-white/90">Your AI companion for discovering Morocco</p>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <div className="max-w-4xl mx-auto">
            {messages.map((message, index) => (
              <ChatMessage key={index} {...message} />
            ))}

            {/* Suggestions */}
            {showSuggestions && (
              <div className="mt-8 animate-fade-in">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  Recommended for You
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockSuggestions.map((suggestion, index) => (
                    <SuggestionCard
                      key={index}
                      {...suggestion}
                      onClick={() => {
                        toast({
                          title: "Opening details...",
                          description: `Showing more information about ${suggestion.name}`,
                        });
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me about hotels, restaurants, or attractions in Morocco..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 border-border"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-gradient-moroccan text-white hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Discover the best of Moroccan hospitality - hotels, riads, restaurants, cafés & attractions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
