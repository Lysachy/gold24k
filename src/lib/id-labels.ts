// Indonesian labels for admin panel
// Database values remain in English, these are display-only

export const CATEGORY_LABELS: Record<string, string> = {
  Ring: "Cincin",
  Necklace: "Kalung",
  Bracelet: "Gelang",
  Earring: "Anting",
  Bar: "Batangan",
  Coin: "Koin",
  Pendant: "Liontin",
  Other: "Lainnya",
};

export const STATUS_LABELS: Record<string, string> = {
  available: "Tersedia",
  sold: "Terjual",
};

export function categoryLabel(value: string): string {
  return CATEGORY_LABELS[value] || value;
}

export function statusLabel(value: string): string {
  return STATUS_LABELS[value] || value;
}
