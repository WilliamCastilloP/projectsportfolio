import type { GlobalConfig } from "payload";

export const Settings: GlobalConfig = {
  slug: "settings",
  label: "Ajustes",
  admin: {
    group: "Sitio",
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    {
      name: "voice",
      type: "select",
      label: "Voz",
      required: true,
      defaultValue: "company",
      options: [
        { label: "Estudio", value: "company" },
        { label: "Persona", value: "person" },
      ],
    },
    {
      name: "name",
      type: "text",
      label: "Nombre",
    },
    {
      name: "tagline",
      type: "textarea",
      label: "Tagline footer",
      localized: true,
    },
    {
      name: "stats",
      type: "array",
      label: "Stats home",
      localized: true,
      fields: [
        { name: "value", type: "text", required: true },
        { name: "label", type: "text", required: true },
      ],
    },
    {
      name: "leadNotificationEmail",
      type: "email",
      label: "Email notificación leads",
    },
    {
      name: "role",
      type: "text",
      label: "Rol",
      localized: true,
    },
    {
      name: "timeZone",
      type: "text",
      label: "Zona horaria",
    },
    {
      name: "location",
      type: "text",
      label: "Ubicación",
      localized: true,
    },
    {
      name: "email",
      type: "email",
      label: "Email",
    },
    {
      name: "url",
      type: "text",
      label: "URL",
      admin: {
        description: "URL canónica del sitio, sin barra final.",
      },
    },
    {
      name: "hero",
      type: "group",
      label: "Hero",
      fields: [
        {
          name: "headline",
          type: "text",
          label: "Titular",
          hasMany: true,
          localized: true,
        },
        {
          name: "intro",
          type: "textarea",
          label: "Introducción",
          localized: true,
        },
      ],
    },
    {
      name: "contact",
      type: "group",
      label: "Contacto",
      fields: [
        {
          name: "heading",
          type: "text",
          label: "Título",
          localized: true,
        },
        {
          name: "body",
          type: "textarea",
          label: "Cuerpo",
          localized: true,
        },
      ],
    },
    {
      name: "socials",
      type: "array",
      label: "Redes",
      labels: { singular: "Red", plural: "Redes" },
      fields: [
        {
          name: "label",
          type: "text",
          label: "Etiqueta",
          required: true,
        },
        {
          name: "href",
          type: "text",
          label: "Enlace",
          required: true,
        },
      ],
    },
  ],
};
