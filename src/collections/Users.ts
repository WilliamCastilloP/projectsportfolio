import type { Access, CollectionConfig } from "payload";

const isAdmin: Access = ({ req: { user } }) => user?.role === "admin";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Usuario", plural: "Usuarios" },
  admin: {
    useAsTitle: "email",
    group: "Admin",
    hidden: ({ user }) => user?.role !== "admin",
  },
  auth: true,
  access: {
    admin: ({ req: { user } }) => user?.role === "admin" || user?.role === "editor",
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    unlock: isAdmin,
  },
  fields: [
    {
      name: "role",
      type: "select",
      label: "Rol",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
    },
  ],
};
