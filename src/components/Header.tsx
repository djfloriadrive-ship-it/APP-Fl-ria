import React from 'react';
import { Sparkles, Disc3, Download, RefreshCw, Layers, UploadCloud } from 'lucide-react';
import { DJFloriaDossier } from '../types/branding';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  dossier: DJFloriaDossier;
  onRefreshAllAI: () => void;
  isAiLoading: boolean;
  onExportBrandBook: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  dossier,
  onRefreshAllAI,
  isAiLoading,
  onExportBrandBook,
}) => {
  const tabs = [
    { id: 'dossier', label: 'Dossiê do Projeto', icon: Layers, badge: 'Hub Central' },
    { id: 'positioning', label: 'Posicionamento & Branding', icon: Sparkles },
    { id: 'instagram', label: 'Especialista Instagram', icon: Disc3, badge: 'B2B & Club' },
    { id: 'audit', label: 'Auditoria de Plataformas', icon: RefreshCw },
    { id: 'visual', label: 'Paleta & Identidade', icon: Sparkles },
    { id: 'content', label: 'Fábrica de Conteúdos', icon: Disc3 },
    { id: 'chat', label: 'Diretor Criativo IA', icon: Sparkles, badge: '24/7' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#09090b]/90 backdrop-blur-2xl border-b border-white/10">
      {/* Top Banner with Brand Identity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600 p-[1px] shadow-lg shadow-orange-500/20">
            <div className="w-full h-full bg-[#09090b] rounded-[11px] flex items-center justify-center">
              <span className="font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 text-xl tracking-tight">
                FL
              </span>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-bold text-xl text-neutral-100 tracking-tight flex items-center gap-2">
                {dossier.name || 'Flória'}
                <span className="text-[11px] font-sans font-medium px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400">
                  Music Design & Sound Curation
                </span>
              </h1>
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block truncate max-w-lg font-sans">
              {dossier.tagline || 'Curadoria Sonora e Atmosferas para Marcas de Luxo e Hospitalidade'}
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setActiveTab('dossier')}
            title="Conectar e importar arquivos da pasta do Google Drive"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-900/90 hover:bg-neutral-800 text-orange-300 border border-orange-500/30 transition-all cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Drive Sync</span>
          </button>

          <button
            onClick={onExportBrandBook}
            title="Exportar manual de marca e dossiê em formato imprimível"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-700/60 transition-all hover:border-neutral-500"
          >
            <Download className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">Exportar</span> Brand Book
          </button>

          <button
            onClick={onRefreshAllAI}
            disabled={isAiLoading}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white shadow-md shadow-orange-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
            <span>{isAiLoading ? 'Analisando...' : 'Sincronizar com IA'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white border border-orange-500/40 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60 border border-transparent'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-mono-code px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-orange-500 text-neutral-950 font-bold'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-orange-500 to-amber-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
