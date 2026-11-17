import type { GlobalConfig } from "payload";

/**
 * El scrollytelling del inicio lee este global (`process-page`),
 * no un global nuevo: ya tenía los pasos localizados.
 */
export const ProcessPage: GlobalConfig = {
  slug: "process-page",
  label: "Proceso",
  admin: { group: "Sitio" },
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === "admin",
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        try {
          const { revalidatePath } = await import("next/cache");
          for (const path of ["/", "/en", "/fr", "/process", "/en/process", "/fr/process"]) {
            revalidatePath(path);
          }
        } catch {
          // Seed y scripts corren fuera de una petición de Next.
        }
        return doc;
      },
    ],
  },
  fields: [
    { name: "eyebrow", type: "text", localized: true, label: "Etiqueta" },
    { name: "title", type: "text", localized: true, required: true, label: "Título" },
    { name: "emphasis", type: "text", localized: true, label: "Palabra en itálica" },
    { name: "intro", type: "textarea", localized: true, label: "Subtítulo" },
    {
      name: "steps",
      type: "array",
      localized: true,
      minRows: 3,
      maxRows: 7,
      labels: { singular: "Paso", plural: "Pasos" },
      admin: { initCollapsed: false, description: "De 3 a 7 pasos. El orden de esta lista es el orden en la página." },
      fields: [
        { name: "number", type: "text", required: true, label: "Número" },
        { name: "title", type: "text", required: true, label: "Título" },
        {
          name: "body",
          type: "textarea",
          required: true,
          label: "Descripción",
          maxLength: 220,
        },
        {
          name: "mediaType",
          type: "select",
          label: "Tipo de media",
          defaultValue: "image",
          options: [
            { label: "Imagen", value: "image" },
            { label: "Video", value: "video" },
            { label: "Lottie", value: "lottie" },
          ],
        },
        {
          name: "media",
          type: "upload",
          relationTo: "media",
          label: "Media",
          admin: {
            description: "Imagen, video (mp4/webm) o JSON de Lottie. El texto alternativo se edita en el archivo de Media.",
          },
        },
        { name: "icon", type: "upload", relationTo: "media", label: "Icono (reserva)" },
        {
          name: "cta",
          type: "group",
          label: "Enlace",
          fields: [
            { name: "label", type: "text", label: "Texto" },
            { name: "href", type: "text", label: "URL" },
          ],
        },
      ],
    },
  ],
};
