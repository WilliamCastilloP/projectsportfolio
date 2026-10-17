# Plan: Studio CMS

## Supuestos no verificados en este repo

Este repositorio **no contiene** Payload, `src/`, `payload.config.ts`, `.cursor/rules/` ni `AGENTS.md`. El estándar de casa (Payload 3.83.x, MongoDB, Cloudinary, route groups `(frontend)`/`(payload)`, global `settings`) se toma del brief de arquitectura, no de un lockfile hermano leído aquí. Next está en **16.3.1** (no 16.2.x); no se downgradea. El `cn()` actual en `lib/utils.ts` es un `filter(Boolean).join`, no `clsx` + `tailwind-merge`. Hay `package-lock.json` (npm). Los 9 PNG de `public/projects/` existen: el build no está roto hoy; el fail-fast por asset faltante es el contrato actual, no un fallo abierto.

---

## Cambios sugeridos

Priorizado: qué se percibe primero vs qué desbloquea operar sin código. Nada de esto es un rediseño.

1. **Voz de estudio (inmediato, reversible).** El sitio ya tiene `mode: "person" | "company"` y copy dual en `content/site.ts`. Hoy está en `"person"`: el hero dice "I design…", el contacto "reach me", el JSON-LD es `Person`, el nav de About no dice "Studio". Pasar a empresa es copy + schema.org, no layout. Los tres MDX semilla hablan en primera persona ("What I built") y hay que reescribirlos a "we" al migrar.
2. **CMS de casos de estudio (la transacción central).** Publicar, editar, ocultar un proyecto y que `/` y `/work/<slug>` lo reflejen **sin commit**. Payload es el default de casa; MDX-en-git se descarta porque contradice el pedido.
3. **Identidad y copy en el global `settings`.** Nombre del estudio, rol, email, socials, hero, about, contacto. El sistema de diseño (tokens, motion, grid) se queda en código.
4. **Media en Cloudinary.** El admin no puede depender de `public/` + rebuild. Vercel es efímero para uploads locales.
5. **Home = selected; `/work` = archivo.** Con decenas de casos, el grid de la home dejaría de ser editorial. `featured` ya existe en el frontmatter.
6. **`/about` es la página del estudio.** About deja de ser solo un ancla en la home. El nav apunta a `/about`. La home conserva un teaser corto (excerpt + facts + enlace). El copy largo vive en el global `about-page`.
7. **Caché declarada + revalidación al publicar.** Hoy no hay `revalidate` ni `force-dynamic`: todo es SSG de ficheros. Con CMS hay que decidirlo (no repetir el anti-patrón de pegar a Mongo en cada request sin haberlo elegido).
8. **Fuera de alcance a propósito.** i18n público, formulario de contacto, pasarela, theme toggle, layout builder de blocks, cuentas de cliente. El visual dark editorial no se toca.

---

## Objetivo

Al terminar, el dueño del estudio entra a `/admin` (Payload, UI en español), crea o edita un caso, lo marca `published` u lo deja `draft` (oculto), sube cover y screenshots, y el sitio público en inglés — home (Hero → Selected work → teaser About → Contact), archivo `/work`, ficha `/work/<slug>`, página de estudio `/about`, mismos tokens y motion — refleja el cambio en segundos sin redeploy. Se comprueba así: un proyecto en `draft` no aparece en home, `/work`, sitemap ni OG; al pasarlo a `published`, aparece en los tres sin `git push`. `/about` lista en sitemap y el nav "About"/"Studio" abre esa ruta, no `/#about`.

---

## Decisiones de arquitectura

| Decisión | Alternativa descartada | Motivo |
| --- | --- | --- |
| **Payload 3.83.x embebido** en la misma app Next, MongoDB (`mongooseAdapter`), admin en `/admin` | Seguir con MDX-en-git; Sanity / Contentful; un JSON en el repo | El pedido es gestionar proyectos sin tocar código. MDX exige commit + build (el fail-fast actual es una feature de CI, no un CMS). Cualquier headless distinto de Payload es desviación del estándar de casa. |
| **Frontera CMS / código** | Meter tokens o motion en el CMS; dejar copy en `content/site.ts` | CMS: identidad, copy, proyectos, media, enlaces, `status`, página About. Código: `app/globals.css` (`@theme`), layout, `Reveal` / `ViewTransition` / spotlight, componentes `Note`/`Figure` como presentación, hrefs del nav (`/#work`, `/about`, `/#contact`). |
| **Collection `projects`** mapeada 1:1 al frontmatter actual + `status` + `aside` + Lexical `body` | Layout builder de blocks; collection `tags` para el stack; textarea Markdown | Escala de decenas, no un page builder. El stack como `string[]` basta. Lexical + `FixedToolbarFeature` es el editor de casa. Un `aside` opcional sustituye `<Note>` sin inventar blocks. |
| **Cuerpo = Lexical**, no MDX en el admin | Guardar Markdown en un textarea; plantilla fija Context / Built / Details | El staff no escribe MDX. Lexical cubre headings, listas, links y código que ya usa `components/mdx.tsx`. **Plantilla fija sería más rígida y cambiaría la migración**: se deja como la pregunta que más movería el plan. |
| **Media: Cloudinary** (`payload-cloudinary`, folder `portfolio`) | Seguir con `public/projects/<slug>/`; Vercel Blob | Uploads locales no sobreviven al filesystem de Vercel. Cloudinary es el estándar de casa. `next/image` con `remotePatterns` para `res.cloudinary.com`. |
| **Caché: ISR 300s + `revalidatePath`/`revalidateTag` en `afterChange`** | `force-dynamic` en todo el storefront (ARCHIES); no declarar nada (AUSTIN); SSG puro de build | Rutas públicas idénticas para todos los visitantes; volumen bajo; la operación que no puede fallar es **publicar y que se vea**. ISR cubre si el hook falla; on-demand cubre el "ya". Admin y APIs de Payload quedan dinámicos. |
| **Auth: solo Users de Payload**, roles `admin` / `editor` | NextAuth; rol `customer` de casa | No hay cuentas de cliente. El admin de Payload es suficiente. Omitir `customer` es desviación justificada. |
| **Voz empresa por defecto** en `settings.voice`, un solo juego de copy (no dual person/company en el admin) | Dejar `content/site.ts` y solo flippear `mode`; mantener ambos copies lado a lado | Dual copy era para un toggle en código. En CMS el editor reescribe. `voice` solo cambia JSON-LD (`Organization` vs `Person`), `jobTitle`, y el label de sección About → "Studio". Hero/about/contact se editan como copy de estudio. |
| **Sí hay `/work` índice** | Solo `/#work` para siempre | Home muestra `featured` (fallback: los 4 de menor `order` si ninguno está featured) para no romper el registro editorial. `/work` lista todos los `published`, mismo `ProjectCard`, sin rediseño. Nav "Work" sigue yendo a `/#work`; un enlace "All work" sale del bloque Selected work cuando hay más proyectos que los de home. |
| **Sí hay `/about` dedicada** | Dejar About solo como `#about` en la home | Un estudio necesita URL propia (sitemap, OG, compartir). Home: teaser (`excerpt` + facts + "About the studio"). `/about`: heading, excerpt, body largo, facts, `principles[]` (cómo trabajamos). Nav About/Studio → `/about`. Global `about-page` (mismo patrón que AUSTIN), no un page builder. |
| **`status`: `select` `draft` \| `published`** | Drafts nativos de Payload; campo extra `hidden` | Estándar de casa. Ocultar = `draft`. `read` público filtra `published`. |
| **Mover a `src/` + route groups `(frontend)` / `(payload)`** | Embeber Payload sobre `app/` plano | Desviación evitaría el estándar canónico y pelearía con `withPayload()`. El move es mecánico y va en WP-01. |
| **Gestor: npm** | pnpm | Lo dicta `package-lock.json`. No se cambia. |
| **Next 16.3.1 se queda** | Bajar a 16.2.x del estándar escrito | Ya instalado; no hay motivo de producto para downgrade. Desviación heredada, no nueva. |
| **i18n público: no** | `[locale]` en el App Router | Pedido: un sitio, inglés. Admin Payload en español (labels de collection/campos). i18n público sería desviación opcional futura. |
| **Sin cobro, sin Resend, sin Route Handlers de negocio** | Formulario de contacto, Square | La transacción es publicar, no cobrar ni enviar mail. El contacto actual (mailto + copy) se conserva. |

---

## Modelo de datos

### Collection `users`

- **Slug:** `users` (Payload auth).
- **Campos:** email, password, `role`: `admin` \| `editor` (default `editor`).
- **Access:**
  - `admin` true solo si `role === 'admin'` (el panel de users).
  - `read`/`create`/`update`/`delete` de users: solo `admin`.
- **Hooks:** ninguno de negocio.
- **Notas:** no hay `customer`. Primer usuario: pantalla de init de Payload en `/admin`; no seedear contraseñas en el repo.

### Collection `media`

- **Slug:** `media`.
- **Plugin:** `payload-cloudinary`, folder Cloudinary `portfolio`.
- **Campos:** upload estándar + `alt` (text, requerido en cover/gallery vía el array que lo consume).
- **Access:** `read` público; `create`/`update` `admin`+`editor`; `delete` solo `admin`.

### Collection `projects`

- **Slug:** `projects`.
- **Campos clave (mapeo desde el frontmatter actual):**

  | Frontmatter MDX hoy | Campo Payload | Notas |
  | --- | --- | --- |
  | filename = slug | `slug` text, `readOnly`, único | `beforeChange` lo genera desde `title` con helper de unicidad. No se edita a mano salvo un WP futuro de "override". |
  | `title` | `title` text, required | Card, H1, OG. |
  | `description` | `description` textarea, required, max 240 | Zod en el adapter público también. |
  | `year` | `year` number, required, 1990–2999 | Label mono. |
  | `stack` | `stack` array of text, min 1 | Chips; los 3 primeros en el eyebrow del detalle. |
  | `cover` path | `cover` upload → `media`, required | URL Cloudinary en el adapter (`coverUrl`). Sigue alimentando `<ViewTransition name="project-cover-{slug}">`. |
  | `images[]` | `images` array: `image` upload, `alt`, `caption` | Galería "Screens". |
  | `liveUrl` | `liveUrl` text (URL), optional | "Live site". |
  | `repoUrl` | `repoUrl` text (URL), optional | "Source". En voz estudio suele quedar vacío en trabajo de cliente; el campo se queda. |
  | `featured` | `featured` checkbox, default false | Home + `sm:col-span-2`. |
  | `order` | `order` number, default 100 | Menor primero. Sort público: featured → order → year desc → title. |
  | (nuevo) | `status` select `draft` \| `published`, default `draft` | Ocultar = `draft`. |
  | body MDX | `body` richText Lexical + `FixedToolbarFeature` | Headings, paragraphs, lists, links, code, quote. Sin JS. |
  | `<Note>` | `aside` textarea, optional | El frontend reutiliza `components/mdx.tsx` → `Note`. |
  | (nuevo) | `internalNotes` textarea, optional | Solo staff; `afterRead` lo oculta si el user no es admin/editor. |

- **Access:**
  - `read`: público **solo** `status === 'published'`; `admin`+`editor` leen todos.
  - `create`/`update`: `admin`+`editor`.
  - `delete`: solo `admin`.
- **Hooks:**
  - `beforeChange`: slug único desde `title` si es documento nuevo o el título cambió y el slug está vacío.
  - `afterChange`: `revalidateTag('projects')`, `revalidateTag('project:{slug}')`, `revalidatePath('/')`, `revalidatePath('/work')`, `revalidatePath('/work/{slug}')`, `revalidatePath('/sitemap.xml')`. **Nunca bloquea**: try/catch + log.
  - `afterRead`: strip `internalNotes` para requests sin user staff.

Admin: labels en español (`Proyectos`, `Estado`, `Destacado`, `Cuerpo`, `Nota al margen`, etc.). El contenido de cada caso sigue en inglés (sitio público).

### Global `settings`

- **Slug:** `settings`.
- **Campos:**
  - `voice`: `company` \| `person` (default `company`).
  - `name`, `role`, `timeZone`, `location`, `email`, `url` (sin trailing slash).
  - `hero.headline`: array of text (una línea por row, como hoy).
  - `hero.intro`: textarea.
  - `contact.heading`, `contact.body`.
  - `socials`: array `{ label, href }`.
- **No va en settings:** el copy largo de About (vive en `about-page`), hrefs del nav (código), tokens CSS, Cloudinary API secret, `PAYLOAD_SECRET`.
- **Access:** `read` público (todo este copy ya es público); `update` solo `admin`. `editor` no cambia la identidad del estudio.
- **Hooks:** `afterChange` revalida `/`, layout metadata, OG de sitio; try/catch.

Seed inicial del global: `voice: company`; `name` / `role` / `email` / `url` aún placeholder. Hero y contact se reescriben a primera persona del plural en el seed (WP-07 lista el copy exacto). El about histórico de `content/site.ts` (`about.company`) va al global `about-page`, no a settings.

### Global `about-page`

- **Slug:** `about-page`.
- **Campos:**
  - `heading`: text, required (p. ej. "About the studio").
  - `excerpt`: array of textarea, 1–2 párrafos. Es lo que muestra el teaser de la home.
  - `body`: array of textarea, el relato largo de `/about` (después del excerpt). Sin Lexical: párrafos, no un editor de páginas.
  - `facts`: array `{ label, value }` — la dl monoespaciada de hoy.
  - `principles`: array `{ title, body }` opcional — "How we work" / cómo tomamos encargos. Vacío = la sección no se renderiza.
- **Access:** `read` público; `update` solo `admin`.
- **Hooks:** `afterChange` → `revalidatePath('/')`, `revalidatePath('/about')`, tag `about`; try/catch.
- **Admin:** labels en español (`Página About`, `Extracto`, `Cuerpo`, `Hechos`, `Principios`). Copy público en inglés.

Home y `/about` leen el mismo global. Home: `heading` + `excerpt` + `facts` + enlace "About the studio" → `/about`. `/about`: todo lo anterior más `body` y `principles`. No se duplica copy en settings.

### Qué no se modela

- Nav links, motion, tokens, página legales, blog, testimonials, team (más allá de `principles`).
- Drafts nativos, versions, live preview (volumen bajo; ISR + on-demand basta).
- Un page builder de blocks para `/about`.

---

## Superficie de rutas

| Ruta | Tipo | Auth | Caché | Datos |
| --- | --- | --- | --- | --- |
| `/` | page `(frontend)` | pública | ISR `revalidate = 300` + tags `settings`, `projects`, `about` | `settings` + teaser `about-page` + proyectos featured (o fallback 4) |
| `/about` | page `(frontend)` | pública | ISR 300 + tag `about` | global `about-page` + `settings.name` (metadata) |
| `/work` | page `(frontend)` | pública | ISR 300 + tag `projects` | todos los `published`, mismo sort |
| `/work/[slug]` | page `(frontend)` | pública; `draft` → `notFound()` | ISR 300 + tag `project:{slug}` | un proyecto + neighbours `published` |
| `/work/[slug]/opengraph-image` | ImageResponse | pública | misma tag `project:{slug}` | title, description, year, stack, `settings.name` |
| `/opengraph-image` | ImageResponse | pública | tag `settings` | hero + name |
| `/sitemap.xml` | `sitemap.ts` | pública | revalidate 300 / on-demand | `settings.url` + slugs published |
| `/robots.txt` | `robots.ts` | pública | ISR 300 + `settings` | `settings.url` |
| `/admin/*` | `(payload)` | staff Payload | sin caché de storefront | — |
| `/api/[...slug]` | Payload REST/GraphQL | access de collections | dinámico | no lo consume el storefront |

`generateStaticParams` en `/work/[slug]` lista slugs `published` al build. `dynamicParams = true` para proyectos creados post-deploy.

**Invariante de datos:** el servidor usa Local API `getPayload({ config })` (una instancia por request, `React.cache`). **Nunca** `fetch('/api/...')` desde Server Components. El navegador no habla con la REST de Payload; no hay Route Handlers de negocio en este plan.

Componentes cliente actuales (`hero.tsx`, `nav.tsx`, `contact.tsx`) **no pueden** llamar a Payload. Cada uno recibe props desde un wrapper server (p.ej. `Hero` sigue siendo client de motion; `app/(frontend)/page.tsx` o un `HeroSection` server le pasa `headline`, `intro`, `role`, `location`, `email`).

---

## Integraciones

| Tercero | Uso | Dónde | Credenciales | Fallo |
| --- | --- | --- | --- | --- |
| **MongoDB Atlas** | DB de Payload | `mongooseAdapter` en `src/payload.config.ts` | `DATABASE_URI` en env (no en Markdown) | Si Mongo no responde, `/admin` y el storefront que lee CMS fallan; ISR sirve la última página buena hasta el TTL. |
| **Cloudinary** | covers y screens | plugin `payload-cloudinary`, folder `portfolio` | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` en env | Upload en admin error visible; un `published` sin `cover` no debe ser posible (`required`). No fallar el build entero. |
| **Payload Auth** | staff | collection `users` | `PAYLOAD_SECRET`; cookie de admin | Sin secret no arranca. No hay OAuth de terceros. |
| **Vercel** | host | igual que hoy | env vars nuevas en el proyecto | Primer deploy necesita las tres familias de env; hoy el README dice "no env vars" — hay que corregirlo. |
| **Resend / Square** | — | — | — | No aplican. |

`.env.example` lista todas las claves nuevas **sin valores secretos**. No hay credenciales en este plan ni en el README.

Versiones objetivo (alinear con casa, sin bajar Next): `payload` `3.83.x`, `@payloadcms/next`, `@payloadcms/db-mongodb`, `@payloadcms/richtext-lexical`, `@payloadcms/ui`, `payload-cloudinary`. Next se queda en `^16.3.1`. Zod ya está (`^4.4.3`) y se usa en el adapter público.

---

## Invariantes

1. Un documento `projects` con `status: 'draft'` no aparece en home, `/work`, `/work/[slug]` (404), sitemap ni OG. Publicarlo es suficiente para que aparezca; no hace falta commit.
2. El importe no aplica. No se añade Square ni se acepta un precio del cliente.
3. `getPayload` solo en servidor. Client components reciben props.
4. `afterChange` (revalidación, logs) no lanza: try/catch.
5. `internalNotes` nunca sale en el HTML público ni en el tipo `PublicProject`.
6. El slug es único, `readOnly` en admin, generado en `beforeChange`.
7. Cover es required en Payload. No hay fail-the-build por PNG faltante en `public/`.
8. Tokens, `color-scheme: dark`, Geist, motion y `ViewTransition` de covers no se reimplementan ni se parametrizan en el CMS.
9. El sitio público permanece `lang="en"`. Labels del admin en español.
10. Tras cualquier cambio de schema, `generate:types` forma parte del mismo paquete (`src/types/payload-types.ts`).
11. npm sigue siendo el gestor. No introducir pnpm.
12. No se toca nada bajo `src/app/(payload)/` una vez generado, salvo lo que el scaffold oficial de Payload 3 + Next 16 requiera en WP-01.

---

## Riesgos

| Riesgo | Señal temprana | Mitigación |
| --- | --- | --- |
| **Migración de 3 MDX** | Seed con body vacío o `<Note>` perdido | Script de seed: frontmatter → campos; markdown del body → Lexical (`convertMarkdownToLexical` o equivalente en `@payloadcms/richtext-lexical`); bloque `<Note>…</Note>` → `aside`; imágenes de `public/projects/<slug>/` → upload Cloudinary. Verificar los 3 slugs a mano. |
| **OG images** | OG de un proyecto nuevo 404 hasta el próximo build | Dejar de depender de SSG-only: OG lee Payload + `dynamicParams`. Misma paleta en `src/lib/og.tsx` (Satori no lee CSS). |
| **View transitions** | Morph roto si card y detalle no comparten `name` o el `src` de cover difiere | Conservar `name={\`project-cover-${slug}\`}`. Adapter expone una sola `coverUrl`. |
| **Fail-fast de assets** | Esperar que `next build` falle si falta un PNG | Sustituir por validación Payload (`cover` required). Actualizar README. El script `placeholders` se retira en WP-07. |
| **Hero/Nav/Contact client + CMS** | Importar `getPayload` en un `'use client'` y romper el build | Wrappers server → props. Criterio de aceptación explícito en WP-03. |
| **Move a `src/`** | Imports `@/` rotos, `content/` huérfano | WP-01 es solo el move + Payload boot; el sitio MDX debe seguir buildeando después de WP-01. |
| **Vercel + Mongo + env** | Deploy verde local, 500 en prod | `.env.example` + README de deploy; no documentar valores. |
| **Copy primera persona que queda** | "What I built" / "reach me" en producción estudio | Seed de settings en voz company; reescritura de los 3 bodies en el seed. |
| **`next-mdx-remote` residual** | Dep no usada, o body que sigue siendo MDX a medias | WP-04 deja de importarlo; WP-07 lo saca de `package.json`. |

---

## Paquetes de trabajo

Ejecutor por defecto: subagente `developer`. Ámbitos disjuntos; si dos WPs tocan el mismo archivo, están serializados.

**Paralelo posible:** WP-03 ∥ WP-04 ∥ WP-08 después de WP-02. WP-06 puede ir en paralelo con esos (solo hooks + `src/lib/cache.ts`). WP-05 después de WP-04. WP-07 el último.

---

### WP-01 · Scaffold Payload + `src/` + Users

**Depende de:** nada  
**Toca:** `package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json`, `.env.example`, `src/payload.config.ts`, `src/collections/Users.ts`, `src/app/(payload)/` (generado), move `app/` → `src/app/(frontend)/`, `components/` → `src/components/`, `lib/` → `src/lib/`, `content/` → `src/content/`, aliases, `src/lib/cn.ts` (opcional alineación: `clsx` + `tailwind-merge`; `pad` se queda en `src/lib/utils.ts`), `src/middleware.ts` solo si el template oficial de Payload 3 lo exige.  
**No toca:** `src/collections/Projects.ts`, globals, Cloudinary, copy de empresa, `content/projects/*.mdx` (solo se mueven), visual de componentes.

**Objetivo**  
La app vive bajo `src/`, `/admin` arranca con un user admin, y el storefront **sigue leyendo MDX** como hoy.

**Contrato**

- Alias `@/*` → `./src/*`; `@payload-config` → `./src/payload.config.ts`.
- `next.config.ts` usa `withPayload()`.
- `images.formats` actuales se conservan.
- Collection `users` con `role`: `admin` \| `editor`.
- Scripts: `dev`, `build`, `lint`, `typecheck`, `generate:types` (`payload generate:types`).
- `.env.example`: `DATABASE_URI`, `PAYLOAD_SECRET` (y más adelante Cloudinary en WP-02; si el plugin aún no está, no inventes keys).
- npm. Payload `3.83.x`. Next no se baja de 16.3.x.

**Criterio de aceptación**

- [ ] `npm run dev`: sitio público idéntico (MDX) en `/` y `/work/xtreamplayerpro`.
- [ ] `/admin` carga; se puede crear el primer usuario.
- [ ] `npm run typecheck` y `lint` limpios.
- [ ] No hay `app/` ni `components/` ni `lib/` ni `content/` en la raíz (salvo `public/`, `scripts/`, configs).

**Prompt para el subagente**

> Implementá el embed de Payload CMS 3.83.x en `C:\Users\Administrator\Videos\PROJECTS\PORTFOLIO\projectsportfolio` sin cambiar el diseño ni dejar de servir los MDX.
>
> Stack existente: Next 16.3.x App Router, React 19.2, TypeScript strict, Tailwind v4, npm (`package-lock.json`). No uses pnpm. No downgrades Next.
>
> 1. Mové el código a la estructura canónica: `src/app/(frontend)/` (todo lo que hoy está en `app/`), `src/components/`, `src/lib/`, `src/content/`. `public/` se queda en la raíz. Actualizá `tsconfig` paths: `@/*` → `./src/*`, `@payload-config` → `./src/payload.config.ts`.
> 2. Instalá `payload@3.83.x`, `@payloadcms/next`, `@payloadcms/db-mongodb`, `@payloadcms/richtext-lexical`, `@payloadcms/ui` y peers que el template oficial de Payload 3 + Next 16 requiera. `next.config.ts` debe exportar `withPayload()`.
> 3. Creá `src/payload.config.ts` con `mongooseAdapter` (`DATABASE_URI`), `secret` desde `PAYLOAD_SECRET`, editor Lexical con `FixedToolbarFeature` (aunque aún no haya richText de proyectos), y collection `users` en `src/collections/Users.ts`: auth email/password, campo `role` select `admin` | `editor` (default `editor`). `admin` access del panel: solo `role === 'admin'`. CRUD de users: solo admin.
> 4. Generá las rutas `(payload)` con el procedimiento oficial. **No edites a mano** el internals de `(payload)` más de lo que el scaffold pide.
> 5. Añadí script `generate:types` que escriba `src/types/payload-types.ts`. Ejecutalo.
> 6. `.env.example` con `DATABASE_URI` y `PAYLOAD_SECRET`, sin valores reales. Nunca escribas secretos en Markdown ni en el repo.
> 7. El storefront debe seguir usando `src/lib/projects.ts` (fs + gray-matter + Zod) y `src/content/site.ts`. No migres proyectos todavía.
> 8. Invariantes: no rediseñar; dark-only; no shadcn/Radix; no Route Handlers de negocio; no Square.
>
> Verificá: `npm run typecheck`, `npm run lint`, home y un `/work/<slug>` renderizan igual que antes.

---

### WP-02 · Schema: settings, media, projects, Cloudinary

**Depende de:** WP-01  
**Toca:** `src/payload.config.ts`, `src/collections/Media.ts`, `src/collections/Projects.ts`, `src/globals/Settings.ts`, `src/globals/AboutPage.ts`, `src/lib/unique-slug.ts`, `src/types/payload-types.ts` (regenerado), `next.config.ts` (`images.remotePatterns` Cloudinary), `.env.example` (keys Cloudinary), `package.json` (dep `payload-cloudinary` si no estaba).  
**No toca:** componentes de UI, `src/lib/projects.ts` (sigue MDX), `src/content/*`, páginas `(frontend)`.

**Objetivo**  
El admin puede crear un proyecto con cover, galería, Lexical, `status` y el global `settings`, aunque el sitio público aún no lo lea.

**Contrato**

- Global `settings`, global `about-page` y collections `media` / `projects` según la sección Modelo de datos (campos, access, slugs, `status` select — **no** drafts nativos).
- `projects.slug` `readOnly`; `beforeChange` con helper de unicidad en `src/lib/unique-slug.ts`.
- `afterRead` oculta `internalNotes` a no-staff.
- Labels admin en español.
- Cloudinary folder `portfolio`.
- `afterChange` de revalidación **aún no**: lo pone WP-06. No dejes un hook vacío que falle.

**Criterio de aceptación**

- [ ] En `/admin` (ES): editar Settings; crear un Project `draft` con cover Cloudinary y body Lexical.
- [ ] Tipo `Project`, `Setting`, `Media` exportados en `src/types/payload-types.ts`.
- [ ] `lint` y `tsc --noEmit` limpios.
- [ ] Access: anónimo no lee `draft` por Local API / REST.

**Prompt para el subagente**

> En `C:\Users\Administrator\Videos\PROJECTS\PORTFOLIO\projectsportfolio`, con Payload ya embebidado (WP-01), implementá el schema. No cambies el frontend público: sigue MDX.
>
> Creá:
> - `src/globals/Settings.ts` slug `settings`. Campos: `voice` (`company` | `person`, default `company`); `name`, `role`, `timeZone`, `location`, `email`, `url`; group `hero` con `headline` (array de text) e `intro`; group `contact` con `heading`, `body`; `socials` array `{label, href}`. **Sin group about** — ese copy va al global `about-page`. Access: `read` público, `update` solo `admin`.
> - `src/globals/AboutPage.ts` slug `about-page`. Campos: `heading` text required; `excerpt` array of textarea; `body` array of textarea; `facts` array `{label, value}`; `principles` array `{title, body}` opcional. Access: `read` público, `update` solo `admin`. Labels admin en español. No uses Lexical ni blocks.
> - `src/collections/Media.ts` + plugin `payload-cloudinary` folder `portfolio`. Access: `read` público; `create`/`update` admin+editor; `delete` admin. Env: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` en `.env.example` sin valores. `next.config.ts`: `images.remotePatterns` para `res.cloudinary.com`.
> - `src/collections/Projects.ts` slug `projects`. Campos exactamente: `title`, `description` (max 240), `year` (1990–2999), `stack` (array text min 1), `cover` (upload media required), `images` (array: upload, alt, caption), `liveUrl` y `repoUrl` opcionales URL, `featured` checkbox default false, `order` number default 100, `status` select `draft` | `published` default `draft` (**no uses drafts nativos de Payload**), `body` richText Lexical con `FixedToolbarFeature`, `aside` textarea opcional, `internalNotes` textarea opcional, `slug` text readOnly unique. `beforeChange`: generar slug único desde `title` (`src/lib/unique-slug.ts`). `afterRead`: si no hay user staff, no devolver `internalNotes`. Access: `read` público filtrado `status === 'published'` (staff lee todo); `create`/`update` admin+editor; `delete` solo admin. Labels del admin en español.
>
> Registrá todo en `src/payload.config.ts`. Corré `generate:types`.
>
> Invariantes: `afterChange` no lo implementes aún (WP-06). No toques `src/app/(payload)/` generado. No toques componentes ni `src/lib/projects.ts`. No pongas secretos en docs.
>
> Verificá typecheck/lint y que un proyecto `draft` no es listable sin login.

---

### WP-03 · Voz de estudio: el frontend lee `settings`

**Depende de:** WP-02  
**Toca:** `src/lib/site.ts` (nuevo, Local API + Zod), `src/app/(frontend)/layout.tsx`, `src/app/(frontend)/opengraph-image.tsx`, `src/app/(frontend)/robots.ts`, `src/components/hero.tsx`, `src/components/nav.tsx`, `src/components/about.tsx`, `src/components/contact.tsx`, `src/components/footer.tsx`, wrappers server nuevos junto a esos client components si hace falta.  
**No toca:** `src/lib/projects.ts`, `src/app/(frontend)/work/**`, `src/app/(frontend)/about/**` (WP-08), `src/components/selected-work.tsx`, `src/components/project-card.tsx`, collections, `src/content/projects/`.

**Objetivo**  
Identidad y copy salen de `settings`. Default visualmente **empresa** (JSON-LD `Organization`, label About → "Studio") sin rediseñar.

**Contrato**

- `getSettings()` cached, Zod en el límite, tipo `PublicSettings` sin campos internos.
- Hero/Nav/Contact (client) reciben **props**; jamás `getPayload`.
- Nav hrefs en código: Work `/#work`, About `/about`, Contact `/#contact`. Label del ítem About: "Studio" si `voice === 'company'`, "About" si `person`.
- `about.tsx` en la home es un **teaser**: `heading` + `excerpt` + `facts` desde `about-page`, más un enlace label "About the studio" → `/about`. No renderiza `body` ni `principles` (eso es WP-08).
- Metadata, canonical, JSON-LD, footer, OG de sitio: desde settings.
- `src/content/site.ts` deja de ser la fuente de verdad; borralo o reexportá deprecado. Preferí borrarlo y actualizar imports.
- Copy a mostrar si settings / about-page están vacíos: fallback mínimo para no crashear el primer request (name/url), no el dual person/company en código.

**Criterio de aceptación**

- [ ] Con `voice: company` en admin: JSON-LD `@type: Organization`, sin `jobTitle`; sección About usa `SectionLabel` "Studio"; hero/contact muestran el copy del global.
- [ ] Cambiar `name` o `email` en admin y revalidar (aunque WP-06 aún no exista: un refresh con `revalidate=300` o restart) actualiza nav y mailto. Documentá si hace falta restart hasta WP-06.
- [ ] Ningún `'use client'` importa Payload.
- [ ] Visual intacto (tokens, motion wipe del hero, copy-email).
- [ ] `lint` / `tsc --noEmit` limpios.

**Prompt para el subagente**

> En `C:\Users\Administrator\Videos\PROJECTS\PORTFOLIO\projectsportfolio`, conectá el storefront al global Payload `settings`. No toques proyectos/MDX ni el grid de work.
>
> Creá `src/lib/site.ts` (`server-only`): `getPayload({ config })` envuelto en `React.cache`, una instancia por request. Validá con Zod. Tipo público: name, role, timeZone, location, email, url, voice, hero.headline[], hero.intro, about.{heading, body[], facts[]}, contact.{heading, body}, socials[].
>
> `Hero`, `Nav` y `Contact` son client components (motion / clipboard). No llames Payload desde ellos. Introducí wrappers server o pasá props desde `layout.tsx` / `page.tsx`.
>
> Actualizá `src/app/(frontend)/layout.tsx`: `metadataBase`, title (si `voice === 'company'` el title default es `name`, si `person` es `name — role`, igual que hoy), description = hero.intro, JSON-LD Organization vs Person, `sameAs` = socials. `lang="en"`.
>
> `about.tsx` (home teaser): `SectionLabel` "Studio" si company, "About" si person. Leé `about-page` (heading, excerpt, facts). Enlace "About the studio" → `/about`. No renderices `body` ni `principles`. No crees `src/app/(frontend)/about/page.tsx` (WP-08).
>
> `contact.tsx` / `footer.tsx` / `opengraph-image.tsx` / `robots.ts`: url, email, socials, headline desde settings. Conservá el botón Copy email y el glow/wipe del hero.
>
> Hrefs del nav en código: `/#work`, `/about`, `/#contact`. Label About/Studio según `voice`. No crees `/work` índice (WP-05) ni la página `/about` completa (WP-08).
>
> Invariantes: Local API only; no `fetch('/api/...')`; no rediseño; dark-only; no secretos en el HTML.
>
> Seed manual: excerpt/facts pueden pegarse desde `about.company` histórico. Hero.intro y contact.body a "we"/"us". Si settings o about-page no existen, fallback seguro para no 500.
>
> Verificá typecheck/lint y que el HTML del home ya no dependa de `src/content/site.ts`.

---

### WP-04 · Storefront de proyectos desde Payload

**Depende de:** WP-02  
**Toca:** `src/lib/projects.ts` (reescritura), `src/lib/project-adapter.ts` si preferís partir Zod ahí, `src/app/(frontend)/work/[slug]/page.tsx`, `src/app/(frontend)/work/[slug]/opengraph-image.tsx`, `src/app/(frontend)/sitemap.ts`, `src/components/selected-work.tsx`, `src/components/rich-text.tsx` (nuevo renderer Lexical), `src/app/(frontend)/page.tsx` solo si añadís `export const revalidate = 300`.  
**No toca:** hero/nav/about/contact/footer/layout (WP-03), `Projects.ts` hooks de revalidate (WP-06), no borra MDX todavía (WP-07), no crea `/work/page.tsx` (WP-05). `project-card.tsx` solo si el tipo público cambia de forma incompatible — preferí mantener `{ slug, title, description, year, stack, cover, featured, images, liveUrl, repoUrl }`.

**Objetivo**  
Home y `/work/[slug]` leen proyectos `published` de Mongo. El body se renderiza con Lexical, no `MDXRemote`. Cover URL alimenta el ViewTransition.

**Contrato**

- `PublicProject`: `slug`, `title`, `description`, `year`, `stack: string[]`, `cover: string` (URL absoluta Cloudinary o path), `images: { src, alt?, caption? }[]`, `liveUrl?`, `repoUrl?`, `featured`, `order`, `aside?`, `body` (datos Lexical serializados).
- Zod en el adapter. `internalNotes` y `status` no están en el tipo público.
- `getAllProjects` / `getProject` / `getProjectNeighbours` mismas firmas de consumo; solo `published`; mismo sort: featured, order, year desc, title.
- Detalle: renderer Lexical que cubra h2/h3/p/a/ul/ol/code/pre/blockquote. `aside` → componente `Note` existente. Galería `images` igual que hoy. Si `draft` o slug desconocido: `notFound()`.
- `generateStaticParams` slugs published; `dynamicParams = true`.
- `export const revalidate = 300` en home, detalle, sitemap (contrato de caché; on-demand es WP-06).
- Empty state de Selected work: ya no diga "add an .mdx file".
- Dejá de importar `next-mdx-remote` / `gray-matter` desde el app code. No los borres de `package.json` (WP-07).

**Criterio de aceptación**

- [ ] Con al menos un `published` en Mongo, la home muestra su card; un `draft` no.
- [ ] `/work/<slug>` publicado renderiza title, stack, cover, body, screens, prev/next solo published.
- [ ] ViewTransition `project-cover-{slug}` sigue en card y detalle.
- [ ] OG de proyecto usa title/description/year/stack + `settings.name`.
- [ ] `lint` / `tsc --noEmit` limpios.

**Prompt para el subagente**

> En `C:\Users\Administrator\Videos\PROJECTS\PORTFOLIO\projectsportfolio`, reemplazá la lectura fs/MDX de proyectos por Payload Local API. No rediseñes. No implementes `/work` índice. No borres `src/content/projects/*.mdx` ni deps todavía.
>
> Reescribí `src/lib/projects.ts` (`server-only`): `getPayload({ config })` + `React.cache`. Query `projects` con `status: 'published'`, depth suficiente para `cover` e `images.image`. Sort: featured desc, order asc, year desc, title asc. Validá con Zod hacia `PublicProject`. `cover` / `images[].src` deben ser URLs usables por `next/image` (Cloudinary). Omití `internalNotes` y `status`.
>
> Conservá `getAllProjects`, `getProject(slug)`, `getProjectNeighbours(slug)` para no reescribir `project-card.tsx` más de lo necesario. El card espera `project.cover` como string src.
>
> `src/app/(frontend)/work/[slug]/page.tsx`: quitá `MDXRemote`. Renderá `body` Lexical en un componente server `src/components/rich-text.tsx` (estilos equivalentes a `src/components/mdx.tsx`: h2/h3/p/listas/links/code). Si `aside` tiene texto, renderá el `Note` existente. Galería, sidebar year/stack, Live site / Source, neighbours: igual. `notFound()` si no hay published. `generateStaticParams` published only; `dynamicParams = true`; `export const revalidate = 300`.
>
> `selected-work.tsx`: sigue llamando `getAllProjects()` (WP-05 filtrará featured). Cambiá el empty state para no mencionar MDX.
>
> `sitemap.ts` y `opengraph-image` del slug: Local API, no fs. `export const revalidate = 300` en `src/app/(frontend)/page.tsx` si no está.
>
> Invariantes: nunca `fetch('/api/...')` desde servidor; nunca getPayload en client; draft = invisible; no fail-build por archivos en `public/`; ViewTransition names intactos; dark editorial intacto.
>
> Verificá con un proyecto published de prueba en admin (aunque los MDX ya no se lean) y typecheck/lint.

---

### WP-05 · Índice `/work` y selected en home

**Depende de:** WP-04  
**Toca:** `src/app/(frontend)/work/page.tsx` (nuevo), `src/components/selected-work.tsx`, `src/app/(frontend)/sitemap.ts` (añadir `/work`).  
**No toca:** `nav.tsx` (Work sigue `/#work`), collections, settings, `project-card.tsx` salvo classNames ya existentes.

**Objetivo**  
Home editorial (featured o fallback 4) + archivo `/work` con todos los published, mismo card.

**Contrato**

- `getAllProjects()` sin cambio de sort.
- Home: `featured === true`; si el array queda vacío, `slice(0, 4)`.
- Featured sigue con `sm:col-span-2`.
- `/work`: todos, heading acorde (SectionLabel "Work" o "All work"), sin Hero.
- Si `getAllProjects().length >` los mostrados en home, Selected work incluye enlace label "All work" → `/work`.
- Back link del detalle puede seguir `/#work` (home) o ir a `/work`; preferí `/work` ahora que existe el archivo.
- Sitemap incluye `${url}/work`.
- `export const revalidate = 300` en `/work`.

**Criterio de aceptación**

- [ ] Con 1 featured y 2 no-featured: home muestra 1 (full width); `/work` muestra 3.
- [ ] Cero featured: home muestra hasta 4.
- [ ] Visual: mismos tokens, cards, labels mono.
- [ ] `lint` / `tsc --noEmit` limpios.

**Prompt para el subagente**

> En `C:\Users\Administrator\Videos\PROJECTS\PORTFOLIO\projectsportfolio`, añadí la página índice `/work` y filtrá la home. No cambies el sistema de diseño ni el nav (Work permanece `/#work`).
>
> `src/components/selected-work.tsx`: de `getAllProjects()`, mostrá los `featured`; si no hay ninguno, los primeros 4. Conservá el span `sm:col-span-2` para featured. Empty state si length 0. Si hay más published que los listados en home, un enlace `className="label"` "All work" a `/work`.
>
> Creá `src/app/(frontend)/work/page.tsx`: lista completa published, mismo grid y `ProjectCard`, `SectionLabel` tipo "01 / Work" o "All work", `export const revalidate = 300`, metadata title "Work". Sin rediseño (no filtros, no tags UI).
>
> En `src/app/(frontend)/work/[slug]/page.tsx` el "Back to work" debe ir a `/work`.
>
> `sitemap.ts`: entradas `${settings.url}/work` y `${settings.url}/about`.
>
> Invariantes: solo `published`; Local API vía `getAllProjects`; no toques Payload schema; no toques hero/about/contact.
>
> Verificá typecheck/lint y los dos casos (con y sin featured).

---

### WP-06 · Revalidación on-demand

**Depende de:** WP-02 (schema). Puede paralelizarse con WP-03/04/05; las rutas que revalida deben existir o ser no-ops inofensivas.  
**Toca:** `src/lib/cache.ts` (nuevo), `src/collections/Projects.ts` (`afterChange` / `afterDelete`), `src/globals/Settings.ts` (`afterChange`).  
**No toca:** páginas `(frontend)` (ya tienen `revalidate = 300` desde WP-04/05), UI, `package.json`.

**Objetivo**  
Publicar u ocultar un caso (o editar settings) invalida tags/paths sin bloquear el save.

**Contrato**

- `src/lib/cache.ts`: `revalidateStudio(opts?: { slug?: string })` llama `revalidateTag('projects')`, `revalidateTag('settings')`, `revalidateTag('about')`, `revalidatePath('/')`, `revalidatePath('/about')`, `revalidatePath('/work')`, `revalidatePath('/sitemap.xml')`, y si hay slug `revalidateTag('project:'+slug)`, `revalidatePath('/work/'+slug)`. Todo en try/catch con `console.error`.
- Projects `afterChange` y `afterDelete`: esa función. Settings `afterChange`: settings + `/`. `about-page` `afterChange`: `revalidateStudio()` (cubre `/` y `/about`).
- Las páginas deben usar `unstable_cache` o `fetch` tags **solo si** hace falta para que `revalidateTag` funcione. Si el data layer usa `React.cache` + ISR de ruta, `revalidatePath` es el mecanismo principal: **implementá `revalidatePath` siempre**; tags si enlazás `unstable_cache` en `getAllProjects`/`getSettings` (preferible: `unstable_cache` con tags `projects` / `settings` / `project:${slug}` alrededor de las queries Payload).
- El save en admin debe responder OK aunque Next no esté en un contexto que soporte `revalidatePath` (dev vs prod): catch.

**Criterio de aceptación**

- [ ] Pasar un proyecto de `draft` a `published` en admin → aparece en `/` y `/work/<slug>` sin esperar 300s (prod o `next start`).
- [ ] Volver a `draft` → 404 / desaparece de la home.
- [ ] Un throw simulado dentro del hook no impide persistir el documento.
- [ ] `lint` / `tsc --noEmit` limpios.

**Prompt para el subagente**

> En `C:\Users\Administrator\Videos\PROJECTS\PORTFOLIO\projectsportfolio`, implementá la revalidación on-demand. No cambies UI ni schema de campos.
>
> Creá `src/lib/cache.ts` con `revalidateStudio({ slug?: string })` que envuelva en try/catch: `revalidatePath('/')`, `revalidatePath('/about')`, `revalidatePath('/work')`, `revalidatePath('/sitemap.xml')`, `revalidateTag('projects')`, `revalidateTag('settings')`, `revalidateTag('about')`, y si hay slug `revalidatePath('/work/'+slug)` y `revalidateTag('project:'+slug)`. Logueá errores; no relances.
>
> En `src/collections/Projects.ts` `afterChange` y `afterDelete` llamá `revalidateStudio({ slug })`. En `src/globals/Settings.ts` y `src/globals/AboutPage.ts` `afterChange` llamá `revalidateStudio()`.
>
> En `src/lib/projects.ts` y `src/lib/site.ts`, envolvê las queries Payload en `unstable_cache` (o el helper de cache de Next 16 equivalente) con los tags de arriba y `revalidate: 300`, para que tag + path coincidan con ISR.
>
> Invariantes: el hook NUNCA bloquea ni revierte el save; no hay Square; no hay fetch a REST de Payload desde el frontend; `generate:types` si tocaste hooks que cambien tipos (no deberían).
>
> Verificá: typecheck/lint; documentá en un comentario breve en `cache.ts` que en `next dev` la revalidación puede ser más laxa que en `next start`.

---

### WP-07 · Seed de settings / about-page y retiro de la vía MDX

Los tres casos semilla (XtreamPlayerPro, Balloons Decorale, Budget-Travellers) **ya se borraron** — MDX, PNG y `generate-placeholders.mjs`. No se migran. Los proyectos reales se cargan a mano en `/admin` cuando exista Mongo. Este paquete solo siembra identidad/about y saca gray-matter / next-mdx-remote.

**Depende de:** WP-02, WP-03, WP-04, WP-05, WP-06  
**Toca:** `src/scripts/seed.ts` (o `scripts/seed.mjs`), `package.json` (script `seed` y **quitar** `next-mdx-remote`, `gray-matter`, `@types/mdx` si quedan huérfanos; quitar script `placeholders`), borrar `src/content/projects/*.mdx`, borrar `src/content/` si vacío, borrar `scripts/generate-placeholders.mjs`, opcional borrar `public/projects/**` tras upload, `README.md`.  
**No toca:** tokens CSS, motion, collections (salvo correcciones de seed data), `(payload)`.

**Objetivo**  
Los tres casos semilla viven en Mongo como `published`, en voz de estudio, con las 9 imágenes en Cloudinary. El repo ya no enseña a editar MDX.

**Contrato**

- **No hay seed de projects.** El inventario empieza vacío; el dueño carga casos reales en admin.
- Settings seed: `voice: company`; hero.intro y contact.body en "we/us" (equivalentes editoriales, no un rebrand).
- `about-page` seed: `heading` = "About the studio"; `excerpt` + `facts` = `about.company` histórico; `body` = 2–3 párrafos extra de estudio **sin inventar métricas ni clientes**; `principles` = 3 ítems cortos derivados del copy company ya existente.
- README: cómo entrar a `/admin`, env vars (nombres only), edición en admin, sin MDX ni `placeholders`.
- Idempotencia del seed de settings / about-page: upsert, no duplicar.

**Criterio de aceptación**

- [ ] `npm run seed` (con env local) crea/actualiza 3 published + settings.
- [ ] Home y los 3 detalles renderizan; imágenes no 404.
- [ ] `grep` de `content/projects` y `gray-matter` en src de app: vacío.
- [ ] `npm run build` no lee `.mdx`.
- [ ] README ya no dice "no environment variables" ni el flujo MDX como vía de edición.

**Prompt para el subagente**

> En `C:\Users\Administrator\Videos\PROJECTS\PORTFOLIO\projectsportfolio`, migrá el contenido MDX a Payload y retirà la vía git/MDX. No rediseñes.
>
> No migres ni recrees XtreamPlayerPro / Balloons Decorale / Budget-Travellers: esos archivos ya no existen. No inventes proyectos.
>
> Escribí `src/scripts/seed.ts` invocable con `npx tsx` o el runner que ya exista: getPayload, upsert `settings` (`voice: 'company'`, hero.intro y contact.body en primera persona del plural sin cambiar el sentido — **sin group about**), upsert `about-page` (`heading: 'About the studio'`, excerpt + facts = `about.company` histórico, body y principles según el contrato de WP-07, sin métricas inventadas). No crees documents en `projects`.
>
> Añadí `"seed": "..."` en `package.json`.
>
> Después del seed verificado: si quedan, borrá `src/content/projects/`, `scripts/generate-placeholders.mjs`, y dependencias `next-mdx-remote`, `gray-matter`, `@types/mdx` si nadie las importa. Actualizá `README.md`: stack (Payload, Mongo, Cloudinary), env names, flujo "edit in /admin", voz estudio, ISR. Nada de secretos. Corregí la frase de que Vercel no necesita env vars.
>
> Invariantes: slugs estables; draft no se usa en estos tres (van published); no toques `src/app/(payload)/`; npm; `generate:types` no debería hacer falta.
>
> Verificá `npm run build`, los 3 URLs, `/about`, OG, y que un `draft` de prueba no aparece.

---

### WP-08 · Página dedicada `/about`

**Depende de:** WP-02, WP-03 (nav ya apunta a `/about`; el teaser de home ya existe)  
**Toca:** `src/app/(frontend)/about/page.tsx`, `src/lib/site.ts` (export `getAboutPage()` si WP-03 no lo dejó), `src/app/(frontend)/sitemap.ts` si WP-05 aún no añadió `/about`.  
**No toca:** `nav.tsx` (ya va a `/about`), `about.tsx` de la home (teaser), projects, settings schema, `(payload)`.

**Objetivo**  
`/about` es la página del estudio: mismo registro visual (labels mono, title, hairlines, facts), más espacio para el relato y `principles`.

**Contrato**

- `export const revalidate = 300`.
- Metadata: title "Studio" si `voice === 'company'`, else "About"; description = primer párrafo de `excerpt`; canonical `/about`; OG type website.
- Layout (sin rediseñar, mismo grid que el about de home ampliado):
  1. `SectionLabel` Studio/About
  2. `heading` como `text-title`
  3. `excerpt` como lead (`text-muted`, max-w-prose)
  4. `facts` en dl a la derecha en `md:` (mismo patrón que `about.tsx` hoy)
  5. `body` debajo, párrafos
  6. Si `principles.length > 0`: `SectionLabel` "How we work" + lista `title` / `body` en grid simple (no cards con sombra)
  7. CTA al final: enlace label al mailto de `settings.email` o a `/#contact` — "Start a conversation"
- Local API + Zod. Fallback si el global está vacío: heading + excerpt mínimos, no 500.
- `lang="en"`. No hay formulario.

**Criterio de aceptación**

- [ ] `/about` renderiza heading, excerpt, body, facts; principles solo si hay ítems.
- [ ] Nav Studio/About abre `/about`, no se queda en `/#about`.
- [ ] Home teaser no duplica `body` ni principles.
- [ ] Sitemap incluye `/about`.
- [ ] Visual: tokens, dark-only, sin sombras nuevas, sin shadcn.
- [ ] `lint` / `tsc --noEmit` limpios.

**Prompt para el subagente**

> En `C:\Users\Administrator\Videos\PROJECTS\PORTFOLIO\projectsportfolio`, creá la página dedicada del estudio en `/about`. No rediseñes. No toques proyectos ni el schema.
>
> `src/app/(frontend)/about/page.tsx`: Server Component. Leé `about-page` y `settings` vía `getAboutPage()` / `getSettings()` en `src/lib/site.ts` (`server-only`, `React.cache`, Zod). `export const revalidate = 300`. Metadata: title "Studio" si voice company, "About" si person; description = excerpt[0]; canonical `/about`.
>
> Composición, de arriba abajo, reutilizando `SectionLabel`, `Reveal` y las mismas clases que `src/components/about.tsx`:
> 1. SectionLabel Studio/About según voice
> 2. heading `text-title`
> 3. excerpt (lead)
> 4. facts dl (grid 12 cols, facts a la derecha en md, igual que la home)
> 5. body párrafos
> 6. principles: si hay, SectionLabel "How we work" + cada ítem title + body en un grid simple, sin sombras ni cards elevadas
> 7. CTA: link label a `/#contact` o `mailto:` de settings — "Start a conversation"
>
> Si about-page está vacío, fallback de heading/excerpt para no 500.
>
> Confirmá que `sitemap.ts` incluye `/about`. El teaser de home (`about.tsx`) no debe mostrar body ni principles.
>
> Invariantes: Local API only; no getPayload en client; dark editorial; no shadcn; no formulario; no i18n.
>
> Verificá typecheck/lint y que `/about` y `/` no se pisan el copy largo.

---

## Orden de ejecución

```
WP-01  foundation (bloquea todo)
  └─ WP-02  schema + Cloudinary + about-page
        ├─ WP-03  voz / nav → /about / teaser home   } paralelo
        ├─ WP-04  proyectos públicos                 }
        ├─ WP-08  página /about                      }
        └─ WP-06  revalidate hooks                   } paralelo con 03/04/08
              └─ WP-05  /work índice                   (después de WP-04)
                    └─ WP-07  seed + retiro MDX         (después de 03–06 y 08)
```

WP-03, WP-04 y WP-08 no comparten archivos de página. WP-06 no toca UI. WP-05 espera el adapter de WP-04. WP-07 es el único que borra contenido git y deps MDX.

---

## La única pregunta cuya respuesta más cambiaría el plan

**¿El cuerpo del caso de estudio debe ser Lexical libre (como el MDX actual: headings + listas + una nota al margen) o una plantilla fija de campos (`context`, `built[]`, `aside`, `details`) sin rich text largo?**

El plan asume Lexical + `aside`, porque conserva los tres semilla y el registro editorial. Si el dueño no quiere un editor rico y prefiere rellenar cajas, WP-02/04/07 cambian de contrato (no hay `body` Lexical ni `rich-text.tsx`; el detalle se vuelve layout fijo) y la migración deja de convertir markdown.
