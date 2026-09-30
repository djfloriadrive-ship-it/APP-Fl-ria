import React, { useState } from 'react';
import { InstagramStrategy } from '../types/branding';
import { 
  Instagram, 
  Sparkles, 
  Copy, 
  Check, 
  Play, 
  Layers, 
  Clock, 
  Eye, 
  ChevronRight, 
  ChevronLeft,
  Share2,
  Bookmark,
  MessageCircle,
  Heart
} from 'lucide-react';

interface InstagramTabProps {
  strategy: InstagramStrategy;
  onRefresh: () => void;
  isLoading: boolean;
}

export const InstagramTab: React.FC<InstagramTabProps> = ({
  strategy,
  onRefresh,
  isLoading,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const slides = strategy.carouselConcept?.slides || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel rounded-2xl p-6 border border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-code bg-orange-500/10 border border-orange-500/30 text-orange-300 mb-2">
            <Instagram className="w-3.5 h-3.5" />
            <span>ESTRATÉGIA DE INSTAGRAM (@DJFLORIA)</span>
          </div>
          <h2 className="text-2xl font-heading font-bold text-neutral-100">
            Especialista em Instagram • Music Design & Autoridade
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl font-sans">
            Bios de alta conversão para marcas e eventos privados, roteiros de Reels com timecode e carrosséis pensados para salvamentos.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white text-xs font-semibold shadow-md shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Gerando Fórmulas...' : 'Novas Ideias de Reels'}</span>
        </button>
      </div>

      {/* Section 1: Bio Laboratory & Profile Optimization */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-neutral-100 flex items-center gap-2">
            <Instagram className="w-5 h-5 text-orange-400" />
            <span>Laboratório de Bios Oficiais & Otimização de Perfil</span>
          </h3>
          <span className="text-xs font-mono-code text-orange-400">Conversão B2B</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {strategy.profileOptimization?.bioOptions?.map((bioOpt, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-neutral-900/80 border border-neutral-800 flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono-code text-amber-400 font-semibold">
                    {bioOpt.type}
                  </span>
                  <button
                    onClick={() => copyText(bioOpt.bio, `bio-${idx}`)}
                    className="text-neutral-400 hover:text-neutral-200 text-xs flex items-center gap-1 cursor-pointer font-mono-code"
                  >
                    {copiedKey === `bio-${idx}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedKey === `bio-${idx}` ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <div className="p-3.5 rounded-lg bg-[#09090b] border border-neutral-800/80 font-mono-code text-xs text-neutral-200 whitespace-pre-line leading-relaxed">
                  {bioOpt.bio}
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400 font-sans">
                <span className="text-orange-400 font-semibold block mb-0.5">CTA Recomendada:</span>
                {bioOpt.cta}
              </div>
            </div>
          ))}
        </div>

        {/* Highlights & Profile Picture Direction */}
        <div className="pt-4 border-t border-neutral-800 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-mono-code uppercase text-neutral-400">
              Os 5 Destaques Estratégicos Recomendados:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {strategy.profileOptimization?.highlights?.map((hl, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 text-center space-y-1.5"
                >
                  <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 p-[1.5px] flex items-center justify-center">
                    <div className="w-full h-full bg-[#09090b] rounded-full flex items-center justify-center text-xs font-bold text-orange-300 font-mono-code">
                      0{idx + 1}
                    </div>
                  </div>
                  <div className="font-heading font-bold text-xs text-neutral-200 truncate">
                    {hl.name}
                  </div>
                  <p className="text-[10px] text-neutral-400 line-clamp-2 font-sans">
                    {hl.purpose}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
            <h4 className="text-xs font-mono-code uppercase text-amber-400">
              Direção de Arte da Foto de Perfil
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              {strategy.profileOptimization?.profilePictureTip}
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Content Distribution Pillars */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-neutral-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-400" />
            <span>Pilares de Conteúdo & Proporção Estratégica</span>
          </h3>
          <span className="text-xs font-mono-code text-neutral-400">Distribuição Semanal</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {strategy.contentPillars?.map((pillar, idx) => {
            return (
              <div
                key={idx}
                className="p-5 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-xs font-mono-code font-bold border border-orange-500/40 text-orange-400 bg-orange-500/10">
                      {pillar.percentage}%
                    </span>
                    <span className="text-[11px] font-mono-code text-neutral-500">Pilar {idx + 1}</span>
                  </div>
                  <h4 className="font-heading font-bold text-sm text-neutral-100 mb-1">
                    {pillar.name}
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    {pillar.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-300 font-sans">
                  <span className="text-neutral-500 font-semibold block mb-0.5">Exemplo Prático:</span>
                  "{pillar.exampleIdea}"
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Viral Reels Formulas with Timecodes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-lg font-bold text-neutral-100 flex items-center gap-2">
              <Play className="w-5 h-5 text-orange-400" />
              <span>Roteiros de Reels Prontos para Gravar (Fórmulas com Timecodes)</span>
            </h3>
            <p className="text-xs text-neutral-400 font-sans">
              Ganchos visuais nos primeiros 2 segundos para prender atenção e converter visualizações em orçamentos e autoridade.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {strategy.reelsBlueprints?.map((reel, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl p-6 border border-white/10 space-y-5 flex flex-col justify-between hover:border-neutral-700 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-code px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/30">
                    REEL 0{idx + 1} • {reel.targetGoal}
                  </span>
                  <button
                    onClick={() => copyText(reel.caption, `reel-${idx}`)}
                    className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer font-mono-code"
                  >
                    {copiedKey === `reel-${idx}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedKey === `reel-${idx}` ? 'Copiada!' : 'Copiar Legenda'}</span>
                  </button>
                </div>

                <h4 className="font-heading font-bold text-base text-neutral-100">
                  {reel.title}
                </h4>

                {/* Video Blueprint Steps */}
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-neutral-900/90 border border-neutral-800/80">
                    <span className="font-mono-code text-amber-400 font-bold block mb-1">
                      ⚡ GANCHO VISUAL & SONORO:
                    </span>
                    <p className="text-neutral-200 font-sans">{reel.hookTimecode}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-neutral-900/90 border border-neutral-800/80">
                    <span className="font-mono-code text-orange-400 font-bold block mb-1">
                      🎬 DINÂMICA DO VÍDEO:
                    </span>
                    <p className="text-neutral-200 font-sans">{reel.bodyAction}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#09090b] border border-orange-500/30">
                    <span className="font-mono-code text-amber-400 font-bold block mb-1">
                      💬 TEXTO NA TELA (ON-SCREEN TEXT):
                    </span>
                    <p className="text-neutral-100 font-medium font-sans">"{reel.onScreenText}"</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-neutral-900/50 text-[11px] text-neutral-400 font-sans">
                    <span className="font-mono-code text-neutral-500">Áudio Recomendado:</span> {reel.audioRecommendation}
                  </div>
                </div>
              </div>

              {/* Caption Preview Box */}
              <div className="pt-3 border-t border-neutral-800">
                <span className="text-[11px] font-mono-code text-neutral-400 uppercase block mb-1">
                  Legenda Formatada com Hashtags:
                </span>
                <div className="max-h-28 overflow-y-auto p-2.5 rounded bg-[#09090b] text-xs text-neutral-300 font-sans whitespace-pre-line border border-neutral-900 leading-relaxed">
                  {reel.caption}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Interactive Carousel Simulator (Slide by Slide) */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-code bg-orange-500/10 border border-orange-500/30 text-orange-300 mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>CARROSSEL DE ALTO SALVAMENTO B2B</span>
            </div>
            <h3 className="font-heading font-bold text-lg text-neutral-100">
              {strategy.carouselConcept?.title || 'Tema do Carrossel Educativo & Vibe'}
            </h3>
          </div>

          {strategy.carouselConcept?.caption && (
            <button
              onClick={() => copyText(strategy.carouselConcept.caption, 'carousel-caption')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 transition-colors self-start cursor-pointer font-mono-code"
            >
              {copiedKey === 'carousel-caption' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'carousel-caption' ? 'Copiada!' : 'Copiar Legenda do Carrossel'}</span>
            </button>
          )}
        </div>

        {/* Carousel Visualizer */}
        {slides.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            
            {/* Slide Mockup (Instagram Post Preview) */}
            <div className="lg:col-span-2 relative mx-auto w-full max-w-xl aspect-[4/4] sm:aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#09090b] via-neutral-900 to-orange-950/20 border border-neutral-800 p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

              {/* Top Bar of Slide */}
              <div className="relative z-10 flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center font-bold text-[10px] text-neutral-950 font-heading">
                    FL
                  </div>
                  <span className="font-semibold text-neutral-200 font-sans">@djfloria</span>
                </div>
                <span className="font-mono-code text-orange-400 font-bold">
                  {currentSlideIndex + 1} / {slides.length}
                </span>
              </div>

              {/* Slide Content */}
              <div className="relative z-10 my-auto text-center space-y-3 px-4">
                <span className="inline-block text-[11px] font-mono-code px-2.5 py-0.5 rounded-full bg-neutral-900/90 text-amber-300 border border-neutral-700">
                  {slides[currentSlideIndex]?.title}
                </span>
                <p className="text-base sm:text-xl font-heading font-bold text-neutral-100 leading-relaxed whitespace-pre-line">
                  {slides[currentSlideIndex]?.content}
                </p>
              </div>

              {/* Bottom Actions Mockup */}
              <div className="relative z-10 flex items-center justify-between text-neutral-400 pt-3 border-t border-neutral-800/80">
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-neutral-400" />
                  <MessageCircle className="w-4 h-4 text-neutral-400" />
                  <Share2 className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-orange-400" />
                  <span className="text-[10px] font-mono-code text-orange-300">Salvar</span>
                </div>
              </div>
            </div>

            {/* Slide Navigation Controls & List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code text-neutral-400">
                  Navegar pelos Slides:
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentSlideIndex === 0}
                    className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
                    disabled={currentSlideIndex === slides.length - 1}
                    className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {slides.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                      currentSlideIndex === idx
                        ? 'bg-orange-950/30 border-orange-500/50 text-neutral-100 shadow-sm'
                        : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <div className="font-mono-code font-bold text-orange-400 text-[10px]">
                      Slide {idx + 1}
                    </div>
                    <div className="truncate font-medium font-sans">{s.title}</div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Section 5: Stories Ecosystem & Gig Day 24h Playbook */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-neutral-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>Playbook de Stories: O Dia do Evento (Timeline de 24 Horas)</span>
          </h3>
          <span className="text-xs font-mono-code text-amber-400">Rotina & Bastidores</span>
        </div>
        <p className="text-xs text-neutral-400 font-sans">
          Como documentar o dia de uma ativação corporativa, vernissage ou long set no soundroom, gerando desejo imediato para novos orçamentos.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {strategy.storiesEcosystem?.gigDayTimeline?.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code font-bold text-orange-400 px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">
                  {item.time}
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              </div>
              <p className="text-xs text-neutral-200 leading-relaxed font-sans">
                {item.action}
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 text-xs text-neutral-300 space-y-1 font-sans">
          <span className="font-mono-code text-amber-400 font-bold block">
            Dica de Engajamento para Marcas & Curadores:
          </span>
          <p>{strategy.storiesEcosystem?.engagementStickersAdvice}</p>
        </div>
      </div>
    </div>
  );
};
