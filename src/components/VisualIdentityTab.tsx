import React, { useState } from 'react';
import { VisualIdentity } from '../types/branding';
import { 
  Sparkles, 
  Palette, 
  Copy, 
  Check, 
  Type, 
  Eye, 
  Shirt, 
  Radio,
  Sliders
} from 'lucide-react';

interface VisualIdentityTabProps {
  visual: VisualIdentity;
  onRefresh: () => void;
  isLoading: boolean;
}

export const VisualIdentityTab: React.FC<VisualIdentityTabProps> = ({
  visual,
  onRefresh,
  isLoading,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [mockupMode, setMockupMode] = useState<'b2b' | 'album'>('b2b');

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel rounded-2xl p-6 border border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-code bg-orange-500/10 border border-orange-500/30 text-orange-300 mb-2">
            <Palette className="w-3.5 h-3.5" />
            <span>UNIVERSO VISUAL & PALETA OFICIAL</span>
          </div>
          <h2 className="text-2xl font-heading font-bold text-neutral-100">
            Identidade Visual Oficial • Flória (Nathalia Dias)
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl font-sans">
            iOS Dark Glassmorphism, preto obsidiana profundo (#09090B), acentos quentes em Laranja Âmbar (#F97316) e tipografia serifada Playfair Display.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-orange-300 border border-orange-500/30 text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Recalculando Paleta...' : 'Refinar com IA'}</span>
        </button>
      </div>

      {/* Concept Hero */}
      <div className="glass-panel-active rounded-2xl p-6 sm:p-8 border border-orange-500/30 space-y-3">
        <span className="text-xs font-mono-code uppercase text-orange-400 tracking-wider">
          Conceito Visual Central
        </span>
        <h3 className="text-xl sm:text-2xl font-heading font-bold text-neutral-100">
          {visual.conceptTitle}
        </h3>
        <p className="text-sm text-neutral-300 leading-relaxed font-sans max-w-4xl">
          {visual.conceptDescription}
        </p>

        {/* Moodboard Keywords */}
        <div className="pt-4 flex flex-wrap items-center gap-2">
          {visual.moodboardKeywords?.map((kw, idx) => (
            <span
              key={idx}
              className="text-xs font-mono-code px-3 py-1 rounded-full bg-neutral-900/90 text-neutral-300 border border-neutral-700/80"
            >
              #{kw}
            </span>
          ))}
        </div>
      </div>

      {/* Interactive Color Palette */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-neutral-100 flex items-center gap-2">
            <Palette className="w-5 h-5 text-orange-400" />
            <span>Mapeamento Cromático Oficial (Clique para Copiar o HEX)</span>
          </h3>
          <span className="text-xs font-mono-code text-neutral-500">Paleta Oficial do Site e Press Kit</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {visual.palette?.map((swatch, idx) => (
            <div
              key={idx}
              onClick={() => copyHex(swatch.hex)}
              className="glass-panel rounded-2xl p-4 border border-white/10 space-y-3 cursor-pointer group hover:border-orange-500/50 transition-all transform hover:-translate-y-1"
            >
              {/* Color Box */}
              <div
                className="w-full h-24 rounded-xl shadow-inner border border-white/10 relative flex items-end justify-end p-2 transition-transform group-hover:scale-[1.02]"
                style={{ backgroundColor: swatch.hex }}
              >
                <span className="p-1 rounded bg-black/70 backdrop-blur-md text-white text-[10px] font-mono-code flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {copiedHex === swatch.hex ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedHex === swatch.hex ? 'Copiado!' : 'Copiar'}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono-code font-bold text-sm text-neutral-100 uppercase">
                    {swatch.hex}
                  </span>
                  <span className="text-[10px] font-mono-code text-orange-400">
                    C0{idx + 1}
                  </span>
                </div>
                <h4 className="font-heading font-semibold text-xs text-neutral-200 mt-0.5">
                  {swatch.name}
                </h4>
                <div className="text-[11px] font-mono-code text-amber-400 mt-1">
                  {swatch.role}
                </div>
                <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 font-sans">
                  {swatch.usage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Mockup & Typography System */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Mockup Preview (Event Flyer / Album Art) */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-neutral-100 flex items-center gap-2">
              <Eye className="w-5 h-5 text-orange-400" />
              <span>Simulador Visual iOS Dark Glassmorphism</span>
            </h3>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
              <button
                onClick={() => setMockupMode('b2b')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  mockupMode === 'b2b'
                    ? 'bg-orange-500 text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Convite B2B / Vernissage
              </button>
              <button
                onClick={() => setMockupMode('album')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  mockupMode === 'album'
                    ? 'bg-orange-500 text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Capa de Set SoundCloud
              </button>
            </div>
          </div>

          {/* Simulated Artwork Container */}
          <div className="relative aspect-[4/5] w-full max-w-sm mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#09090b] p-6 flex flex-col justify-between">
            {/* Background Warm Amber Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Top Artwork Bar */}
            <div className="relative z-10 flex items-center justify-between text-[11px] font-mono-code text-neutral-400 border-b border-white/10 pb-3">
              <span className="tracking-widest uppercase text-amber-400">
                {mockupMode === 'b2b' ? 'MUSIC DESIGN EXPERIENCE' : 'DAY LISTENING SESSION'}
              </span>
              <span className="text-orange-400 font-bold">FLÓRIA ✦</span>
            </div>

            {/* Central Graphic Element */}
            <div className="relative z-10 text-center space-y-3 my-auto">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-600 p-[1.5px] shadow-lg shadow-orange-500/20">
                <div className="w-full h-full bg-[#09090b] rounded-full flex items-center justify-center">
                  <Radio className="w-8 h-8 text-orange-400 animate-pulse" />
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-mono-code tracking-[0.25em] uppercase text-neutral-400 block font-sans">
                  SOUND CURATOR • NATHALIA DIAS
                </span>
                <h1 className="font-heading font-bold text-3xl sm:text-4xl text-neutral-100 tracking-tight leading-none mt-1.5">
                  Flória
                </h1>
                <p className="text-xs font-sans text-amber-300/90 mt-1 italic">
                  {mockupMode === 'b2b' ? 'Arquitetura Sonora & Sofisticação' : 'Deep House & Organic Grooves'}
                </p>
              </div>
            </div>

            {/* Bottom Details of Artwork */}
            <div className="relative z-10 pt-3 border-t border-white/10 space-y-2">
              {mockupMode === 'b2b' ? (
                <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-mono-code text-neutral-300">
                  <div className="p-1.5 rounded bg-neutral-900/60 border border-neutral-800">
                    <span className="text-orange-400 block font-bold">CURADORIA B2B</span>
                    <span>LOJAS & VERNISSAGES</span>
                  </div>
                  <div className="p-1.5 rounded bg-neutral-900/60 border border-neutral-800">
                    <span className="text-amber-400 block font-bold">SOM DE COLUNA</span>
                    <span>DESIGN ESCULTURAL</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-[11px] font-mono-code text-neutral-400">
                  <span>DISPONÍVEL NO SOUNDCLOUD</span>
                  <span className="text-orange-400 font-bold">120 BPM • WARM GROOVE</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Typography & Visual Codes */}
        <div className="space-y-6">
          
          {/* Typography System */}
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="font-heading text-lg font-bold text-neutral-100 flex items-center gap-2">
              <Type className="w-5 h-5 text-orange-400" />
              <span>Hierarquia Tipográfica Oficial</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1">
                <span className="font-mono-code text-[11px] text-orange-400 font-bold block">
                  FONTE SERIFADA PARA TÍTULOS E LOGO (LUXO B2B):
                </span>
                <p className="font-heading font-bold text-lg text-neutral-100">
                  {visual.typographySystem?.headerFont || 'Playfair Display'}
                </p>
                <p className="text-neutral-400 font-sans">
                  {visual.typographySystem?.headerFontVibe}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1">
                <span className="font-mono-code text-[11px] text-amber-400 font-bold block">
                  FONTE CORPO (SANS-SERIF MODERNA E LIMPA):
                </span>
                <p className="font-sans font-medium text-sm text-neutral-100">
                  {visual.typographySystem?.bodyFont || 'Plus Jakarta Sans'}
                </p>
                <p className="text-neutral-400 font-sans">
                  {visual.typographySystem?.bodyFontVibe}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-1">
                <span className="font-mono-code text-[11px] text-neutral-400 font-bold block">
                  FONTE TÉCNICA (ESPECIFICAÇÕES, CONTATOS E RIDERS):
                </span>
                <p className="font-mono-code font-bold text-xs text-neutral-200">
                  {visual.typographySystem?.technicalFont || 'Space Grotesk'}
                </p>
                <p className="text-neutral-400 font-sans">
                  Utilizada com sobriedade em riders de som de coluna, contatos e WhatsApp.
                </p>
              </div>
            </div>
          </div>

          {/* Visual Codes (Regras Estéticas) */}
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="font-heading text-lg font-bold text-neutral-100 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-orange-400" />
              <span>Diretrizes de Ambientação & Setup</span>
            </h3>

            <div className="space-y-3">
              {visual.visualCodes?.map((code, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs">
                  <span className="font-mono-code text-orange-400 font-bold block mb-1">
                    {code.element}:
                  </span>
                  <p className="text-neutral-300 leading-relaxed font-sans">
                    {code.rule}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-neutral-800 text-xs text-neutral-300 flex items-start gap-2.5">
              <Shirt className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-mono-code text-amber-400 font-semibold block mb-0.5">
                  Styling & Figurino para Eventos de Luxo:
                </span>
                <p className="text-neutral-400 font-sans">
                  {visual.outfitStyle}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
