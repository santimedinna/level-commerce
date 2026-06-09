export const COLOR_MAP: Record<string, string> = {
  Blanco: "#f5f5f5",
  Negro:  "#1a1a1a",
  Azul:   "#2c4a7c",
  Beige:  "#c8a882",
  Verde:  "#3d6b4f",
  Gris:   "#9a9a9a",
  Bordó:  "#7c2637",
};

export const LIGHT_COLORS = new Set(["Blanco"]);

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

const SIZE_ORDER = [
  "XS", "S", "M", "L", "XL", "XXL",
  "36", "38", "40", "42", "44", "46",
  "Único",
];

export function sortSizes(sizes: string[]): string[] {
  return [...sizes].sort((a, b) => {
    const ai = SIZE_ORDER.indexOf(a);
    const bi = SIZE_ORDER.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });
}
