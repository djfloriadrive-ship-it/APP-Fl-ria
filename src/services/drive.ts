export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  webViewLink?: string;
  thumbnailLink?: string;
  modifiedTime?: string;
  textContent?: string;
  base64Data?: string;
}

export function extractFolderId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  // Handle URLs like https://drive.google.com/drive/folders/1xvMmiDn9H-ORszmTN1HhsNpU2ebm8Dn4?usp=sharing
  const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch && folderMatch[1]) {
    return folderMatch[1];
  }
  // Handle /d/ID
  const dMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (dMatch && dMatch[1]) {
    return dMatch[1];
  }
  // Otherwise assume it's already an ID
  return trimmed;
}

export async function listDriveFolder(
  folderId: string,
  accessToken: string
): Promise<DriveFileItem[]> {
  const cleanId = extractFolderId(folderId);
  if (!cleanId) throw new Error('ID de pasta do Google Drive inválido');

  const query = encodeURIComponent(`'${cleanId}' in parents and trashed = false`);
  const fields = encodeURIComponent('files(id, name, mimeType, size, webViewLink, thumbnailLink, modifiedTime)');
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&pageSize=100&orderBy=folder,name`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Erro ao acessar o Drive (${response.status})`);
  }

  const data = await response.json();
  return data.files || [];
}

export async function readDriveFileDetails(
  file: DriveFileItem,
  accessToken: string
): Promise<{ textContent?: string; base64Data?: string; mimeType: string }> {
  try {
    // 1. Google Docs -> Export as text
    if (file.mimeType === 'application/vnd.google-apps.document') {
      const exportUrl = `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/plain`;
      const res = await fetch(exportUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const text = await res.text();
        return { textContent: text, mimeType: 'text/plain' };
      }
    }

    // 2. Google Slides -> Export as text
    if (file.mimeType === 'application/vnd.google-apps.presentation') {
      const exportUrl = `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/plain`;
      const res = await fetch(exportUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const text = await res.text();
        return { textContent: text, mimeType: 'text/plain' };
      }
    }

    // 3. Google Sheet -> Export as CSV
    if (file.mimeType === 'application/vnd.google-apps.spreadsheet') {
      const exportUrl = `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/csv`;
      const res = await fetch(exportUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const text = await res.text();
        return { textContent: text, mimeType: 'text/csv' };
      }
    }

    // 4. Text/Markdown/JSON files
    if (
      file.mimeType.startsWith('text/') ||
      file.name.endsWith('.txt') ||
      file.name.endsWith('.md') ||
      file.name.endsWith('.json') ||
      file.name.endsWith('.csv')
    ) {
      const downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;
      const res = await fetch(downloadUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const text = await res.text();
        return { textContent: text, mimeType: file.mimeType || 'text/plain' };
      }
    }

    // 5. PDF or Image files -> Download binary as base64 for Multimodal Gemini processing
    if (
      file.mimeType === 'application/pdf' ||
      file.name.endsWith('.pdf') ||
      file.mimeType.startsWith('image/') ||
      file.name.match(/\.(jpg|jpeg|png|webp)$/i)
    ) {
      const downloadUrl = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;
      const res = await fetch(downloadUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        const resolvedMime = file.mimeType === 'application/pdf' || file.name.endsWith('.pdf')
          ? 'application/pdf'
          : file.mimeType || 'image/jpeg';

        return {
          textContent: `[Arquivo binário multimodal: ${file.name}]`,
          base64Data: base64,
          mimeType: resolvedMime,
        };
      }
    }

    return {
      textContent: `[Arquivo: ${file.name} | Tipo: ${file.mimeType}]`,
      mimeType: file.mimeType,
    };
  } catch (err) {
    console.warn(`Erro ao ler arquivo ${file.name}`, err);
    return {
      textContent: `[Arquivo ${file.name}]`,
      mimeType: file.mimeType,
    };
  }
}
