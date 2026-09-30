import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logoutGoogle } from '../services/auth';
import { listDriveFolder, readDriveFileDetails, extractFolderId, DriveFileItem } from '../services/drive';
import { DJFloriaDossier } from '../types/branding';
import { 
  FolderCheck, 
  Sparkles, 
  ExternalLink, 
  FileText, 
  Image as ImageIcon, 
  Music, 
  Film, 
  Folder, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  LogOut,
  UploadCloud,
  File,
  Zap
} from 'lucide-react';

interface DriveFolderSyncProps {
  dossier: DJFloriaDossier;
  onUpdateDossier: (updated: DJFloriaDossier) => void;
  onTriggerAllAI: () => void;
}

export const DriveFolderSync: React.FC<DriveFolderSyncProps> = ({
  dossier,
  onUpdateDossier,
  onTriggerAllAI,
}) => {
  const DEFAULT_FOLDER_URL = 'https://drive.google.com/drive/folders/1xvMmiDn9H-ORszmTN1HhsNpU2ebm8Dn4?usp=sharing';
  
  const [folderUrl, setFolderUrl] = useState(DEFAULT_FOLDER_URL);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isDigesting, setIsDigesting] = useState(false);
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [digestResult, setDigestResult] = useState<any | null>(null);
  const [stepStatus, setStepStatus] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleLogin = async (): Promise<string | null> => {
    setIsSigningIn(true);
    setErrorMsg(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
        return result.accessToken;
      }
      return null;
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Falha ao autenticar com o Google Drive');
      return null;
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutGoogle();
    setUser(null);
    setAccessToken(null);
    setFiles([]);
    setDigestResult(null);
    setStepStatus(null);
  };

  // Complete automated flow: Connect -> Scan Folder -> Download Details (PDFs/Docs) -> Digest with Gemini -> Update Dossier
  const handleAutoExtractAll = async () => {
    setErrorMsg(null);
    setDigestResult(null);

    let token = accessToken;
    if (!token) {
      setStepStatus('Conectando com o Google Drive...');
      token = await handleLogin();
      if (!token) {
        setStepStatus(null);
        return;
      }
    }

    const cleanId = extractFolderId(folderUrl);
    if (!cleanId) {
      setErrorMsg('ID de pasta ou link inválido.');
      setStepStatus(null);
      return;
    }

    try {
      setStepStatus('Varrendo arquivos da pasta do Press Kit...');
      setIsScanning(true);
      const driveFiles = await listDriveFolder(cleanId, token);
      setFiles(driveFiles);

      if (driveFiles.length === 0) {
        setErrorMsg('Nenhum arquivo encontrado nesta pasta do Google Drive ou acesso restrito.');
        setStepStatus(null);
        setIsScanning(false);
        return;
      }

      setStepStatus(`Lendo ${driveFiles.length} arquivo(s) incluindo PDFs e Documentos...`);
      setIsDigesting(true);

      const enrichedFiles = await Promise.all(
        driveFiles.map(async (file) => {
          const details = await readDriveFileDetails(file, token!);
          return {
            name: file.name,
            mimeType: details.mimeType || file.mimeType,
            textContent: details.textContent,
            base64Data: details.base64Data,
          };
        })
      );

      setStepStatus('Gemini 3.8 Flash está extraindo biografia, rider e dados do Press Kit...');
      const response = await fetch('/api/drive/digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: enrichedFiles,
          currentDossier: dossier,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setDigestResult(data.data);

        // Merge updates into dossier
        const updates = data.data.suggestedUpdates || {};
        const updatedDossier: DJFloriaDossier = {
          ...dossier,
          bio: updates.bio || dossier.bio,
          pressKit: updates.pressKit || dossier.pressKit,
          genres: updates.genres || dossier.genres,
          releasesAndGigs: updates.releasesAndGigs ? `${dossier.releasesAndGigs}\n\n[Google Drive]: ${updates.releasesAndGigs}` : dossier.releasesAndGigs,
          visualAestheticCurrent: updates.visualAestheticCurrent || dossier.visualAestheticCurrent,
          notes: updates.notes ? `${dossier.notes}\n\n[Google Drive]: ${updates.notes}` : dossier.notes,
          lastUpdated: new Date().toISOString(),
        };

        onUpdateDossier(updatedDossier);
        setStepStatus('Extração concluída com sucesso!');
      } else {
        throw new Error(data.error || 'Erro ao processar conteúdos');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Erro durante a extração automática');
      setStepStatus(null);
    } finally {
      setIsScanning(false);
      setIsDigesting(false);
    }
  };

  const getFileIcon = (mime: string, name: string) => {
    if (mime.includes('folder')) return <Folder className="w-4 h-4 text-amber-400" />;
    if (mime.includes('image') || name.match(/\.(jpg|jpeg|png|webp|svg)$/i)) return <ImageIcon className="w-4 h-4 text-emerald-400" />;
    if (mime.includes('audio') || name.match(/\.(mp3|wav|aiff|flac|m4a)$/i)) return <Music className="w-4 h-4 text-orange-400" />;
    if (mime.includes('video') || name.match(/\.(mp4|mov|avi)$/i)) return <Film className="w-4 h-4 text-amber-400" />;
    if (mime.includes('pdf') || mime.includes('document') || name.match(/\.(pdf|doc|docx|txt|md)$/i)) return <FileText className="w-4 h-4 text-orange-400" />;
    return <File className="w-4 h-4 text-neutral-400" />;
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-7 border border-orange-500/30 space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono-code bg-orange-500/15 border border-orange-500/30 text-orange-300 mb-2">
            <UploadCloud className="w-3.5 h-3.5" />
            <span>INTEGRAÇÃO OFICIAL GOOGLE DRIVE</span>
          </div>
          <h3 className="font-heading font-bold text-xl text-neutral-100 flex items-center gap-2">
            Extração Automática da Pasta do Press Kit
          </h3>
          <p className="text-xs text-neutral-300 max-w-2xl mt-1 font-sans">
            Seus arquivos de divulgação, PDFs, fotos e releases salvos no Google Drive são analisados pela IA para preencher automaticamente seu dossiê e direcionar sua marca.
          </p>
        </div>

        {/* Auth status / Login Button */}
        <div>
          {user ? (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-neutral-900 border border-neutral-800">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Google User'}
                  className="w-8 h-8 rounded-full border border-orange-500/40"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center font-bold text-xs text-white">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-left text-xs pr-2">
                <div className="font-medium text-neutral-200 truncate max-w-[130px] font-sans">
                  {user.displayName || user.email}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono-code">Drive Conectado</div>
              </div>
              <button
                onClick={handleLogout}
                title="Desconectar"
                className="p-1.5 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleLogin()}
              disabled={isSigningIn}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 font-sans"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>{isSigningIn ? 'Conectando...' : 'Conectar com Google'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Link Input & 1-Click Extraction Button */}
      <div className="space-y-3">
        <label className="block text-xs font-mono-code text-neutral-300 flex items-center justify-between">
          <span>Link da Pasta do Google Drive (Flória):</span>
          <span className="text-[10px] text-orange-400">Pasta configurada com sucesso</span>
        </label>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={folderUrl}
            onChange={(e) => setFolderUrl(e.target.value)}
            placeholder="https://drive.google.com/drive/folders/..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 font-mono-code focus:outline-none focus:border-orange-500"
          />
          
          <button
            onClick={handleAutoExtractAll}
            disabled={isScanning || isDigesting || isSigningIn}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-600 hover:from-orange-400 hover:to-yellow-500 text-white font-bold text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0 font-sans"
          >
            <Zap className={`w-4 h-4 ${(isScanning || isDigesting) ? 'animate-bounce' : ''}`} />
            <span>
              {isScanning 
                ? 'Varrendo Pasta...' 
                : isDigesting 
                ? 'Extraindo com IA...' 
                : 'Extrair Informações do Press Kit'}
            </span>
          </button>
        </div>
      </div>

      {/* Status Progress Step */}
      {stepStatus && (
        <div className="p-3 rounded-xl bg-neutral-900/90 border border-orange-500/30 text-xs text-orange-300 flex items-center gap-2 font-mono-code">
          <RefreshCw className={`w-3.5 h-3.5 ${(isScanning || isDigesting) ? 'animate-spin' : ''}`} />
          <span>{stepStatus}</span>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Files List Display */}
      {files.length > 0 && (
        <div className="space-y-4 pt-2 border-t border-neutral-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="font-heading font-bold text-xs text-neutral-100">
                {files.length} arquivo(s) catalogado(s) na pasta
              </h4>
            </div>

            <button
              onClick={handleAutoExtractAll}
              disabled={isDigesting || isScanning}
              className="text-xs text-orange-400 hover:underline flex items-center gap-1 cursor-pointer font-sans"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reanalisar Arquivos</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1">
            {files.map((file) => (
              <div
                key={file.id}
                className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between gap-2 hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-center gap-2.5 truncate">
                  {getFileIcon(file.mimeType, file.name)}
                  <div className="truncate">
                    <div className="text-xs text-neutral-200 truncate font-medium font-sans">
                      {file.name}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono-code truncate">
                      {file.mimeType.split('.').pop()?.replace('vnd.google-apps.', '') || 'arquivo'}
                    </div>
                  </div>
                </div>

                {file.webViewLink && (
                  <a
                    href={file.webViewLink}
                    target="_blank"
                    rel="noreferrer"
                    title="Abrir no Google Drive"
                    className="p-1 rounded text-neutral-400 hover:text-orange-400 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Digestion Results Banner */}
      {digestResult && (
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-neutral-900 to-orange-950/20 border border-orange-500/30 space-y-3">
          <div className="flex items-center gap-2 text-orange-400 font-heading font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Dossiê de Flória Atualizado com os Dados do Google Drive!</span>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed font-sans">
            {digestResult.summaryOfFindings}
          </p>

          {digestResult.keyHighlights && digestResult.keyHighlights.length > 0 && (
            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-mono-code text-amber-300 uppercase">
                Principais Informações Incorporadas:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-neutral-300 font-sans">
                {digestResult.keyHighlights.map((hl: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5 bg-neutral-950/60 p-1.5 rounded-lg border border-neutral-800">
                    <span className="text-orange-400 font-bold">•</span>
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={onTriggerAllAI}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 font-sans"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recalcular Todo o Posicionamento & Conteúdos</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
