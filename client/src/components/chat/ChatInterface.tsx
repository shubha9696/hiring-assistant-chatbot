import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, User, Bot } from "lucide-react";
import { useChatLogic, ChatMessage } from "@/lib/chat-logic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import avatarImage from "@assets/generated_images/talentscout_ai_avatar.png";
import bgImage from "@assets/generated_images/subtle_tech_background.png";

export default function ChatInterface() {
  const { messages, processInput, isTyping, step } = useChatLogic();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    processInput(inputValue);
    setInputValue("");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 md:p-8 relative overflow-hidden">
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 opacity-50 pointer-events-none"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <Card className="w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl border-sidebar-border/40 bg-card/95 backdrop-blur-sm z-10 overflow-hidden relative">
        {/* Header */}
        <div className="p-4 border-b bg-white/50 dark:bg-black/20 flex items-center gap-4 backdrop-blur-md sticky top-0 z-20">
          <div className="relative h-12 w-12 rounded-xl overflow-hidden shadow-md border border-white/20">
            <img src={avatarImage} alt="TalentScout AI" className="object-cover w-full h-full" />
          </div>
          <div>
            <h1 className="font-header text-xl font-bold text-primary tracking-tight">TalentScout AI</h1>
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> 
              Online • Hiring Assistant
            </p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth" ref={scrollRef}>
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-start gap-3 max-w-[80%]"
            >
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                <Bot size={16} className="text-primary" />
              </div>
              <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/50 dark:bg-black/20 border-t backdrop-blur-md">
          <form onSubmit={handleSubmit} className="flex gap-2 relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={step === "CLOSING" ? "Conversation ended" : "Type your answer here..."}
              className="pr-12 py-6 text-base shadow-inner bg-background/80 border-primary/10 focus-visible:ring-primary/30"
              disabled={step === "CLOSING" || isTyping}
              autoFocus
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!inputValue.trim() || step === "CLOSING" || isTyping}
              className="absolute right-1.5 top-1.5 h-9 w-9 rounded-lg shadow-sm transition-all duration-200"
            >
              {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
          <div className="text-center mt-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold opacity-50">
              Powered by TalentScout AI Logic
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex items-end gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm border ${
        isUser 
          ? "bg-primary text-primary-foreground border-primary" 
          : "bg-white text-primary border-border"
      }`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] md:max-w-[70%] px-5 py-3.5 shadow-sm text-sm md:text-base leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-none"
            : "bg-white dark:bg-card text-card-foreground border border-border/50 rounded-2xl rounded-tl-none"
        }`}
      >
        {message.content}
      </div>
      
      {/* Timestamp (optional, hidden for minimal look but good for structure) */}
      <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </motion.div>
  );
}
