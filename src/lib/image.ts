// Téléversement de photos réelles : compression côté navigateur avant stockage.
// Les images sont redimensionnées et converties en data URL JPEG, puis sauvées
// dans le champ texte « image » (Neon) — aucun service de stockage externe requis.

const MAX_DIMENSION = 1600 // pixels (plus grand côté)
const QUALITY = 0.82
const MAX_RAW_SIZE = 10 * 1024 * 1024 // 10 Mo fichier source
const MAX_RESULT_CHARS = 1_600_000 // garde-fou sur la data URL finale (~1,2 Mo)

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("L'image n'a pas pu être lue."))
    img.src = src
  })
}

export async function fileToCompressedDataUrl(file: File): Promise<string> {
  if (!isImageFile(file)) {
    throw new Error('Veuillez choisir un fichier image (JPG, PNG, WebP…).')
  }
  if (file.size > MAX_RAW_SIZE) {
    throw new Error('Image trop lourde (10 Mo maximum). Choisissez une photo moins volumineuse.')
  }

  const objectUrl = URL.createObjectURL(file)
  try {
    const img = await loadImage(objectUrl)
    const scale = Math.min(1, MAX_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight))
    const width = Math.max(1, Math.round(img.naturalWidth * scale))
    const height = Math.max(1, Math.round(img.naturalHeight * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error("Compression impossible sur cet appareil.")
    ctx.drawImage(img, 0, 0, width, height)

    // JPEG sur fond blanc (les PNG transparents deviennent nets, pas noirs)
    const dataUrl = canvas.toDataURL('image/jpeg', QUALITY)
    if (dataUrl.length > MAX_RESULT_CHARS) {
      throw new Error("L'image compressée reste trop volumineuse. Choisissez une photo plus petite.")
    }
    return dataUrl
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}
