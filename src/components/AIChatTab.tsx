import React, { useState, useRef, useEffect } from 'react';
import { DJFloriaDossier, ChatMessage } from '../types/branding';
import { Sparkles, Send, Bot, User, Copy, Check } from 'lucide-react';

interface AIChatTabProps {
  dossier: DJFloriaDossier;
}

export const AIChatTab: React.FC<AIChatTabProps> = ({ dossier }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Olá, Nathalia! Sou seu Diretor Criativo e Consultor Estratégico de Branding para o projeto **${dossier.name || 'Flória'}**.\n\nTenho em mãos todo o seu histórico oficial: sua formação na Yellow DJ Academy, mentoria com Kaká Franco, suas passagens mensais no Phunk Soundroom, seu legado como ex-DJ residente e única DJ constante da Mercadoteca (Shopping Crystal), seu diferencial na dança do ventre e o foco em Music Design B2B para eventos corporativos, hospitalidade e marcas de luxo.\n\nComo posso ajudar você hoje? Posso criar propostas comerciais para marcas, planejar postagens de autoridade no Instagram, roteirizar Reels ou afinar pitches para novos contratantes.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Como apresentar o conceito de Music Design para uma loja de decoração de luxo?',
    'Crie 3 opções de gancho para um Reel sobre som de coluna vs caixas brutas',
    'Como responder um cliente corporativo pedindo orçamento para vernissage?',
    'Ideia de carrossel no Instagram conectando a dança do ventre à sensibilidade musical',
    'Escreva uma proposta de e-mail para propor curadoria sonora em um estúdio wellness',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/branding/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dossier,
          messages: [...messages, userMessage],
          userMessage: textToSend,
        }),
      });

      const data = await response.json();
      if (data.success && data.text) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (err) {
      console.error('Error in chat:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-16">
      {/* Top Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 p-[1px]">
            <div className="w-full h-full bg-[#09090b] rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-orange-400" />
            </div>
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-neutral-100 flex items-center gap-2">
              Diretor Criativo IA • Flória (Nathalia Dias)
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-xs text-neutral-400 font-sans">
              Especialista em Music Design, Hospitalidade e Branding com Gemini 3.8 Flash
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-white/10 h-[520px] overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isAi = m.sender === 'ai';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="w-7 h-7 rounded-lg bg-orange-600/20 border border-orange-500/40 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-orange-400" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isAi
                    ? 'bg-neutral-900/90 border border-neutral-800 text-neutral-200 font-sans'
                    : 'bg-gradient-to-r from-orange-600 to-amber-600 text-white font-sans'
                }`}
              >
                <div className="whitespace-pre-line font-sans">{m.text}</div>
                
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-400 font-mono-code">
                  <span>{m.timestamp}</span>
                  {isAi && (
                    <button
                      onClick={() => copyMessage(m.text, m.id)}
                      className="text-neutral-400 hover:text-neutral-200 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === m.id ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  )}
                </div>
              </div>

              {!isAi && (
                <div className="w-7 h-7 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-neutral-300" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-neutral-400 p-2 font-mono-code">
            <Sparkles className="w-4 h-4 text-orange-400 animate-spin" />
            <span>O Diretor Criativo está formulando a resposta com o dossiê de Flória...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[10px] font-mono-code text-neutral-500 uppercase shrink-0">
          Sugestões rápidas:
        </span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-xs px-3 py-1.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 whitespace-nowrap transition-colors cursor-pointer font-sans"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="glass-panel rounded-2xl p-2 sm:p-2.5 border border-white/10 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte ao especialista sobre Music Design, contratos ou conteúdos..."
          className="flex-1 bg-transparent px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none font-sans"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md disabled:opacity-40 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
