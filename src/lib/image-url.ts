const GOOGLE_DRIVE_HOSTS = new Set([
  "drive.google.com",
  "www.drive.google.com",
]);

function extractGoogleDriveId(url: URL): string | null {
  const idFromQuery = url.searchParams.get("id");
  if (idFromQuery) return idFromQuery;

  const match = url.pathname.match(/\/file\/d\/([^/]+)/);
  return match?.[1] ?? null;
}

export function normalizeImageUrl(value: string | null | undefined): string {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return "";

  try {
    const url = new URL(trimmed);

    if (!GOOGLE_DRIVE_HOSTS.has(url.hostname)) {
      return trimmed;
    }

    const fileId = extractGoogleDriveId(url);
    if (!fileId) {
      return trimmed;
    }

    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  } catch {
    return trimmed;
  }
}

export function isValidImageUrl(value: string | null | undefined): boolean {
  const normalized = normalizeImageUrl(value);
  if (!normalized) return true;

  try {
    const url = new URL(normalized);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
