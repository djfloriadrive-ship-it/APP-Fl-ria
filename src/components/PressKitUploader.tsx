import React, { useState, useRef } from 'react';
import { DJFloriaDossier } from '../types/branding';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck,
  RefreshCw,
  X
} from 'lucide-react';

interface PressKitUploaderProps {
  dossier: DJFloriaDossier;
  onUpdateDossier: (updated: DJFloriaDossier) => void;
}

export const PressKitUploader: React.FC<PressKitUploaderProps> = ({
  dossier,
  onUpdateDossier,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Check file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg('Arquivo muito grande. O tamanho máximo permitido é 20MB.');
      return;
    }
    setSelectedFile(file);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleUploadAndExtract = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target?.result as string;
        if (!base64Data) {
          throw new Error('Não foi possível ler o arquivo.');
        }

        const response = await fetch('/api/dossier/upload-presskit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base64: base64Data,
            mimeType: selectedFile.type || 'application/pdf',
            fileName: selectedFile.name,
          }),
        });

        const data = await response.json();
        if (data.success && data.data) {
          const res = data.data;

          // Merge into dossier
          const updatedDossier: DJFloriaDossier = {
            ...dossier,
            pressKit: res.extractedPressKitText || dossier.pressKit,
            bio: res.extractedBio ? `${res.extractedBio}` : dossier.bio,
            releasesAndGigs: res.pastGigsIdentified ? `${dossier.releasesAndGigs}\n\n[Do Press Kit]: ${res.pastGigsIdentified}` : dossier.releasesAndGigs,
            genres: res.genresIdentified || dossier.genres,
            lastUpdated: new Date().toISOString(),
          };

          onUpdateDossier(updatedDossier);
          setSuccessMsg(`Arquivo "${selectedFile.name}" analisado! Informações extraídas e inseridas no dossiê.`);
          setSelectedFile(null);
        } else {
          throw new Error(data.error || 'Erro ao processar o arquivo');
        }
        setIsProcessing(false);
      };

      reader.onerror = () => {
        throw new Error('Erro ao ler os bytes do arquivo');
      };

      reader.readAsDataURL(selectedFile);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro durante o upload e extração');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-orange-500 bg-orange-500/10'
            : 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/40 hover:bg-neutral-900/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <Upload className="w-5 h-5" />
          </div>

          <div>
            <span className="text-xs font-semibold text-neutral-200 block">
              Arraste seu arquivo de Press Kit aqui ou clique para selecionar
            </span>
            <span className="text-[11px] text-neutral-500 font-mono-code">
              Suporta PDF, Word (.docx), TXT, Markdown ou imagens de Rider
            </span>
          </div>
        </div>
      </div>

      {/* Selected File Details & Extraction Button */}
      {selectedFile && (
        <div className="p-3 rounded-xl bg-neutral-900 border border-orange-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 truncate">
            <FileCheck className="w-4 h-4 text-orange-400 shrink-0" />
            <div className="truncate">
              <div className="text-xs font-semibold text-neutral-200 truncate">
                {selectedFile.name}
              </div>
              <div className="text-[10px] text-neutral-500 font-mono-code">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
              }}
              className="p-1 rounded text-neutral-500 hover:text-neutral-300"
            >
              <X className="w-4 h-4" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUploadAndExtract();
              }}
              disabled={isProcessing}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Lendo com IA...' : 'Extrair com IA'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
