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

Registro visual **claro editorial**, no dark-only. Lienzo crema (`--bg: #faf8f5`), texto Shadow Grey (`--ink: #2c2c34`), serif Playfair en titulares (`serif-display`), Geist Sans en cuerpo y labels, Geist Mono disponible. El acento de acción es Blue Violet (`--brand: #8236d3`). El footer es una lámina oscura fija (`--color-dark`, el mismo ink); el contenido vive en `.site-shell` (fondo crema, esquinas inferiores redondas) que se desliza por encima. `color-scheme: light`. No hay toggle de tema en el shell vivo.

Home (`src/app/(frontend)/[locale]/page.tsx`), de arriba abajo:

1. `HomeHero` — server: titular, intro, pastilla de disponibilidad y CTAs. `HeroScene` (client) es la mesa de trabajo.
2. `HomeServicesPreview` — bento (1 card grande + 3 pequeñas) hacia `/services#<slug>`.
3. `HomeFeaturedWork` — hasta 3 proyectos publicados (`getAllProjects()`). Con 0 no se pinta.
4. `ProcessSection` — scrollytelling oscuro anclado en `#process`.
5. `HomeCustomBuilt` — plantilla frente a medida.
6. `HomeYouEdit` — panel de edición en CSS; enlace a `/services#development`.
7. `HomeMotto` — lema (`about-page.motto`, o `messages` si está vacío) e ilustración.
8. `CtaBand` — banda clara hacia `/start`.

`HomeStats` no se monta. `settings.stats` sigue en el CMS y en el fallback de `getSettings`.

Nav fija (`SiteNav`): Trabajo → `/work`, Servicios → `/services`, Proceso → `/#process`, Nosotros → `/about`, CTA “Empezar un proyecto” → `/start`. El CTA de la nav aparece cuando el CTA del hero (`data-nav-cta`) sale de vista, y no se muestra en `/start`. Al llegar al footer la nav se oculta. La píldora es crema translúcida (`bg-bg/80`), con blur y borde `lilac/30`.

| Ruta | Qué es |
| --- | --- |
| `/` | Home. Español no lleva prefijo. |
| `/en`, `/fr` | Las mismas páginas en inglés y francés. |
| `/work` | Archivo de proyectos `published`. |
| `/work/[slug]` | Caso de estudio. |
| `/services` | Listado de servicios. |
| `/about` | Página del estudio (hero, fundador, misión, valores). Las cifras (`about-page.numbers`) no se pintan hasta que haya datos verificables. |
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
- **`media`** — uploads en Cloudinary vía `payload-cloudinary` (carpeta `wc-digital`). Acepta imágenes, mp4/webm/quicktime y JSON de Lottie. `alt` opcional. Lectura pública. `mediaUrl()` en `src/lib/media.ts` prefiere `cloudinary.secure_url` y solo cae a `/api/media/file/<filename>` si el documento no tiene URL de Cloudinary. `next.config.ts` permite `res.cloudinary.com` en `next/image`.
- **`projects`** — casos. `status`: `draft` (default) | `published`. El anónimo solo lee `published`. `slug` único, read-only, generado en `beforeChange` desde el título (`src/lib/unique-slug.ts`). `internalNotes` se borra en `afterRead` si el usuario no es staff. Campos de ficha: title, description (≤240), year, stack, cover (required), gallery, live/repo URL, featured, order, categories, client, industry, platform, services, mockups desktop/mobile, challenge, solution, deliverables, keyPages, testimonial, body Lexical, aside. Varios están localizados.
- **`leads`** — briefs del formulario. `create` público; lectura/edición staff; borrado solo admin. `status`: `new` | `read`.
- **`pages`** — solo privacy, terms, cookies. `slug` es un select fijo. Body Lexical localizado. Solo admin escribe.

### Globals (grupo Sitio, salvo settings)

- **`settings`** — voz `company` | `person`, nombre, tagline, stats de la home, email de notificación de leads, rol, timezone, ubicación, email público, URL canónica sin barra final, hero (legado; la home viva lee `home-page`), contacto, redes. Update solo admin.
- **`home-page`** — eyebrow, titular (líneas + palabra en itálica), intro, pastilla opcional (`showAvailability` + `availabilityLabel` localizado), notas flotantes (siguen en el schema; la home no las pinta), teasers de servicios y trabajo. El titular de trabajo de la home sale de `workTeaser` (se edita en el admin).
- **`services-page`** — titular + array `items` (slug, title, subtitle, body, bullets, `illustration` como clave de `ServiceIllustration`: `web-design`, `development`, `ecommerce`, `digital-presence`, order).
- **`process-page`** — titular de la sección y de 3 a 7 pasos. Cada paso: number, title, body (≤220), `mediaType` `image` | `video` | `lottie`, upload `media`, icono de reserva, CTA opcional. El orden del array es el orden en pantalla.
- **`about-page`** — eyebrow, `motto` localizado (visible en la home; si está vacío se usa `home.motto` de `messages`), hero, founder, mission, values, numbers (no se renderizan hasta tener datos verificables), imagen de cifras.

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
- Contenedor `max-w-6xl`, igual que el resto del sitio. En desktop las columnas son 5/7 (`PROCESS_LAYOUT.columnSplit: "wide-media"` en `src/components/process/constants.ts`). Cada panel es `aspect-[4/3]` con tope `max-h-[60vh]`.
- La barra de progreso es Teal → Violet (`--process-progress` en `globals.css`). `constants.ts` solo la referencia.
- Los PNG de los pasos viven en el CMS y conservan el color anterior. No se recolorean desde código.
- Detalle de edición: `src/components/process/README.md`.

## Diseño y motion

El acento de acción es Violet. El negro del texto es Shadow Grey (`ink`), no un segundo acento. La barra del proceso (Teal → Violet) es la única barra de color fuerte; el resto del color vive en botones, links, foco y detalles.

### Paleta y tokens

Hex canónicos solo en `:root` de `src/app/(frontend)/globals.css`. Las imágenes OG repiten esos valores en `src/lib/og-palette.ts` (Satori no resuelve variables CSS). Los SVG de proceso y las banderas (`public/brand/flags/`) llevan su propio hex. `--mask-solid: #000` es una máscara, no un color de marca.

| Token | Valor | Rol |
| --- | --- | --- |
| `ink` / `dark` | `#2c2c34` | Texto principal y láminas (proceso, footer) |
| `brand` | `#8236d3` | Acción: CTAs, links, foco, la palabra "crecer." |
| `brand-hover` | `brand` al 86 % + `ink` | Hover del botón sólido |
| `brand-soft` | `brand` al 10 % + crema | Tintes, selección, cierre de ficha |
| `teal` | `#51a3a3` | Acento frío: iconos, checks, estado ok |
| `teal-soft` | `teal` al 14 % + crema | Chips |
| `apricot` | `#f9c784` | Acento cálido: notas, email del footer, botón sobre oscuro |
| `apricot-soft` | `apricot` al 22 % + crema | Badges |
| `lilac` | `#978897` | Bordes y divisores (~30–50 %). Nunca texto pequeño sobre crema |
| `muted` | `ink` al 65 % + crema, en oklab | Texto secundario |
| `surface` | `#ffffff` | Cards |
| `dark-raised` | `dark` al 88 % + blanco | Wordmark y paneles del proceso |
| `error` | `#c62828` al 88 % + `ink` | Errores del formulario |

Las mezclas usan `color-mix(in oklab, …)`. Los alias viejos (`--fg`, `--muted`, `--faint`, `--line`, `--footer-bg`, `--footer-fg`, `--color-accent`) apuntan a estos tokens.

Reparto **60 / 25 / 10 / 5**: ~60 % crema y neutros, ~25 % Shadow Grey, ~10 % Violet (solo acción), ~5 % Teal y Apricot. **Máximo dos acentos por vista**; Teal y Apricot no compiten en el mismo bloque. Teal y Lilac no sirven como texto pequeño sobre crema (quedan por debajo de 4.5:1): van en rellenos, bordes e iconos, con texto `ink` encima cuando hay que leer. El color va en la luz (auroras al 10–18 %, resplandor de la banda), no en bloques de sección. Una sola palabra con degradado en todo el sitio: "crecer." del hero (`text-gradient-brand`, color de reserva `--color-brand`). En los demás titulares la itálica es Violet sólido. Grano estático ≤ 4 % (`grain-overlay`).

Utilidades: `label`, `serif-display`, `btn-primary` (Violet, texto blanco), `btn-outline`, `btn-on-dark` (Apricot + `ink`), `.site-shell`, `.nav-link` (activo y hover en Violet, con indicador), `.rich-text` (links Violet, `blockquote` con borde Teal, `mark` en `apricot-soft`), `card-layered`, `aurora-bg`, `hero-aurora-bg`, `text-gradient-brand`, `cta-glow`. `::selection` usa `brand-soft` / `ink`. `:focus-visible` es un anillo `brand` con offset.

### Hero

`HomeHero` es un server component. El titular y la intro salen en el HTML, sin opacidad inicial: el titular es el LCP. El bloque de CTAs lleva `data-nav-cta` para el observer de la nav. `HeroScene` es client, `aria-hidden`, sin datos de Payload y sin imágenes: tres ventanas en JSX (landing al centro, inventario a la izquierda, tienda o menú a la derecha), tarjetas "Paleta" y "Tipografía", y una nota adhesiva Apricot. Por debajo de 768 px se ve una ventana y otra asomando, como mucho dos tarjetas, sin flotación. El escenario crece con las ventanas (no las recorta) y, debajo, una franja deja que la aurora se apague sobre el crema antes de la sección siguiente.

La animación usa solo `transform` y `opacity`: entrada en cascada, bucles de ~7 s pausados fuera del viewport, tilt con puntero solo en `(hover: hover) and (pointer: fine)`, y un parallax leve al salir. Con `prefers-reduced-motion: reduce` la composición queda completa y quieta (nota, tarjetas y subrayado visibles; sin pulso, tilt ni parallax).

La pastilla "Aceptando nuevos proyectos" solo se pinta si `home-page.showAvailability` está activo. El texto es `availabilityLabel` o, si viene vacío, `home.hero.availabilityDefault`.

### Mapa de CTAs

Botón sólido (`.btn-primary`) en la nav, el hero y la banda de cierre. Continuar y enviar en `/start` también son `.btn-primary`: es el envío del brief, no un CTA de navegación. Todo lo demás son enlaces de texto. Flecha `→` (`ArrowRight`) en navegación interna; `↗` (`ArrowUpRight`) solo en enlaces externos.

- **Banda** (`CtaBand`): clara, borde `lilac/30`, resplandor Violet/Teal (`cta-glow`). El botón dice "Hablemos de tu proyecto" (`cta.talk`), distinto del de la nav y el hero.
- **Footer:** sin botón. El bloque es "¿Prefieres escribirnos?" más un `mailto:` con `settings.email`. El layout lo pasa como prop `publicEmail`; no existe un campo `publicEmail`. Links en lila claro (`footer-link`), hover Apricot. El email va en Apricot. Las redes, si el CMS trae alguna, son enlaces pequeños en la fila inferior, con `↗`. Abajo, el wordmark "WC Digital" en Playfair, color `dark-raised`, `aria-hidden`. El alto sale del padding (no de un `min-height`) y no puede pasar de `100svh`; por debajo de 700 px de alto el wordmark se oculta. `FooterReveal` no cambia: mide el footer y escribe `--footer-height`, que es el `margin-bottom` del shell.
- **`/services`:** cada servicio enlaza con texto "Empezar con {servicio} →" y conserva `?service=`.
- **Ficha** (`/work/[slug]`): el cierre es una banda `brand-soft` con el enlace de texto "Cuéntanos tu proyecto →". No usa `CtaBand`.
- **`/start`:** la nav no muestra su CTA (escritorio ni menú). El footer no tiene botón que repetir.

### ShareButton

`src/components/share-button.tsx` es client y no tiene dependencias. Props: `url` (absoluta, armada en servidor con `canonicalLocalizedUrl`: origen de `settings.url` + `localizedPath`; el componente no lee `window.location`), `title`, `text`, `kind` (`"project"` | `"site"`) y `appearance` (`"button"` | `"link"`, por defecto botón outline).

En táctil (`(hover: none) and (pointer: coarse)`) llama a `navigator.share` con url, title y text. En escritorio abre un popover con "Copiar enlace" y "Enviar por email". Esc y un clic fuera lo cierran. Una región `aria-live="polite"` anuncia "Enlace copiado". Si no hay `clipboard`, selecciona la URL canónica. El foco vuelve al botón al cerrar con Esc.

Ubicaciones: la ficha ("Compartir proyecto", junto a "Visitar sitio"), el éxito de `/start` (comparte la home, no `/start`) y la fila inferior del footer ("Compartir este sitio", `appearance="link"`).

### Excepciones aprobadas

Quedaron cerradas en `docs/plans/cambio-de-tema/plan-de-implementacion.md` (sección 2). No las reabras.

1. Pastilla de disponibilidad: opcional y editable (`showAvailability` + `availabilityLabel`).
2. Lema: campo `motto` localizado en `about-page`, con fallback a `messages`.
3. Flechas: `→` interno, `↗` solo externo.
4. Cierre de la ficha: banda `brand-soft` con enlace de texto, no el botón de la banda general.
5. **"Visitar sitio"** en la ficha es botón sólido Violet. Es la acción principal de esa página y abre un sitio externo.
6. Redes del footer en la fila inferior, como enlaces pequeños.
7. "Compartir este sitio" va en el footer.
8. La home siempre usa `CollaborationIllustration`. La foto del fundador solo se pinta en `/about`.
9. Las cifras de `/about` permanecen ocultas mientras no haya datos verificables. El campo del CMS no se borra.
10. El titular de trabajo reciente se edita en `home-page.workTeaser`. El fallback de código solo entra si el campo está vacío.
11. El proceso quedó en columnas 5/7 (también se probó 50/50).
12. El footer lleva el wordmark gigante en `dark-raised`.

El hero de `/about` sigue siendo un `.btn-primary` hacia `/start`, con `→`. El botón sólido de marketing, fuera de ese caso, queda en la nav, el hero y la banda.

Motion degrada con `prefers-reduced-motion` (CSS global + `MotionProvider`). No hay smooth-scroll ni scroll hijacking fuera del scrollytelling del proceso, que es scroll nativo con paneles sticky.

Componentes de shell vivos: `site-nav`, `site-footer`, `footer-reveal`, `language-modal`, `locale-control`, `share-button`, `collaboration-illustration`, `service-illustration`, `home/*` (incluye `hero-scene`, `home-custom-built`, `home-you-edit`, `edit-panel-mockup`, `home-motto`), `work/work-showcase`, `device-mockup`, `cta-band`, `start-project-form`, `rich-text`, `process/*`.

Quedan piezas del portfolio oscuro anterior (`nav.tsx`, `hero.tsx`, `footer.tsx`, `contact.tsx`, `theme-toggle.tsx`, `mdx.tsx`) que el App Router actual no monta. No las revivas ni las uses como referencia visual. `home-stats.tsx` tampoco se monta.

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

`.env` local (no se commitea): `DATABASE_URI`, `PAYLOAD_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`. Las mismas tres de Cloudinary tienen que estar en Vercel. No escribas secretos en Markdown ni en el repo.

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
