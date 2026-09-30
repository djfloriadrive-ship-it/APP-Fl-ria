import React, { useState } from 'react';
import { DJFloriaDossier } from '../types/branding';
import { 
  Globe, 
  Instagram, 
  Youtube, 
  Headphones, 
  Music, 
  FileText, 
  Users, 
  Calendar, 
  Sparkles, 
  Check, 
  Copy, 
  Upload, 
  RotateCcw,
  Sliders,
  ExternalLink,
  Phone,
  Mail,
  Award,
  ShieldAlert
} from 'lucide-react';
import { DriveFolderSync } from './DriveFolderSync';
import { PressKitUploader } from './PressKitUploader';

interface DossierTabProps {
  dossier: DJFloriaDossier;
  onChangeDossier: (updated: DJFloriaDossier) => void;
  onAnalyzeAll: () => void;
  isLoading: boolean;
  onResetDefault: () => void;
}

export const DossierTab: React.FC<DossierTabProps> = ({
  dossier,
  onChangeDossier,
  onAnalyzeAll,
  isLoading,
  onResetDefault,
}) => {
  const [saveToast, setSaveToast] = useState(false);

  const handleFieldChange = (field: keyof DJFloriaDossier, value: string) => {
    const updated = {
      ...dossier,
      [field]: value,
      lastUpdated: new Date().toISOString(),
    };
    onChangeDossier(updated);
    showSavedToast();
  };

  const showSavedToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Hero Welcome & Value Proposition */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 border border-white/10">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono-code bg-orange-500/10 border border-orange-500/30 text-orange-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>REPOSITÓRIO CENTRAL • FLÓRIA (NATHALIA DIAS)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-neutral-100 tracking-tight">
              Music Design, Curadoria Sonora & Experiências de Marca
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed font-sans">
              Gerencie e centralize as informações oficiais do seu <strong>site (djfloria.com.br)</strong>, <strong>press kit</strong>, <strong>Instagram (@djfloria)</strong>, <strong>SoundCloud</strong>, <strong>YouTube</strong> e <strong>Google Drive</strong>. A IA utiliza este dossiê perpétuo para criar seu posicionamento B2B, propostas para marcas de luxo e roteiros de conteúdo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onAnalyzeAll}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-600 hover:from-orange-400 hover:to-yellow-500 text-white font-semibold text-xs shadow-lg shadow-orange-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Processando Inteligência...' : 'Sincronizar Inteligência com IA'}</span>
            </button>
            <button
              onClick={onResetDefault}
              title="Restaurar dados oficiais de Flória"
              className="flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="sm:hidden md:inline">Restaurar Dados Oficiais</span>
            </button>
          </div>
        </div>

        {/* Live Auto-save feedback badge */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Dados salvos em tempo real no seu navegador (iOS Dark Glassmorphism)</span>
          </div>
          {saveToast && (
            <span className="text-orange-400 font-medium flex items-center gap-1 font-mono-code">
              <Check className="w-3.5 h-3.5" /> Atualizado com sucesso!
            </span>
          )}
        </div>
      </div>

      {/* Google Drive Official Folder Sync */}
      <DriveFolderSync
        dossier={dossier}
        onUpdateDossier={onChangeDossier}
        onTriggerAllAI={onAnalyzeAll}
      />

      {/* Grid of Information Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: 5 Core Platform Links */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-neutral-100 flex items-center gap-2">
              <Globe className="w-5 h-5 text-orange-400" />
              <span>Canais Oficiais & Contatos de Booking</span>
            </h3>
            <span className="text-xs font-mono-code text-neutral-500">Canais Oficiais</span>
          </div>
          <p className="text-xs text-neutral-400 font-sans">
            Canais oficiais utilizados para orçamentos com marcas corporativas e presença na cena eletrônica.
          </p>

          <div className="space-y-4">
            {/* Website */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-orange-400" /> Site Oficial
                </span>
                {dossier.website && (
                  <a
                    href={dossier.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-orange-400 hover:underline flex items-center gap-1"
                  >
                    Abrir <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </label>
              <input
                type="text"
                value={dossier.website}
                onChange={(e) => handleFieldChange('website', e.target.value)}
                placeholder="https://djfloria.com.br"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-orange-500 font-mono-code transition-colors"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-amber-400" /> Instagram (@djfloria)
                </span>
                {dossier.instagram && (
                  <a
                    href={dossier.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
                  >
                    Abrir <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </label>
              <input
                type="text"
                value={dossier.instagram}
                onChange={(e) => handleFieldChange('instagram', e.target.value)}
                placeholder="https://instagram.com/djfloria"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-orange-500 font-mono-code transition-colors"
              />
            </div>

            {/* SoundCloud */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5 text-orange-400" /> SoundCloud (Mixes & Sets)
                </span>
                {dossier.soundcloud && (
                  <a
                    href={dossier.soundcloud}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-orange-400 hover:underline flex items-center gap-1"
                  >
                    Abrir <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </label>
              <input
                type="text"
                value={dossier.soundcloud}
                onChange={(e) => handleFieldChange('soundcloud', e.target.value)}
                placeholder="https://soundcloud.com/djfloria"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-orange-500 font-mono-code transition-colors"
              />
            </div>

            {/* YouTube */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Youtube className="w-3.5 h-3.5 text-amber-500" /> YouTube (@DJFloria)
                </span>
                {dossier.youtube && (
                  <a
                    href={dossier.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
                  >
                    Abrir <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </label>
              <input
                type="text"
                value={dossier.youtube}
                onChange={(e) => handleFieldChange('youtube', e.target.value)}
                placeholder="https://youtube.com/@djfloria"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-orange-500 font-mono-code transition-colors"
              />
            </div>

            {/* WhatsApp & Email Quick Reference */}
            <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-neutral-300">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono-code">(41) 92003-4522</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <Mail className="w-3.5 h-3.5 text-orange-400" />
                <span className="font-mono-code truncate">booking@djfloria.com.br</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Artist Identity & Sound DNA */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-neutral-100 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-orange-400" />
              <span>Assinatura & Posicionamento B2B</span>
            </h3>
            <span className="text-xs font-mono-code text-orange-400">Music Design</span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Nome do Projeto / Artista
                </label>
                <input
                  type="text"
                  value={dossier.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs font-semibold text-neutral-100 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  BPM Range Típico
                </label>
                <input
                  type="text"
                  value={dossier.bpmRange}
                  onChange={(e) => handleFieldChange('bpmRange', e.target.value)}
                  placeholder="118 - 126 BPM"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-200 font-mono-code focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Gêneros & Vertentes Musicais
              </label>
              <input
                type="text"
                value={dossier.genres}
                onChange={(e) => handleFieldChange('genres', e.target.value)}
                placeholder="House (Deep, Minimal & Groove), Indie Dance, Melodic Techno..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Proposta de Valor / Tagline
              </label>
              <input
                type="text"
                value={dossier.tagline}
                onChange={(e) => handleFieldChange('tagline', e.target.value)}
                placeholder="Music Design, Curadoria Sonora e Atmosferas para Marcas..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Público-Alvo, Nicho & Marcas
              </label>
              <textarea
                rows={3}
                value={dossier.targetAudience}
                onChange={(e) => handleFieldChange('targetAudience', e.target.value)}
                placeholder="Lojas de decoração, alta moda, studios wellness, vernissages, arquitetos e público exigente de música eletrônica..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-orange-500 leading-relaxed font-sans"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Press Kit & Tech Rider */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-neutral-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-400" />
              <span>Press Kit & Tech Rider Oficial</span>
            </h3>
            <span className="text-xs font-mono-code text-orange-400">Contratos & Bookings</span>
          </div>
          <p className="text-xs text-neutral-400 font-sans">
            Faça upload do seu arquivo de Press Kit (PDF, Word, TXT) ou edite o texto oficial consolidado abaixo.
          </p>

          {/* Drag & Drop File Uploader with Gemini Multimodal Extraction */}
          <PressKitUploader dossier={dossier} onUpdateDossier={onChangeDossier} />

          <div className="pt-2">
            <label className="block text-xs font-mono-code text-neutral-400 mb-1">
              Texto Consolidado do Press Kit & Formatos de Atuação:
            </label>
            <textarea
              rows={8}
              value={dossier.pressKit}
              onChange={(e) => handleFieldChange('pressKit', e.target.value)}
              placeholder="Informações do press kit, setups de coluna, formação na Yellow DJ Academy, mentoria Kaká Franco..."
              className="w-full px-3.5 py-3 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-200 font-mono-code focus:outline-none focus:border-orange-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Card 4: Biografia Artística & Storytelling */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-neutral-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span>Biografia Artística & Diferencial Autoral</span>
            </h3>
            <span className="text-xs font-mono-code text-amber-400">Nathalia Dias</span>
          </div>
          <p className="text-xs text-neutral-400 font-sans">
            Sua trajetória: experiência como dançarina do ventre, formação pela Yellow DJ Academy, mentoria com Kaká Franco e sensibilidade acústica.
          </p>

          <textarea
            rows={12}
            value={dossier.bio}
            onChange={(e) => handleFieldChange('bio', e.target.value)}
            placeholder="Conte a história do projeto Flória e seu diferencial..."
            className="w-full px-3.5 py-3 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
          />
        </div>

        {/* Card 5: Gigs, Residências & Prova Social */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-neutral-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-400" />
              <span>Histórico de Residência & Gigs de Destaque</span>
            </h3>
            <span className="text-xs font-mono-code text-orange-400">Prova Social</span>
          </div>
          <p className="text-xs text-neutral-400 font-sans">
            Ex-DJ residente da Mercadoteca (Shopping Crystal - única DJ constante no espaço); apresentações mensais regulares no Phunk Soundroom; apresentações no Club Vibe, Hera Bar, Festa do Tite, Supafine, Soma Galeria, Porks e Coletivo Vênus.
          </p>

          <textarea
            rows={5}
            value={dossier.releasesAndGigs}
            onChange={(e) => handleFieldChange('releasesAndGigs', e.target.value)}
            placeholder="Residências e palcos de destaque..."
            className="w-full px-3.5 py-3 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-orange-500 leading-relaxed font-sans"
          />
        </div>

        {/* Card 6: Metas de Branding & Music Design */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-neutral-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Metas & Foco Estratégico da Artista</span>
            </h3>
            <span className="text-xs font-mono-code text-amber-400">Diretrizes</span>
          </div>
          <p className="text-xs text-neutral-400 font-sans">
            Objetivos comerciais e artísticos (fechar novas marcas B2B, valorizar setups acústicos limpos e consolidar turnê de soundrooms).
          </p>

          <textarea
            rows={5}
            value={dossier.notes}
            onChange={(e) => handleFieldChange('notes', e.target.value)}
            placeholder="Metas e anotações para direcionar a IA..."
            className="w-full px-3.5 py-3 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
          />
        </div>

      </div>

      {/* SEÇÃO ESPECIAL: EVOLUÇÃO MUSICAL, NOVAS EXPERIÊNCIAS & FILTRO DE EXCLUSÕES DA IA */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-orange-500/30 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-code bg-orange-500/10 border border-orange-500/30 text-orange-300 mb-2">
              <Sliders className="w-3.5 h-3.5" />
              <span>EVOLUÇÃO CONTÍNUA & FILTRO DA IA</span>
            </div>
            <h3 className="font-heading font-bold text-xl text-neutral-100 flex items-center gap-2">
              Novos Gêneros, Experiências Recentes & O Que NÃO Citar Mais
            </h3>
            <p className="text-xs text-neutral-300 max-w-3xl font-sans mt-1">
              Controle absoluto sobre o que entra e o que sai da sua marca. Atualize novas sonoridades que está explorando, adicione novas gigs e defina com rigor tudo aquilo que <strong>não deve mais ser citado</strong> pela IA em posts, bios e propostas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Card A: Novos Gêneros & Pesquisa Sonora */}
          <div className="p-5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code text-orange-400 font-bold flex items-center gap-1.5">
                  <Headphones className="w-4 h-4" /> NOVOS GÊNEROS & SONORIDADES
                </span>
                <span className="text-[10px] font-mono-code text-neutral-500">Pesquisa Atual</span>
              </div>
              <p className="text-xs text-neutral-400 font-sans">
                Novas vertentes que você começou a tocar (ex: Organic House, Afro Melodic, Minimal Tech) para a IA incorporar nos roteiros e áudios:
              </p>
              <textarea
                rows={5}
                value={dossier.currentExploringGenres || ''}
                onChange={(e) => handleFieldChange('currentExploringGenres', e.target.value)}
                placeholder="Ex: Explorando linhas de Organic House e Melodic Deep entre 120-123 BPM com percussões acústicas ricas e baixos quentes..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090b] border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-orange-500 leading-relaxed font-sans"
              />
            </div>
            <div className="text-[10px] text-amber-400 font-mono-code pt-1">
              💡 Incorporado automaticamente na Fábrica de Conteúdos e no tom dos Reels.
            </div>
          </div>

          {/* Card B: Novas Experiências & Gigs Recentes */}
          <div className="p-5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code text-amber-400 font-bold flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> EXPERIÊNCIAS & GIGS RECENTES
                </span>
                <span className="text-[10px] font-mono-code text-neutral-500">Novas Conquistas</span>
              </div>
              <p className="text-xs text-neutral-400 font-sans">
                Novos palcos, marcas atendidas, vernissages ou parcerias recentes para a IA criar cases reais de autoridade e posts de bastidores:
              </p>
              <textarea
                rows={5}
                value={dossier.recentExperiences || ''}
                onChange={(e) => handleFieldChange('recentExperiences', e.target.value)}
                placeholder="Ex: Long set memorável de 3h no Phunk Soundroom com público conectado; curadoria acústica na inauguração da nova galeria de design..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090b] border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-orange-500 leading-relaxed font-sans"
              />
            </div>
            <div className="text-[10px] text-amber-400 font-mono-code pt-1">
              💡 Transforma suas apresentações recentes em prova social e pitches comerciais.
            </div>
          </div>

          {/* Card C: O que NÃO quero mais (Filtro de Exclusão da IA) */}
          <div className="p-5 rounded-xl bg-neutral-900/80 border border-rose-500/30 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code text-rose-400 font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> FILTRO DE EXCLUSÃO (O QUE NÃO CITAR)
                </span>
                <span className="text-[10px] font-mono-code text-rose-400/80 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">Anti-Erros</span>
              </div>
              <p className="text-xs text-neutral-400 font-sans">
                Coisas que <strong>NÃO fazem mais parte</strong> das suas informações (gêneros que parou de tocar, residências antigas que prefere omitir, termos proibidos):
              </p>
              <textarea
                rows={5}
                value={dossier.excludedTopicsAndOutdatedInfo || ''}
                onChange={(e) => handleFieldChange('excludedTopicsAndOutdatedInfo', e.target.value)}
                placeholder="Ex: Não citar como residente fixa do Phunk (apenas gigs mensais); não citar mais Electro House; não usar 'fazer playlist' ou termos amadores..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090b] border border-rose-500/30 text-xs text-neutral-200 focus:outline-none focus:border-rose-500 leading-relaxed font-sans"
              />
            </div>
            <div className="text-[10px] text-rose-300 font-mono-code pt-1 flex items-center gap-1">
              🛡️ A IA obedecerá estritamente este filtro e nunca citará esses itens.
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="rounded-2xl p-5 bg-gradient-to-r from-neutral-900 via-neutral-900 to-orange-950/40 border border-orange-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-heading font-bold text-base text-neutral-100">
            Dossiê Flória 100% atualizado com os dados oficiais?
          </h4>
          <p className="text-xs text-neutral-400 font-sans">
            Ao clicar em atualizar, todas as abas (Posicionamento, Instagram B2B, Paleta Âmbar e Auditoria) são recalculadas em conformidade com sua identidade real.
          </p>
        </div>

        <button
          onClick={onAnalyzeAll}
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Analisando Dossiê com IA...' : 'Atualizar Todas as Estratégias'}</span>
        </button>
      </div>
    </div>
  );
};
