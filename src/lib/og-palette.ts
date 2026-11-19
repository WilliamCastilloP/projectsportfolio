/**
 * Hex literales para imágenes OG (Satori no resuelve variables CSS) y `themeColor`.
 * Espejo de los tokens de `:root` en `globals.css`. Si la paleta cambia, cambia aquí también.
 * `muted` es la mezcla RGB al 68 % de ink sobre crema (~4.8:1); oklab no está disponible en Satori.
 */
export const ogPalette = {
  bg: "#faf8f5",
  surface: "#ffffff",
  ink: "#2c2c34",
  brand: "#8236d3",
  teal: "#51a3a3",
  apricot: "#f9c784",
  lilac: "#978897",
  muted: "#6e6d72",
  brandSoft: "#eee4f2",
  tealSoft: "#e2ece9",
  apricotSoft: "#f9eddc",
} as const;
