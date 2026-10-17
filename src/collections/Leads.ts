import type { Access, CollectionConfig } from "payload";

const isStaff: Access = ({ req: { user } }) =>
  ["admin", "editor"].includes(user?.role ?? "");

export const Leads: CollectionConfig = {
  slug: "leads",
  labels: { singular: "Lead", plural: "Leads" },
  admin: {
    group: "Ventas",
    useAsTitle: "email",
    defaultColumns: ["email", "projectType", "status", "createdAt"],
  },
  access: {
    read: isStaff,
    create: () => true,
    update: isStaff,
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    {
      name: "projectType",
      type: "select",
      required: true,
      options: [
        { label: "New website", value: "new-website" },
        { label: "Redesign", value: "redesign" },
        { label: "E-commerce", value: "ecommerce" },
        { label: "Something else", value: "other" },
      ],
    },
    {
      name: "stage",
      type: "select",
      required: true,
      options: [
        { label: "Just an idea", value: "idea" },
        { label: "Ready to start", value: "ready" },
        { label: "Existing website", value: "existing" },
      ],
    },
    {
      name: "timeline",
      type: "select",
      required: true,
      options: [
        { label: "ASAP", value: "asap" },
        { label: "1-3 months", value: "1-3" },
        { label: "3-6 months", value: "3-6" },
        { label: "6+ months", value: "6plus" },
      ],
    },
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "company", type: "text" },
    { name: "description", type: "textarea" },
    { name: "locale", type: "text" },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Read", value: "read" },
      ],
      admin: { position: "sidebar" },
    },
  ],
};
