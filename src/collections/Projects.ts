import type { Access, CollectionConfig } from "payload";
import { uniqueSlug } from "../lib/unique-slug";

const isStaff: Access = ({ req: { user } }) =>
  ["admin", "editor"].includes(user?.role ?? "");

const isAdmin: Access = ({ req: { user } }) => user?.role === "admin";

const urlField = (name: "liveUrl" | "repoUrl", label: string) =>
  ({
    name,
    type: "text" as const,
    label,
    validate: (value: string | null | undefined) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return "Debe ser una URL válida";
      }
    },
  }) satisfies CollectionConfig["fields"][number];

export const Projects: CollectionConfig = {
  slug: "projects",
  labels: { singular: "Proyecto", plural: "Proyectos" },
  admin: {
    useAsTitle: "title",
    group: "Trabajo",
    defaultColumns: ["title", "status", "year", "featured", "order"],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === "admin" || user?.role === "editor") return true;
      return { status: { equals: "published" } };
    },
    create: isStaff,
    update: isStaff,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      async ({ data, originalDoc, operation, req }) => {
        const title = typeof data.title === "string" ? data.title : originalDoc?.title;
        const currentSlug =
          (typeof data.slug === "string" && data.slug) || originalDoc?.slug;

        if (!currentSlug && typeof title === "string" && title.length > 0) {
          data.slug = await uniqueSlug({
            payload: req.payload,
            title,
            collection: "projects",
            excludeId: originalDoc?.id,
          });
        }

        return data;
      },
    ],
    afterRead: [
      ({ doc, req }) => {
        const role = req.user?.role;
        if (role !== "admin" && role !== "editor") {
          delete doc.internalNotes;
        }
        return doc;
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Título",
      required: true,
      localized: true,
    },
    {
      name: "description",
      type: "textarea",
      label: "Descripción",
      required: true,
      maxLength: 240,
      localized: true,
    },
    {
      name: "year",
      type: "number",
      label: "Año",
      required: true,
      min: 1990,
      max: 2999,
    },
    {
      name: "stack",
      type: "text",
      label: "Stack",
      hasMany: true,
      required: true,
      minRows: 1,
    },
    {
      name: "cover",
      type: "upload",
      label: "Portada",
      relationTo: "media",
      required: true,
    },
    {
      name: "images",
      type: "array",
      label: "Imágenes",
      labels: { singular: "Imagen", plural: "Imágenes" },
      fields: [
        {
          name: "image",
          type: "upload",
          label: "Imagen",
          relationTo: "media",
          required: true,
        },
        {
          name: "alt",
          type: "text",
          label: "Texto alternativo",
          localized: true,
        },
        {
          name: "caption",
          type: "text",
          label: "Pie de foto",
          localized: true,
        },
      ],
    },
    urlField("liveUrl", "Sitio en vivo"),
    urlField("repoUrl", "Repositorio"),
    {
      name: "featured",
      type: "checkbox",
      label: "Destacado",
      defaultValue: false,
      admin: { position: "sidebar" },
    },
    {
      name: "order",
      type: "number",
      label: "Orden",
      defaultValue: 100,
      admin: { position: "sidebar" },
    },
    {
      name: "status",
      type: "select",
      label: "Estado",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Borrador", value: "draft" },
        { label: "Publicado", value: "published" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "body",
      type: "richText",
      label: "Cuerpo",
      localized: true,
    },
    {
      name: "aside",
      type: "textarea",
      label: "Nota al margen",
      localized: true,
    },
    {
      name: "categories",
      type: "select",
      hasMany: true,
      label: "Categorías",
      options: [
        { label: "Website", value: "website" },
        { label: "E-commerce", value: "ecommerce" },
        { label: "Landing", value: "landing" },
        { label: "Branding", value: "branding" },
      ],
    },
    { name: "client", type: "text", localized: true, label: "Cliente" },
    { name: "industry", type: "text", localized: true, label: "Industria" },
    { name: "platform", type: "text", localized: true, label: "Plataforma" },
    { name: "servicesOffered", type: "text", hasMany: true, localized: true, label: "Servicios" },
    { name: "desktopImage", type: "upload", relationTo: "media", label: "Mockup desktop" },
    { name: "mobileImage", type: "upload", relationTo: "media", label: "Mockup mobile" },
    { name: "challenge", type: "textarea", localized: true, label: "Challenge" },
    { name: "solution", type: "textarea", localized: true, label: "Solution" },
    { name: "deliverables", type: "text", hasMany: true, localized: true, label: "Deliverables" },
    {
      name: "keyPages",
      type: "array",
      localized: true,
      label: "Key pages",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea" },
        { name: "image", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "testimonial",
      type: "group",
      localized: true,
      label: "Testimonial",
      fields: [
        { name: "quote", type: "textarea" },
        { name: "author", type: "text" },
        { name: "role", type: "text" },
        { name: "avatar", type: "upload", relationTo: "media" },
      ],
    },
    { name: "liveLabel", type: "text", localized: true, label: "Live CTA label" },
    {
      name: "internalNotes",
      type: "textarea",
      label: "Notas internas",
      admin: {
        position: "sidebar",
        description: "Solo el equipo. No se expone en el sitio público.",
      },
    },
    {
      name: "slug",
      type: "text",
      label: "Slug",
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        position: "sidebar",
      },
    },
  ],
};
