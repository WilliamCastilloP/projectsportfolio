# WC Digital — contexto del proyecto

Sitio público del estudio **WC Digital** (`https://wcdigital.studio`): un estudio que diseña y entrega sitios y plataformas web a medida. El visitante ve trabajo, servicios, proceso y el estudio, y puede dejar un brief en “Empezar un proyecto”. El equipo edita el contenido en Payload (`/admin`) sin tocar código.

Este archivo es la fuente de verdad para un agente. `README.md` y `docs/plans/studio-cms.md` describen una etapa anterior (portfolio personal oscuro, casos en MDX, un solo idioma, sin formulario). No los uses como contrato del código actual.

## Stack

- Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 (tokens en `@theme`, sin `tailwind.config`)
- Payload CMS 3.83 embebido en la misma app · MongoDB (`mongooseAdapter`) · editor Lexical con `FixedToolbarFeature`
- `next-intl` para la cromática de la UI · localización de Payload para el contenido
- `motion` para animación · `zod` en el límite del formulario de leads
- npm (`package-lock.json`). No introducir pnpm. No bajar Next de 16.3.x.
- Alias: `@/*` → `./src/*`, `@payload-config` → `./src/payload.config.ts`
- `next.config.ts` envuelve con `withNextIntl(withPayload(...))`

## Qué ve el visitante

Registro visual **claro editorial**, no dark-only. Lienzo crema (`--bg: #faf8f5`), texto casi negro, serif Playfair en titulares (`serif-display`), Geist Sans en cuerpo y labels, Geist Mono disponible. El footer es una lámina negra fija; el contenido vive en `.site-shell` (fondo claro, esquinas inferiores redondas) que se desliza por encima. `color-scheme: light`. No hay toggle de tema en el shell vivo.

Home (`src/app/(frontend)/[locale]/page.tsx`), de arriba abajo:

1. `HomeHero` — titular, intro, notas flotantes, CTAs
2. `HomeStats` — cifras de `settings.stats`
3. `HomeServicesPreview` — teaser + ítems de servicios
4. `HomeFeaturedWork` — un caso destacado
5. `ProcessSection` — scrollytelling anclado en `#process`
6. `CtaBand` — llamada a `/start`

Nav fija (`SiteNav`): Trabajo → `/work`, Servicios → `/services`, Proceso → `/#process`, Nosotros → `/about`, CTA “Empezar un proyecto” → `/start`. El CTA de la nav aparece cuando el CTA del hero sale de vista. Al llegar al footer la nav se oculta.

| Ruta | Qué es |
| --- | --- |
| `/` | Home. Español no lleva prefijo. |
| `/en`, `/fr` | Las mismas páginas en inglés y francés. |
| `/work` | Archivo de proyectos `published`. |
| `/work/[slug]` | Caso de estudio. |
| `/services` | Listado de servicios. |
| `/about` | Página del estudio (hero, fundador, misión, valores, cifras). |
| `/process` | Solo redirige a `/#process` (o `/en#process`, `/fr#process`). El proceso no es una página larga propia. |
| `/start` | Formulario de brief. POST a `/api/leads`. |
| `/privacy`, `/terms`, `/cookies` | Legales desde la collection `pages`. |
| `/admin` | Payload. No es storefront. |
| `/sitemap.xml`, `/robots.txt`, `opengraph-image` | SEO. OG por caso en `/work/[slug]/opengraph-image`. |

El layout raíz del frontend exporta `dynamic = "force-dynamic"`. El storefront lee Mongo en cada request (con `React.cache` por request). No asumas ISR de 300s: el plan viejo lo pedía; el layout actual no lo usa. El global `process-page` sí llama `revalidatePath` en `afterChange`, pero con `force-dynamic` el efecto es limitado.

## Idiomas

Tres locales: `es` (default), `en`, `fr`.

- **URL:** `localePrefix: "as-needed"`. `/work` es español; `/en/work` y `/fr/work` son los otros. `localeDetection: false` — no se redirige por `Accept-Language`.
- **Primera visita:** `LanguageModal` si no existen las cookies `wc-locale` ni `wc-locale-modal-dismissed`.
- **Cromática de UI** (nav, footer, botones, formulario, a11y, títulos de página que no vienen del CMS): `messages/es.json`, `messages/en.json`, `messages/fr.json`. En componentes: `useTranslations` / `getTranslations`. Links de locale: `Link`, `usePathname`, `useRouter` de `@/i18n/navigation`, nunca `next/link` ni `next/navigation` para rutas públicas (el middleware de `next-intl` vive en `src/middleware.ts` y excluye `admin`, `api`, `_next`, `files` y assets).
- **Contenido editorial:** campos `localized: true` en Payload. Al leer, pasar `locale` y `fallbackLocale: "es"`.
- Admin de Payload: `supportedLanguages` es, en, fr; `fallbackLanguage: "es"`. Los labels de collections están en español. El contenido público se edita en los tres locales.

Helpers de URL: `src/i18n/path.ts` (`localizedPath`, `languageAlternates`).

## CMS

Config: `src/payload.config.ts`. Secret: `PAYLOAD_SECRET`. DB: `DATABASE_URI`, con fallback a `MONGODB_URI`.

### Collections

- **`users`** — auth email/password. `role`: `admin` | `editor` (default `editor`). CRUD de usuarios solo `admin`. El panel lo abren admin y editor.
- **`media`** — upload local de Payload (imágenes, mp4/webm/quicktime, JSON de Lottie). `alt` opcional. Lectura pública. **Cloudinary no está conectado**: `.env.example` lista las keys, el plugin no está en la config. `next.config.ts` ya permite `res.cloudinary.com` por si se enchufa después. Las URLs públicas salen de `mediaUrl()` en `src/lib/media.ts`: `url` del doc, o `/api/media/file/<filename>`.
- **`projects`** — casos. `status`: `draft` (default) | `published`. El anónimo solo lee `published`. `slug` único, read-only, generado en `beforeChange` desde el título (`src/lib/unique-slug.ts`). `internalNotes` se borra en `afterRead` si el usuario no es staff. Campos de ficha: title, description (≤240), year, stack, cover (required), gallery, live/repo URL, featured, order, categories, client, industry, platform, services, mockups desktop/mobile, challenge, solution, deliverables, keyPages, testimonial, body Lexical, aside. Varios están localizados.
- **`leads`** — briefs del formulario. `create` público; lectura/edición staff; borrado solo admin. `status`: `new` | `read`.
- **`pages`** — solo privacy, terms, cookies. `slug` es un select fijo. Body Lexical localizado. Solo admin escribe.

### Globals (grupo Sitio, salvo settings)

- **`settings`** — voz `company` | `person`, nombre, tagline, stats de la home, email de notificación de leads, rol, timezone, ubicación, email público, URL canónica sin barra final, hero (legado; la home viva lee `home-page`), contacto, redes. Update solo admin.
- **`home-page`** — eyebrow, titular (líneas + palabra en itálica), intro, notas flotantes, teasers de servicios y trabajo.
- **`services-page`** — titular + array `items` (slug, title, subtitle, body, bullets, `illustration` como clave de archivo, order).
- **`process-page`** — titular de la sección y de 3 a 7 pasos. Cada paso: number, title, body (≤220), `mediaType` `image` | `video` | `lottie`, upload `media`, icono de reserva, CTA opcional. El orden del array es el orden en pantalla.
- **`about-page`** — eyebrow, hero, founder, mission, values, numbers, imagen de cifras.

Tras cambiar el schema: `npm run generate:types` y commitear `src/types/payload-types.ts`.

## Cómo leer datos

Server-only, Local API, una instancia vía `getPayloadClient()` (`src/lib/payload.ts`). Envolver lecturas en `cache()` de React. **No** hacer `fetch('/api/...')` desde Server Components. **No** importar Payload ni `getPayload` en un archivo `'use client'`.

| Módulo | Funciones | Si Mongo falla |
| --- | --- | --- |
| `src/lib/site.ts` | `getSettings()` | Copia de respaldo (nombre WC Digital, URL, stats) |
| `src/lib/cms.ts` | `getHomeContent`, `getServicesContent`, `getProcessContent`, `getAboutContent`, `getLegalPage` | Home: fallback es/en/fr en el propio archivo. El resto: estructuras vacías. |
| `src/lib/projects.ts` | `getAllProjects`, `getProject`, `getFeaturedProject` | `[]` / `null` |

Sort público de proyectos: `featured` primero, luego `order` ascendente, `year` descendente, título. Un `draft` no entra en home, `/work`, ficha, sitemap ni OG. Sin `cover` resoluble, `toPublic` descarta el doc.

`src/content/site.ts` ya no es la fuente de verdad. Solo alimenta el fallback de `getSettings` y tipos viejos. El copy que el visitante ve sale de Payload o de `messages/*.json`.

El formulario (`src/components/start-project-form.tsx`) postea JSON a `src/app/api/leads/route.ts`, que valida con Zod y hace `payload.create` en `leads` con `overrideAccess: true`. No hay email transaccional implementado; `settings.leadNotificationEmail` es un campo, no un envío.

## Proceso (scrollytelling)

Código en `src/components/process/`. `ProcessSection` (server) lee `getProcessContent()` y, si hay pasos, renderiza `ProcessScrollytelling` (client).

- Sin media en un paso, el frente usa `/public/process/step-1.svg` … `step-5.svg`.
- `mediaType: "lottie"` existe en el modelo. El reproductor no está instalado: ese paso muestra un recuadro de reserva.
- Constantes de layout y de la barra de progreso (rosa → azul): `src/components/process/constants.ts`.
- Detalle de edición: `src/components/process/README.md`.

## Diseño y motion

Tokens y utilities en `src/app/(frontend)/globals.css`: `label`, `serif-display`, `btn-primary`, `btn-outline`, `.site-shell`, `.nav-link`, `.rich-text`. Acento de marca en UI es el negro del texto, no un naranja. La única barra de color fuerte es el progreso del proceso.

Motion degrada con `prefers-reduced-motion` (CSS global + `MotionProvider`). No hay smooth-scroll ni scroll hijacking fuera del scrollytelling del proceso, que es scroll nativo con paneles sticky.

Componentes de shell vivos: `site-nav`, `site-footer`, `footer-reveal`, `language-modal`, `home/*`, `work/work-showcase`, `device-mockup`, `cta-band`, `start-project-form`, `rich-text`, `process/*`.

Quedan piezas del portfolio oscuro anterior (`nav.tsx`, `hero.tsx`, `footer.tsx`, `contact.tsx`, `theme-toggle.tsx`, `mdx.tsx`) que el App Router actual no monta. No las revivas ni las uses como referencia visual.

## Estructura

```
src/app/(frontend)/          storefront, rutas bajo [locale]
src/app/(payload)/           admin y REST/GraphQL de Payload — no editar a mano
src/app/api/leads/route.ts   único route handler de negocio
src/collections/             Users, Media, Projects, Leads, Pages
src/globals/                 Settings, Home, Services, Process, About
src/components/              UI
src/lib/                     cms, site, projects, payload, media, unique-slug
src/i18n/                    routing, request, navigation, path
src/content/site.ts          fallback de identidad, no CMS
messages/                    es.json, en.json, fr.json
public/                      brand, process SVGs, ilustraciones, media estática
scripts/                     capturas, seed, QA visual
```

No hay `app/`, `components/` ni `lib/` en la raíz.

## Scripts y entorno

```bash
npm run dev              # http://localhost:3000
npm run build
npm run lint
npm run typecheck
npm run generate:types   # payload generate:types
npm run seed             # tsx src/scripts/seed.ts
npm run capture          # capturas de sitios (playwright)
npm run capture:mobile   # sync de mockups mobile
npm run qa:visual        # diff visual en scripts/qa-validator
```

`.env` local (no se commitea): `DATABASE_URI`, `PAYLOAD_SECRET`. Cloudinary es opcional y hoy no hace nada. No escribas secretos en Markdown ni en el repo.

## Invariantes para el siguiente agente

1. Español primero. Cualquier string visible va en los tres locales: campo localizado de Payload **o** clave en `messages/es.json`, `en.json` y `fr.json`. No dejes copy de UI hardcodeado en un componente.
2. Un proyecto `draft` es invisible en todo lo público. Publicar es cambiar `status`, no hacer commit.
3. `getPayload` solo en servidor. Los client components reciben props.
4. Hooks de Payload (`afterChange`, etc.) no deben tumbar el save: try/catch.
5. `internalNotes` no sale al HTML ni al tipo público `Project`.
6. No inventes métricas, clientes ni testimonios. Si el CMS está vacío, el fallback existente o un empty state.
7. No rediseñes a oscuro, no metas shadcn/Radix, no añadas page builder de blocks, no cambies el gestor de paquetes.
8. No edites `src/app/(payload)/` salvo que el scaffold oficial de Payload lo exija.
9. `npm run typecheck` después de tocar tipos o schema. Si el schema cambió, `generate:types` en el mismo cambio.
10. Links internos del storefront pasan por `@/i18n/navigation` para conservar el prefijo de locale.
11. Verifica UI en el navegador (desktop y, si el layout cambió, mobile) antes de dar una pantalla por terminada. El dev server suele estar ya en `npm run dev`.
