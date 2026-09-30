import React, { useState } from 'react';
import { DJFloriaDossier, BrandPositioning, InstagramStrategy, PlatformAudit, VisualIdentity } from '../types/branding';
import { X, Download, Copy, Check, Printer, FileText } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  dossier: DJFloriaDossier;
  positioning: BrandPositioning;
  instagram: InstagramStrategy;
  audit: PlatformAudit;
  visual: VisualIdentity;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  dossier,
  positioning,
  instagram,
  audit,
  visual,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const markdownContent = `# BRAND BOOK & DOSSIÊ OFICIAL: ${dossier.name || 'DJ FLORIA'}
*Gerado pelo DJ Floria Brand & Content Studio*
*Data: ${new Date().toLocaleDateString('pt-BR')}*

---

## 1. DOSSIÊ DO PROJETO
- **Nome Artístico:** ${dossier.name}
- **Assinatura / Slogan:** ${dossier.tagline}
- **Gêneros Musicais:** ${dossier.genres}
- **BPM Range:** ${dossier.bpmRange}
- **Website:** ${dossier.website}
- **Instagram:** ${dossier.instagram}
- **YouTube:** ${dossier.youtube}
- **SoundCloud:** ${dossier.soundcloud}
- **Spotify:** ${dossier.spotify}

### Biografia Artística:
${dossier.bio}

### Press Kit & Tech Rider:
${dossier.pressKit}

### Novos Gêneros & Direcionamento Sonoro Atual:
${dossier.currentExploringGenres || 'Em consonância com as vertentes principais.'}

### Experiências Recentes & Novas Gigs:
${dossier.recentExperiences || 'Apresentações e long sets regulares.'}

### Filtro de Exclusão da Marca (Diretrizes Negativas):
${dossier.excludedTopicsAndOutdatedInfo || 'Nenhuma restrição adicional cadastrada.'}

---

## 2. POSICIONAMENTO E BRANDING
- **Tagline:** "${positioning.tagline}"
- **Arquétipo Artístico:** ${positioning.archetype?.name}
- **Descrição do Arquétipo:** ${positioning.archetype?.description}
- **Energia na Cabine:** ${positioning.archetype?.energy}
- **Declaração de Posicionamento:** ${positioning.positioningStatement}

### Manifesto da Marca:
${positioning.brandManifesto}

### Pilares Fundamentais da Marca:
${positioning.brandPillars?.map((p, idx) => `
#### 0${idx + 1}. ${p.pillar}
- **Conceito:** ${p.concept}
- **Na Prática:** ${p.inAction}
`).join('\n')}

### Tom de Voz:
- **Traços:** ${positioning.toneOfVoice?.traits?.join(', ')}
- **O que fazer:**
${positioning.toneOfVoice?.dos?.map(d => `  - ${d}`).join('\n')}
- **O que NUNCA fazer:**
${positioning.toneOfVoice?.donts?.map(d => `  - ${d}`).join('\n')}

- **Diferencial Competitivo:** ${positioning.competitiveEdge}
- **Pitch para Bookers:** "${positioning.bookerPitch}"

---

## 3. IDENTIDADE VISUAL & PALETA CROMÁTICA
- **Conceito Visual:** ${visual.conceptTitle}
- **Descrição:** ${visual.conceptDescription}

### Paleta Oficial:
${visual.palette?.map(c => `- **${c.name}** (${c.hex}) - Papel: ${c.role} | Uso: ${c.usage}`).join('\n')}

### Tipografia:
- **Display:** ${visual.typographySystem?.headerFont}
- **Corpo:** ${visual.typographySystem?.bodyFont}
- **Técnica:** ${visual.typographySystem?.technicalFont}

---

## 4. ESTRATÉGIA DE INSTAGRAM
### Bios Recomendadas:
${instagram.profileOptimization?.bioOptions?.map(b => `
#### [${b.type}]
\`\`\`
${b.bio}
\`\`\`
- CTA: ${b.cta}
`).join('\n')}

### Pilares de Conteúdo:
${instagram.contentPillars?.map(p => `- **${p.name}** (${p.percentage}%): ${p.description}`).join('\n')}

---

## 5. AUDITORIA DE PLATAFORMAS (GAPS IDENTIFICADOS)
${audit.platforms?.map(p => `
### ${p.platform} (Saúde: ${p.healthScore}/100)
- **Diagnóstico:** ${p.keyDiagnosis}
- **O que falta:**
${p.missingElements?.map(m => `  - ${m}`).join('\n')}
- **Ações Rápidas (Quick Wins):**
${p.quickWins?.map(q => `  - ${q}`).join('\n')}
`).join('\n')}
`;

  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DJ_Floria_Brand_Book_${new Date().toISOString().slice(0, 10)}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] glass-panel rounded-2xl border border-neutral-700 p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-neutral-100">
                Brand Book Oficial • Flória (Nathalia Dias)
              </h3>
              <p className="text-xs text-neutral-400">
                Exporte o dossiê consolidado e todas as diretrizes de Music Design em formato Markdown ou imprima em PDF.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="my-4 flex-1 overflow-y-auto max-h-[55vh] p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono-code text-neutral-300 whitespace-pre-wrap leading-relaxed">
          {markdownContent}
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-neutral-500">
            Compatível com Notion, Obsidian, Google Docs e exportadores de PDF.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={copyMarkdown}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copiado!' : 'Copiar Markdown'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Arquivo .MD</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
