// ─────────────────────────────────────────────────────────────────────────────
// src/services/imageUtils.js
//
// Converte links do Google Drive para URL de imagem direta.
// Qualquer outra URL passa sem alteração.
//
// Formatos aceitos:
//   https://drive.google.com/file/d/ID/view?usp=sharing
//   https://drive.google.com/open?id=ID
//   https://drive.google.com/uc?id=ID
// ─────────────────────────────────────────────────────────────────────────────

function extractDriveId(url) {
  if (!url || typeof url !== "string") return null;
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) return idMatch[1];
  return null;
}

export function resolveImageUrl(url) {
  if (!url) return url;
  const driveId = extractDriveId(url);
  if (driveId) return `https://lh3.googleusercontent.com/d/${driveId}`;
  return url;
}
