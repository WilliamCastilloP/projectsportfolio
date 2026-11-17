/** Ajustes del scrollytelling. La barra copia el degradado rosa a azul de la referencia. */
export const PROCESS_MOTION = {
  stickyTop: "7rem",
  /** Padding vertical de la sección (arriba = abajo; el contenido final se pega a este pb). */
  sectionPad: "6rem",
  panelMin: "60vh",
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
  progress: "linear-gradient(90deg, #ff3d8a 0%, #b56cf5 48%, #4d8fff 100%)",
  inactiveOpacity: 0.3,
  scaleRest: 0.97,
} as const;
