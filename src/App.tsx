/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  DJFloriaDossier, 
  BrandPositioning, 
  InstagramStrategy, 
  PlatformAudit, 
  VisualIdentity 
} from './types/branding';
import { 
  initialFloriaDossier, 
  defaultPositioning, 
  defaultInstagramStrategy, 
  defaultPlatformAudit, 
  defaultVisualIdentity 
} from './data/initialDossier';
import { Header } from './components/Header';
import { DossierTab } from './components/DossierTab';
import { PositioningTab } from './components/PositioningTab';
import { InstagramTab } from './components/InstagramTab';
import { PlatformAuditTab } from './components/PlatformAuditTab';
import { VisualIdentityTab } from './components/VisualIdentityTab';
import { ContentFactoryTab } from './components/ContentFactoryTab';
import { AIChatTab } from './components/AIChatTab';
import { ExportModal } from './components/ExportModal';

export default function App() {
  // Local storage keys
  const STORAGE_KEYS = {
    DOSSIER: 'dj_floria_dossier_v6',
    POSITIONING: 'dj_floria_pos_v6',
    INSTAGRAM: 'dj_floria_ig_v6',
    AUDIT: 'dj_floria_audit_v6',
    VISUAL: 'dj_floria_visual_v6',
  };

  // State initialization with localStorage fallback
  const [dossier, setDossier] = useState<DJFloriaDossier>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOSSIER);
      return saved ? JSON.parse(saved) : initialFloriaDossier;
    } catch {
      return initialFloriaDossier;
    }
  });

  const [positioning, setPositioning] = useState<BrandPositioning>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POSITIONING);
      return saved ? JSON.parse(saved) : defaultPositioning;
    } catch {
      return defaultPositioning;
    }
  });

  const [instagram, setInstagram] = useState<InstagramStrategy>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INSTAGRAM);
      return saved ? JSON.parse(saved) : defaultInstagramStrategy;
    } catch {
      return defaultInstagramStrategy;
    }
  });

  const [audit, setAudit] = useState<PlatformAudit>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
      return saved ? JSON.parse(saved) : defaultPlatformAudit;
    } catch {
      return defaultPlatformAudit;
    }
  });

  const [visual, setVisual] = useState<VisualIdentity>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VISUAL);
      return saved ? JSON.parse(saved) : defaultVisualIdentity;
    } catch {
      return defaultVisualIdentity;
    }
  });

  const [activeTab, setActiveTab] = useState<string>('dossier');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DOSSIER, JSON.stringify(dossier));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [dossier]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.POSITIONING, JSON.stringify(positioning));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [positioning]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INSTAGRAM, JSON.stringify(instagram));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [instagram]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(audit));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [audit]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VISUAL, JSON.stringify(visual));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [visual]);

  // Show status notification
  const triggerToast = (msg: string) => {
    setSyncToast(msg);
    setTimeout(() => setSyncToast(null), 3500);
  };

  // AI Refresh Handlers
  const handleRefreshPositioning = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/branding/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dossier }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setPositioning(data.data);
        triggerToast('Posicionamento recalculado com sucesso!');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Erro ao atualizar posicionamento');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleRefreshInstagram = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/branding/instagram-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dossier }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setInstagram(data.data);
        triggerToast('Estratégia de Instagram atualizada com novas fórmulas!');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Erro ao atualizar Instagram');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleRefreshAudit = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/branding/platform-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dossier }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAudit(data.data);
        triggerToast('Auditoria das 5 plataformas concluída!');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Erro ao auditar plataformas');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleRefreshVisual = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/branding/visual-identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dossier }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setVisual(data.data);
        triggerToast('Paleta cromática e identidade visual refinadas!');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Erro ao atualizar identidade visual');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Full Refresh of All AI analysis
  const handleRefreshAllAI = async () => {
    setIsAiLoading(true);
    triggerToast('Iniciando análise completa do dossiê com Gemini 3.8 Flash...');
    try {
      const [posRes, igRes, auditRes, visualRes] = await Promise.all([
        fetch('/api/branding/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dossier }),
        }),
        fetch('/api/branding/instagram-strategy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dossier }),
        }),
        fetch('/api/branding/platform-audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dossier }),
        }),
        fetch('/api/branding/visual-identity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dossier }),
        }),
      ]);

      const [posData, igData, auditData, visualData] = await Promise.all([
        posRes.json(),
        igRes.json(),
        auditRes.json(),
        visualRes.json(),
      ]);

      if (posData.success && posData.data) setPositioning(posData.data);
      if (igData.success && igData.data) setInstagram(igData.data);
      if (auditData.success && auditData.data) setAudit(auditData.data);
      if (visualData.success && visualData.data) setVisual(visualData.data);

      triggerToast('Todas as estratégias da DJ Floria foram sincronizadas e atualizadas!');
    } catch (err) {
      console.error(err);
      triggerToast('Erro durante a sincronização completa');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleResetDefault = () => {
    if (window.confirm('Deseja restaurar as informações padrão do projeto DJ Floria?')) {
      setDossier(initialFloriaDossier);
      setPositioning(defaultPositioning);
      setInstagram(defaultInstagramStrategy);
      setAudit(defaultPlatformAudit);
      setVisual(defaultVisualIdentity);
      triggerToast('Dossiê padrão restaurado');
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dossier={dossier}
        onRefreshAllAI={handleRefreshAllAI}
        isAiLoading={isAiLoading}
        onExportBrandBook={() => setIsExportOpen(true)}
      />

      {/* Main Tab Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'dossier' && (
          <DossierTab
            dossier={dossier}
            onChangeDossier={setDossier}
            onAnalyzeAll={handleRefreshAllAI}
            isLoading={isAiLoading}
            onResetDefault={handleResetDefault}
          />
        )}

        {activeTab === 'positioning' && (
          <PositioningTab
            positioning={positioning}
            onRefresh={handleRefreshPositioning}
            isLoading={isAiLoading}
          />
        )}

        {activeTab === 'instagram' && (
          <InstagramTab
            strategy={instagram}
            onRefresh={handleRefreshInstagram}
            isLoading={isAiLoading}
          />
        )}

        {activeTab === 'audit' && (
          <PlatformAuditTab
            audit={audit}
            onRefresh={handleRefreshAudit}
            isLoading={isAiLoading}
          />
        )}

        {activeTab === 'visual' && (
          <VisualIdentityTab
            visual={visual}
            onRefresh={handleRefreshVisual}
            isLoading={isAiLoading}
          />
        )}

        {activeTab === 'content' && (
          <ContentFactoryTab dossier={dossier} />
        )}

        {activeTab === 'chat' && (
          <AIChatTab dossier={dossier} />
        )}
      </main>

      {/* Global Notification Toast */}
      {syncToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-neutral-900/95 border border-orange-500/40 text-neutral-100 text-xs font-medium shadow-2xl shadow-orange-500/20 backdrop-blur-md flex items-center gap-2.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Export Brand Book Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        dossier={dossier}
        positioning={positioning}
        instagram={instagram}
        audit={audit}
        visual={visual}
      />
    </div>
  );
}
