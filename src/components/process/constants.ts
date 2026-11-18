/**
 * Reparto de columnas en desktop. Probar en navegador antes de fijar:
 * - `equal`: 50/50
 * - `wide-media`: 5/7 (más ancho para la imagen)
 */
export const PROCESS_LAYOUT = {
  columnSplit: "wide-media" as "equal" | "wide-media",
} as const;

/** Ajustes del scrollytelling. La barra usa `--process-progress` (Teal → Violet en globals.css). */
export const PROCESS_MOTION = {
  stickyTop: "7rem",
  /** Padding vertical de la sección (arriba = abajo; el contenido final se pega a este pb). */
  sectionPad: "6rem",
  /** Rango de scroll del panel (opacidad/escala). */
  panelOffset: ["start 0.65", "end 0.35"] as const,
  /**
   * 0 cuando el tope del panel llega al centro; 1 cuando el fondo llega al centro.
   * Con la carta centrada la barra queda ~50%.
   */
  progressOffset: ["start center", "end center"] as const,
  /**
   * Último paso: arranca en 0 al centro; el fin (alineación con la barra)
   * se calcula en runtime como `end ${barY}`.
   */
  progressOffsetLastStart: "start center" as const,
  progress: "var(--process-progress)",
  inactiveOpacity: 0.3,
  scaleRest: 0.97,
} as const;
