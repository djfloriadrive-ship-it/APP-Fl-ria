import React, { useState } from 'react';
import { BrandPositioning } from '../types/branding';
import { Sparkles, Check, Copy, Flame, ShieldAlert, Award, Compass, Volume2, Quote } from 'lucide-react';

interface PositioningTabProps {
  positioning: BrandPositioning;
  onRefresh: () => void;
  isLoading: boolean;
}

export const PositioningTab: React.FC<PositioningTabProps> = ({
  positioning,
  onRefresh,
  isLoading,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel rounded-2xl p-6 border border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-code bg-orange-500/10 border border-orange-500/30 text-orange-300 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>DIRETRIZ ESTRATÉGICA DE BRANDING</span>
          </div>
          <h2 className="text-2xl font-heading font-bold text-neutral-100">
            Posicionamento & Manual de Marca • Flória
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl font-sans">
            Como Nathalia Dias se posiciona no mercado: Music Design de luxo para marcas, hospitalidade e pistas seletas.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-orange-300 border border-orange-500/30 text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Recalculando Posicionamento...' : 'Refinar com IA'}</span>
        </button>
      </div>

      {/* Main Tagline & Archetype Highlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Tagline Card */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 relative overflow-hidden flex flex-col justify-between space-y-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-3">
            <span className="text-xs font-mono-code uppercase text-orange-400 tracking-wider">
              Assinatura / Proposta de Valor
            </span>
            <blockquote className="text-xl sm:text-2xl font-heading font-bold text-neutral-100 leading-snug">
              "{positioning.tagline}"
            </blockquote>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-neutral-300">
              <span className="flex items-center gap-1.5 text-amber-400 font-mono-code">
                <Quote className="w-3.5 h-3.5" /> Declaração de Posicionamento Oficial
              </span>
              <button
                onClick={() => copyText(positioning.positioningStatement, 'statement')}
                className="text-neutral-400 hover:text-neutral-200 text-xs flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'statement' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedKey === 'statement' ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
              {positioning.positioningStatement}
            </p>
          </div>
        </div>

        {/* Archetype Card */}
        <div className="glass-panel-active rounded-2xl p-6 sm:p-7 border border-orange-500/40 relative flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-code uppercase text-orange-400 font-bold">
                Arquétipo Artístico
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-orange-500/20 text-orange-300 border border-orange-500/30">
                Persona
              </span>
            </div>

            <h3 className="text-xl font-heading font-bold text-neutral-100">
              {positioning.archetype?.name || 'A Arquiteta Sensorial'}
            </h3>

            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              {positioning.archetype?.description}
            </p>
          </div>

          <div className="pt-3 border-t border-orange-500/20">
            <h4 className="text-[11px] font-mono-code text-amber-300 uppercase mb-1">
              Energia no Espaço & Cabine:
            </h4>
            <p className="text-xs text-neutral-300 italic font-sans">
              "{positioning.archetype?.energy}"
            </p>
          </div>
        </div>
      </div>

      {/* Brand Manifesto */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-bold text-neutral-100 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <span>O Manifesto da Marca Flória</span>
          </h3>
          <button
            onClick={() => copyText(positioning.brandManifesto, 'manifesto')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700/60 transition-colors cursor-pointer"
          >
            {copiedKey === 'manifesto' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'manifesto' ? 'Manifesto Copiado!' : 'Copiar Manifesto'}</span>
          </button>
        </div>

        <div className="p-6 rounded-xl bg-neutral-900/60 border border-neutral-800 text-sm sm:text-base text-neutral-200 leading-relaxed font-sans whitespace-pre-line border-l-4 border-l-orange-500">
          {positioning.brandManifesto}
        </div>
      </div>

      {/* 4 Brand Pillars (Pilares de Marca) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-neutral-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-400" />
            <span>Os 4 Pilares Inegociáveis de Flória</span>
          </h3>
          <span className="text-xs font-mono-code text-neutral-500">Fundamentos de Marca</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {positioning.brandPillars?.map((pillar, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-xl p-5 border border-white/10 space-y-3 hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code text-orange-400">
                  PILAR 0{idx + 1}
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              </div>
              <h4 className="font-heading font-bold text-base text-neutral-100">
                {pillar.pillar}
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                {pillar.concept}
              </p>
              <div className="pt-2 border-t border-neutral-800/80">
                <span className="text-[11px] font-mono-code text-amber-400 block mb-0.5">
                  Como funciona na prática:
                </span>
                <p className="text-xs text-neutral-400 font-sans">
                  {pillar.inAction}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tone of Voice Guidelines: Dos & Don'ts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* DOs */}
        <div className="glass-panel rounded-2xl p-6 border border-emerald-500/20 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <Check className="w-5 h-5" />
            <h4 className="font-heading font-bold text-base text-neutral-100">
              Diretrizes de Comunicação (O que FAZER)
            </h4>
          </div>
          <p className="text-xs text-neutral-400 font-sans">
            Vocabulário e postura que elevam o prestígio corporativo e artístico de Flória:
          </p>

          <ul className="space-y-2.5">
            {positioning.toneOfVoice?.dos?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-neutral-200 font-sans">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0 font-mono-code">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* DON'Ts */}
        <div className="glass-panel rounded-2xl p-6 border border-rose-500/20 space-y-4">
          <div className="flex items-center gap-2 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
            <h4 className="font-heading font-bold text-base text-neutral-100">
              Erros Fatais (O que NUNCA fazer na marca)
            </h4>
          </div>
          <p className="text-xs text-neutral-400 font-sans">
            Comportamentos que diluem a sofisticação e o posicionamento de luxo de Flória:
          </p>

          <ul className="space-y-2.5">
            {positioning.toneOfVoice?.donts?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-neutral-300 font-sans">
                <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0 font-mono-code">
                  ✕
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Booker Pitch & Competitive Differentiation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Differentiation */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-3">
          <h4 className="font-heading font-bold text-base text-neutral-100 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-orange-400" />
            <span>Diferencial Competitivo no Mercado</span>
          </h4>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
            {positioning.competitiveEdge}
          </p>
        </div>

        {/* Booker Pitch */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-bold text-base text-neutral-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Pitch para Contratantes B2B & Privates</span>
            </h4>
            <button
              onClick={() => copyText(positioning.bookerPitch, 'pitch')}
              className="text-neutral-400 hover:text-neutral-200 text-xs flex items-center gap-1 cursor-pointer font-mono-code"
            >
              {copiedKey === 'pitch' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedKey === 'pitch' ? 'Copiado!' : 'Copiar Pitch'}
            </button>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 font-mono-code leading-relaxed">
            "{positioning.bookerPitch}"
          </div>
        </div>

      </div>
    </div>
  );
};
