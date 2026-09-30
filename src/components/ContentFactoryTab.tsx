import React, { useState } from 'react';
import { DJFloriaDossier, GeneratedContentBatch, ContentPiece } from '../types/branding';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Calendar, 
  Film, 
  Layers, 
  Mail, 
  Newspaper,
  ShieldAlert,
  Headphones
} from 'lucide-react';

interface ContentFactoryTabProps {
  dossier: DJFloriaDossier;
}

export const ContentFactoryTab: React.FC<ContentFactoryTabProps> = ({ dossier }) => {
  const [contentType, setContentType] = useState<'Calendário Semanal' | 'Roteiro de Reel' | 'Carrossel 5 Slides' | 'Pitch para Booker' | 'Press Release'>('Calendário Semanal');
  const [goal, setGoal] = useState('Posicionar Flória como referência em Music Design e curadoria sonora para eventos corporativos e marcas');
  const [customBrief, setCustomBrief] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [batch, setBatch] = useState<GeneratedContentBatch | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const contentModes = [
    { id: 'Calendário Semanal', label: 'Calendário Semanal', icon: Calendar, desc: 'Grade de 7 dias com foco em marcas e autoridade' },
    { id: 'Roteiro de Reel', label: 'Reel de Alto Impacto', icon: Film, desc: 'Fórmula com timecode e gancho de 2 segundos' },
    { id: 'Carrossel 5 Slides', label: 'Carrossel Educativo', icon: Layers, desc: 'Slide por slide para valorizar o Music Design' },
    { id: 'Pitch para Booker', label: 'Pitch para Booker / B2B', icon: Mail, desc: 'E-mail profissional para eventos corporativos e marcas' },
    { id: 'Press Release', label: 'Press Release Oficial', icon: Newspaper, desc: 'Texto para assessoria de imprensa e blogs' },
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/branding/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dossier,
          contentType,
          goal,
          customInstructions: customBrief,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setBatch(data.data);
      }
    } catch (err) {
      console.error('Error generating content:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyPiece = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-code bg-orange-500/10 border border-orange-500/30 text-orange-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FÁBRICA DE CONTEÚDOS INTELIGENTES</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-neutral-100">
          Gere Conteúdos Prontos para Postar
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-3xl font-sans">
          Selecione o formato desejado e o especialista em branding gera conteúdos completos, legendas formatadas com hashtags e ganchos de alta retenção para <strong>{dossier.name || 'Flória'}</strong>.
        </p>

        {/* Content Mode Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {contentModes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = contentType === mode.id;

            return (
              <button
                key={mode.id}
                onClick={() => setContentType(mode.id as any)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-800/90 border-orange-500 text-white shadow-md shadow-orange-500/15'
                    : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-orange-400' : 'text-neutral-500'}`} />
                <div className="font-heading font-bold text-xs truncate">
                  {mode.label}
                </div>
                <div className="text-[10px] text-neutral-500 line-clamp-1 mt-0.5 font-sans">
                  {mode.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Briefing Inputs */}
        <div className="pt-4 border-t border-neutral-800 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono-code text-neutral-400 mb-1">
              Objetivo Estratégico:
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Ex: Atrair marcas corporativas, divulgar set do Phunk, ativar lojas de moda..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-orange-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono-code text-neutral-400 mb-1">
              Instruções Específicas / Pauta do Momento:
            </label>
            <input
              type="text"
              value={customBrief}
              onChange={(e) => setCustomBrief(e.target.value)}
              placeholder="Ex: Destacar o setup de som de coluna, falar de arquitetura sensorial..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-orange-500 font-sans"
            />
          </div>
        </div>

        {/* Active Filters and Exclusions Status */}
        {(dossier.currentExploringGenres || dossier.excludedTopicsAndOutdatedInfo) && (
          <div className="pt-3 border-t border-neutral-800/80 flex flex-wrap items-center gap-2 text-xs">
            {dossier.currentExploringGenres && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-300 font-mono-code text-[11px]">
                <Headphones className="w-3.5 h-3.5" />
                <span>Novos Gêneros Ativos no Prompt</span>
              </span>
            )}
            {dossier.excludedTopicsAndOutdatedInfo && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono-code text-[11px]">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Filtro de Exclusões Ativo (Temas Banidos da Copy)</span>
              </span>
            )}
          </div>
        )}

        {/* Generate Trigger */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Construindo Conteúdo...' : `Criar ${contentType}`}</span>
          </button>
        </div>
      </div>

      {/* Generated Content Output Display */}
      {batch && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-orange-950/20 border border-orange-500/30">
            <div>
              <h3 className="font-heading font-bold text-lg text-neutral-100">
                {batch.title}
              </h3>
              <p className="text-xs text-neutral-300 font-sans">
                {batch.summary}
              </p>
            </div>
            {batch.curatorTip && (
              <div className="text-[11px] font-mono-code text-amber-300 max-w-sm sm:text-right">
                💡 Dica de Curadoria: {batch.curatorTip}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {batch.contentPieces?.map((piece, idx) => (
              <div
                key={idx}
                className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4 flex flex-col justify-between hover:border-neutral-700 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-code px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-700 text-amber-400 font-bold">
                      {piece.dayOrType}
                    </span>
                    <span className="text-[10px] font-mono-code text-orange-400 px-2 py-0.5 rounded bg-orange-500/10">
                      {piece.platform} • {piece.format}
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-base text-neutral-100">
                    {piece.hookOrSubject}
                  </h4>

                  {piece.visualDescription && (
                    <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs">
                      <span className="font-mono-code text-amber-400 font-bold block mb-1">
                        🎬 DIREÇÃO DE VÍDEO / VISUAL:
                      </span>
                      <p className="text-neutral-300 font-sans">{piece.visualDescription}</p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[11px] font-mono-code text-neutral-400 uppercase">
                      Legenda / Texto Completo:
                    </span>
                    <div className="p-3.5 rounded-xl bg-[#09090b] border border-neutral-800 font-sans text-xs text-neutral-200 whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto">
                      {piece.copyText}
                    </div>
                  </div>

                  {piece.audioOrBPM && (
                    <div className="text-[11px] text-neutral-400 font-mono-code">
                      <span className="text-amber-400">Áudio / Atmosfera sugerida:</span> {piece.audioOrBPM}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400 font-mono-code">
                    CTA: <span className="text-neutral-200 font-sans">{piece.cta}</span>
                  </span>
                  <button
                    onClick={() => copyPiece(piece.copyText, idx)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 transition-colors cursor-pointer font-mono-code"
                  >
                    {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIdx === idx ? 'Copiado!' : 'Copiar Texto'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pre-seeded example state if user hasn't generated yet */}
      {!batch && (
        <div className="glass-panel rounded-2xl p-8 border border-white/10 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-neutral-900 flex items-center justify-center text-orange-400 border border-neutral-800">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-lg text-neutral-200">
            Nenhum lote gerado nesta sessão ainda
          </h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto font-sans">
            Clique no botão acima para construir um lote exclusivo de conteúdos estruturados para a marca Flória.
          </p>
        </div>
      )}
    </div>
  );
};
