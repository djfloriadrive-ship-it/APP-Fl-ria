import React from 'react';
import { PlatformAudit } from '../types/branding';
import { 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  ArrowRight, 
  Instagram, 
  Youtube, 
  Headphones, 
  FileText, 
  Globe,
  TrendingUp,
  Activity
} from 'lucide-react';

interface PlatformAuditTabProps {
  audit: PlatformAudit;
  onRefresh: () => void;
  isLoading: boolean;
}

export const PlatformAuditTab: React.FC<PlatformAuditTabProps> = ({
  audit,
  onRefresh,
  isLoading,
}) => {
  const getPlatformIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('instagram')) return <Instagram className="w-5 h-5 text-orange-400" />;
    if (lower.includes('youtube')) return <Youtube className="w-5 h-5 text-amber-500" />;
    if (lower.includes('soundcloud')) return <Headphones className="w-5 h-5 text-orange-400" />;
    if (lower.includes('press') || lower.includes('epk')) return <FileText className="w-5 h-5 text-amber-400" />;
    return <Globe className="w-5 h-5 text-orange-400" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 55) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel rounded-2xl p-6 border border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-code bg-orange-500/10 border border-orange-500/30 text-orange-300 mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>AUDITORIA CRUZADA MULTIPLATAFORMA</span>
          </div>
          <h2 className="text-2xl font-heading font-bold text-neutral-100">
            Diagnóstico de Canais • Flória (Nathalia Dias)
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl font-sans">
            Mapeamento de gaps e oportunidades no Website Oficial (djfloria.com.br), Instagram (@djfloria), SoundCloud, YouTube e Press Kit.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-orange-300 border border-orange-500/30 text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Auditando...' : 'Reauditar com IA'}</span>
        </button>
      </div>

      {/* Health Overview & Cross-Platform Synergy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Overall Health Score Card */}
        <div className="glass-panel-active rounded-2xl p-6 border border-orange-500/40 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-code uppercase text-neutral-400">
              Índice de Maturidade Digital
            </span>
            <TrendingUp className="w-4 h-4 text-orange-400" />
          </div>

          <div className="flex items-baseline gap-3 my-2">
            <span className="text-5xl font-heading font-bold text-neutral-100">
              {audit.overallHealthScore || 82}
            </span>
            <span className="text-neutral-500 font-mono-code text-sm">/ 100</span>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed font-sans">
            Projeto com forte posicionamento de Music Design e residências consolidadas (Mercadoteca e Phunk Soundroom), com alto valor de fechamento B2B.
          </p>
        </div>

        {/* Cross-Platform Synergy */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-white/10 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono-code text-orange-400 uppercase">
              <Zap className="w-4 h-4" />
              <span>Sinergia Entre Canais (O Funil de Experiências de Marca)</span>
            </div>
            <h3 className="font-heading font-bold text-lg text-neutral-100">
              Como as 5 Plataformas se Conectam no Projeto Flória
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
              {audit.crossPlatformSynergy}
            </p>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs font-mono-code text-neutral-400">
            <span className="px-2 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">SoundCloud (Curadoria)</span>
            <ArrowRight className="w-3 h-3 text-neutral-600" />
            <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Instagram (@djfloria)</span>
            <ArrowRight className="w-3 h-3 text-neutral-600" />
            <span className="px-2 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">Site (djfloria.com.br)</span>
            <ArrowRight className="w-3 h-3 text-neutral-600" />
            <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">WhatsApp B2B (Booking)</span>
          </div>
        </div>

      </div>

      {/* Priority Action Roadmap */}
      {audit.priorityActionPlan && audit.priorityActionPlan.length > 0 && (
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <h3 className="font-heading font-bold text-lg text-neutral-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Plano de Ação Prioritário</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {audit.priorityActionPlan.map((action, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-mono-code font-bold text-orange-400">
                      0{action.order || idx + 1}
                    </span>
                    <span className="text-[10px] font-mono-code text-amber-400 px-2 py-0.5 rounded bg-amber-500/10">
                      {action.platform}
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-xs text-neutral-200">
                    {action.title}
                  </h4>
                </div>
                <div className="text-[11px] font-mono-code text-emerald-400 pt-2 border-t border-neutral-800/80">
                  Impacto: {action.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Platform Deep Dives (5 Platforms) */}
      <div className="space-y-6">
        <h3 className="font-heading text-xl font-bold text-neutral-100">
          Análise Individual por Plataforma
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {audit.platforms?.map((item, idx) => {
            const scoreClass = getScoreColor(item.healthScore);

            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl p-6 border border-white/10 space-y-5 flex flex-col justify-between hover:border-neutral-700 transition-colors"
              >
                <div className="space-y-4">
                  {/* Platform Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                        {getPlatformIcon(item.platform)}
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-base text-neutral-100">
                          {item.platform}
                        </h4>
                        <span className="text-xs text-neutral-400 font-mono-code">
                          Status: {item.status}
                        </span>
                      </div>
                    </div>

                    <div className={`px-2.5 py-1 rounded-lg border font-mono-code text-xs font-bold ${scoreClass}`}>
                      {item.healthScore}%
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-300 leading-relaxed font-sans">
                    <span className="text-neutral-400 font-semibold block mb-0.5">Diagnóstico Geral:</span>
                    {item.keyDiagnosis}
                  </div>

                  {/* What is Missing (O que Falta) */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-mono-code text-rose-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>O QUE PODE SER OTIMIZADO:</span>
                    </div>
                    <ul className="space-y-1.5">
                      {item.missingElements?.map((missing, mIdx) => (
                        <li key={mIdx} className="text-xs text-neutral-300 flex items-start gap-2 bg-neutral-950/60 p-2 rounded-lg border border-rose-500/10 font-sans">
                          <span className="text-rose-400 font-bold shrink-0 text-[10px] mt-0.5">•</span>
                          <span>{missing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quick Wins (10-min Actions) */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-mono-code text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>AÇÕES RÁPIDAS (QUICK WINS):</span>
                    </div>
                    <ul className="space-y-1.5">
                      {item.quickWins?.map((quick, qIdx) => (
                        <li key={qIdx} className="text-xs text-neutral-300 flex items-start gap-2 bg-neutral-950/60 p-2 rounded-lg border border-emerald-500/10 font-sans">
                          <span className="text-emerald-400 font-bold shrink-0 text-[10px] mt-0.5 font-mono-code">✓</span>
                          <span>{quick}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Strategic Next Steps */}
                <div className="pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 font-sans">
                  <span className="text-orange-400 font-mono-code block mb-1 font-semibold">
                    Visão Estratégica:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5">
                    {item.strategicNextSteps?.map((step, sIdx) => (
                      <li key={sIdx}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
