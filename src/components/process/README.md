# Proceso (scrollytelling)

La sección del inicio lee el global **Proceso** (`process-page`) en Payload. Ahí se editan el título, el subtítulo y de 3 a 7 pasos (título, descripción, media, enlace). El orden de la lista es el orden en la página. `/process` redirige a `/#process`.

Sin media, cada paso usa `/public/process/step-1.svg` … `step-5.svg`.

Constantes en `constants.ts`: `stickyTop`, `sectionPad` (mismo arriba/abajo), `panelMin` y `progress`. El tipo `lottie` está en el modelo; el reproductor no está instalado y ese paso muestra un recuadro de reserva.
