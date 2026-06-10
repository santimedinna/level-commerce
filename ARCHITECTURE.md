# Level Commerce — Documento de Arquitectura

> Boilerplate de ecommerce optimizado para conversión.
> Base reutilizable de Level Growth Agency para tiendas online en Argentina.
> Este documento es el contexto maestro del proyecto. Leerlo completo antes de escribir código.

---

## 1. Objetivo del proyecto

Construir **una tienda online terminada, con una base neutra y sin marca asignada todavía** — una sola tienda concreta y funcional, no una plataforma. La base es neutra (un lienzo premium), pero cada implementación sobre ella es única y a medida de la marca. Incorpora técnicas de conversión validadas (las que vienen puliendo Tienda Nube, Shopify, Mercado Libre).

### Qué es realmente esto: una demo de captación de Level Growth

**Esta web NO es una tienda de ropa y NO vende ropa.** Es una **demo declarada** que usa Level Growth Agency como herramienta de captación de clientes. La marca de ropa "Level Commerce" es ficticia: ni la ropa, ni el stock, ni las reseñas, ni los pedidos son reales. Todo es contenido de ejemplo con fines de demostración.

El verdadero objetivo: mostrarle a un futuro cliente de Level Growth (dueño de un negocio: ropa, marroquinería, ferretería, lo que sea) **cómo se ve y funciona una tienda que convierte**, para venderle el desarrollo de su web. La demo vende **desarrollos web**, no productos.

**Doble capa (clave de todo el copy y el contenido):**
- **Capa de superficie:** una tienda de ropa creíble e impecable, que le habla al comprador de ropa. Tiene que ser un ejemplo perfecto de cómo se le habla y se le vende a un cliente final.
- **Capa de fondo:** todo eso es, en realidad, un instructivo visual para el cliente de Level Growth — le muestra la forma correcta de venderle a SU cliente. La demo enseña vendiendo.
- El contacto real del sitio es el de **Level Growth Agency** (no hay tienda de ropa que contactar). Cualquiera que contacta, contacta a Level Growth para comprar una web.

**Disclaimer:** el sitio declara que es una demo (pop-up al entrar + sección en legales). Honestidad total: nadie cree que la tienda es real. Las "reseñas" y "números" son placeholders guía (estructura que enseña dónde y cómo van las pruebas sociales), nunca datos falsos presentados como reales.

### Posicionamiento de venta (mensaje)

El diferenciador de Level Growth NO es "el próximo estándar" ni "mejor que las grandes marcas" (no es real y no se vende así). El ángulo real y honesto es **el cruce que casi nadie ofrece junto**: una tienda **a medida de la marca** (no una plantilla disfrazada) **+ velocidad de élite** (sello de Level Growth) **+ entregada rápido** (porque la base ya está construida). Wix/Tienda Nube dan facilidad pero son lentos y genéricos; un desarrollo tradicional es único pero caro, lento y mal optimizado. Level Growth no obliga a elegir. La demo **demuestra** esto siendo rápida y pulida, no proclamándolo.

Nota de vocabulario: la base es **neutra / premium**, nunca "genérica". Evitar la palabra "genérico" en código, copy y comunicación: arrastra connotación de barato.

**QUÉ ES (alcance técnico):**
- Una **tienda terminada** que funciona de punta a punta: catálogo, carrito, checkout, pago.
- **Neutra y premium**, sin marca asignada, para trasladarla a la marca de cada cliente.
- El traslado lo hace **la agencia (un desarrollador), fuera del producto**, editando contenido y tokens (ver sección 3.bis: capa contenido/estructura). NO es tarea del usuario final.

**QUÉ NO ES:**
- **NO es una plataforma tipo Tienda Nube / Shopify / Wix.** No existe "usuario que arma su tienda" dentro del producto.
- **NO tiene modo personalización, editor visual, onboarding de marca, ni botón "Personalizar".** De Tienda Nube/Shopify se copian las TÉCNICAS DE CONVERSIÓN del lado del comprador, no su modelo de "constructor de tiendas".

**Principios rectores, en este orden de prioridad:**

1. Cero fricción.
2. Máxima velocidad (PageSpeed alto, sello de Level Growth).
3. Máxima experiencia de usuario.
4. Máximas conversiones posibles.

**Mobile-first no negociable:** ~80% de las compras online en Argentina son desde el celular. Todo se diseña primero para pantalla chica.

---

## 2. Stack tecnológico definitivo

| Capa | Tecnología | Razón |
|------|-----------|-------|
| Framework | Next.js (App Router) + TypeScript | Stack de Level Growth; SEO, rendimiento, serverless nativo |
| Estilos | Tailwind CSS | Velocidad de desarrollo, consistencia |
| Animación | Framer Motion | Micro-interacciones de calidad, sin exagerar |
| Base de datos + Auth | Supabase (PostgreSQL) | SQL relacional profesional, serverless, free tier, Row Level Security, auth incluida |
| Pagos | MercadoPago (Checkout Bricks) | Estándar argentino; embebido; nunca tocamos datos de tarjeta (sin carga PCI) |
| Emails transaccionales | Resend | Serverless, free tier, integra nativo con Next.js, sin VPS |
| Hosting / Deploy | Vercel | Serverless, deploy automático, CDN, sin administrar servidores |

**Regla de infraestructura:** todo serverless. **Sin VPS.** Funciones serverless en Vercel para webhooks de pago, envío de emails, y cron de carritos abandonados.

**Regla de seguridad de pagos:** los datos de tarjeta NUNCA pasan por nuestro servidor ni se almacenan. MercadoPago Bricks maneja el formulario de tarjeta; recibimos un token. Esto nos mantiene fuera del alcance de la normativa PCI-DSS.

---

## 3. Modelo de datos (Supabase / PostgreSQL)

El punto crítico del modelo es el **stock por variante**: en ropa el stock no es por producto sino por combinación talle + color. Se modela con una tabla `product_variants` separada.

### Tablas

**`categories`**
- `id` (uuid, pk)
- `name` (text)
- `slug` (text, unique)
- `created_at` (timestamptz)

**`products`**
- `id` (uuid, pk)
- `name` (text)
- `slug` (text, unique)
- `description` (text)
- `category_id` (uuid, fk → categories.id)
- `base_price` (numeric) — precio base; las variantes pueden sobrescribir si hiciera falta
- `images` (jsonb) — array de URLs
- `is_active` (boolean, default true)
- `created_at` (timestamptz)

**`product_variants`** ← stock vive ACÁ
- `id` (uuid, pk)
- `product_id` (uuid, fk → products.id)
- `size` (text) — ej. "S", "M", "L", "38", "40"
- `color` (text)
- `sku` (text, unique)
- `stock` (integer, default 0) — stock de ESTA combinación puntual
- `price_override` (numeric, nullable) — si esta variante tiene precio distinto
- `created_at` (timestamptz)

**`related_products`** ← cross-selling manual (curado a mano, NO algorítmico)
- `product_id` (uuid, fk → products.id)
- `related_product_id` (uuid, fk → products.id)
- pk compuesta (product_id, related_product_id)

**`orders`**
- `id` (uuid, pk)
- `customer_email` (text)
- `customer_name` (text)
- `customer_phone` (text, nullable)
- `shipping_method` (text) — ej. "flex_centro", "retiro_local", "domicilio_nacional"
- `shipping_address` (jsonb, nullable)
- `shipping_cost` (numeric)
- `subtotal` (numeric)
- `total` (numeric)
- `status` (text) — "pending", "paid", "cancelled", "fulfilled"
- `mp_payment_id` (text, nullable) — id de pago de MercadoPago
- `user_id` (uuid, fk → auth.users, nullable) — null si compró como invitado
- `created_at` (timestamptz)

**`order_items`**
- `id` (uuid, pk)
- `order_id` (uuid, fk → orders.id)
- `variant_id` (uuid, fk → product_variants.id)
- `quantity` (integer)
- `unit_price` (numeric) — precio congelado al momento de la compra
- `product_name` (text) — snapshot por si el producto cambia/se borra después

**`abandoned_carts`** ← motor de recuperación
- `id` (uuid, pk)
- `contact_email` (text, nullable)
- `contact_phone` (text, nullable)
- `cart_data` (jsonb) — contenido del carrito
- `recovery_stage` (integer, default 0) — 0=ninguno, 1=primer email, 2=segundo, 3=tercero
- `recovered` (boolean, default false)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**`favorites`** ← wishlist
- `id` (uuid, pk)
- `user_id` (uuid, fk → auth.users) — o identificador anónimo si no hay login
- `product_id` (uuid, fk → products.id)
- `created_at` (timestamptz)

**`shipping_zones`** ← motor de envíos configurable (ampliada)
- `id` (uuid, pk)
- `name` (text) — ej. "Envío a domicilio (Córdoba Capital)", "Retiro en local", "Envío a domicilio (otra provincia)"
- `zone_type` (text) — 'local' (Córdoba Capital), 'nacional' (otra provincia), 'pickup' (retiro en local). CHECK restringe a esos tres.
- `flat_rate` (numeric) — tarifa plana de la zona
- `free_shipping_threshold` (numeric, nullable) — monto desde el cual el envío es gratis en esa zona; NULL = nunca gratis
- `requires_address` (boolean, default true) — false para retiro en local
- `weight_based` (boolean, default false) — contemplado para futuro (tarifa por peso), no se usa aún
- `estimated_days` (text) — ej. "En el día (durante el horario comercial)", "24 a 48hs hábiles"
- `sort_order` (integer, default 0) — orden de visualización
- `is_active` (boolean, default true)

Datos actuales (demo): Córdoba Capital (local, $5.500, gratis desde $45.000, "En el día (durante el horario comercial)"); Retiro en local (pickup, $0, sin dirección, solo visible en Córdoba); Otra provincia (nacional, $17.500, gratis desde $90.000, "24 a 48hs hábiles").

**`coupons`** ← cupones de captación / recuperación
- `id` (uuid, pk)
- `code` (text, unique)
- `discount_type` (text) — "percentage" o "fixed"
- `discount_value` (numeric)
- `single_use` (boolean, default true)
- `used` (boolean, default false)
- `expires_at` (timestamptz, nullable)

### Row Level Security (clave de seguridad sin ser experto)

- `products`, `product_variants`, `categories`, `shipping_zones`: lectura pública (GRANT SELECT a anon/authenticated + política RLS), escritura solo service role.
- `orders`, `order_items`: un usuario solo ve sus propias órdenes; invitados vía token de orden (a resolver en fase de pago).
- `favorites`: un usuario solo ve sus propios favoritos.
- `abandoned_carts`, `coupons`: sin políticas → solo accesibles desde funciones serverless con service role.

Nota: RLS filtra filas, pero el rol anon necesita además el GRANT SELECT base sobre las tablas de catálogo, o las consultas fallan con "permission denied".

---

## 3.bis Capa de contenido / estructura (clave del boilerplate)

Para que pasar de demo a marca real sea limpio Y para optimizar velocidad/métricas una sola vez sobre la estructura real, **el contenido vive separado de la estructura**:

- **Estructura de componentes = la de una tienda real.** No hay estructura "especial de demo". La demo es la tienda real con contenido de ejemplo.
- **Contenido en capa separada** (`src/content/`): `config.ts` (flag DEMO_MODE, locale/moneda), `brand.ts` (nombre, tagline, contacto, etc.), `nav.ts`, `footer.ts`, y los que se sumen. Los componentes leen el contenido de acá, sin texto hardcodeado.
- **Convención de demo:** cada valor reemplazable se marca con `// [DEMO]` en línea. Para listar todo: `grep -r "\[DEMO\]" src/content/`.
- **Flag `DEMO_MODE`** (`NEXT_PUBLIC_DEMO_MODE`): controla lo que SOLO existe en demo (pop-up de disclaimer, placeholders de pruebas sociales). Apagado → no se renderiza.
- **Distinguir marca ficticia vs Level Growth:** "Level Commerce" y datos de la tienda son `[DEMO]` (se reemplazan por la marca del cliente). El contacto real y el crédito "Desarrollado por Level Growth Agency" son de Level Growth (en la demo, contacto real; en una tienda de cliente, pasa a ser el del cliente).

**Proceso de conversión a marca real:** editar `brand.ts` (reemplazar `[DEMO]`), ajustar `nav.ts`/`footer.ts`, cambiar tokens en `globals.css`, subir logo, `NEXT_PUBLIC_DEMO_MODE=false`, cargar catálogo real en Supabase.

---

## 3.ter Lógica de envíos (detallada)

- **Detección de zona por IP** (headers de geolocalización de Vercel, gratis, sin permisos) como SUGERENCIA inicial editable. Sin detección (local/dev) → default 'local' (Córdoba, mercado principal).
- **Control editable visible** en carrito y checkout: selector "Córdoba Capital / Otra provincia" (NO pide código postal). El usuario corrige si la detección falló.
- **Opciones filtradas por zona:** Córdoba ve domicilio local + retiro en local; otra provincia ve solo envío nacional (el retiro en local solo aplica a Córdoba).
- **Barra de envío gratis** en el carrito, con umbral según zona detectada y texto aclaratorio que indica zona + monto (ej. "Envío gratis en Córdoba Capital desde $45.000") — nunca prometer gratis incondicional.
- **Dirección:** Córdoba pide calle/número/barrio + referencias para el cadete (CP opcional); otra provincia pide dirección completa con provincia y CP requerido; retiro en local no pide dirección.
- **Teléfono** con selector de código de país (banderita), Argentina +54 por defecto; lista de Latinoamérica + España.
- **Tarifa plana como aproximación** (campo `weight_based` para futuro ajuste por peso, sin usar).
- **Stock fantasma:** el stock se descuenta al confirmar el pago (webhook). Para reducir oversell, validar stock al CREAR el pago; el empate exacto rarísimo se maneja a mano (reembolso MP). No reservar stock en checkout (sobredimensionado para ropa).

---

## 4. Estructura de carpetas

```
level-commerce/
├── ARCHITECTURE.md              ← este documento
├── src/
│   ├── app/
│   │   ├── (storefront)/        ← tienda pública
│   │   │   ├── page.tsx         ← home
│   │   │   ├── productos/
│   │   │   │   ├── page.tsx     ← listado + filtros
│   │   │   │   └── [slug]/page.tsx  ← detalle de producto
│   │   │   ├── carrito/page.tsx
│   │   │   ├── checkout/page.tsx
│   │   │   ├── favoritos/page.tsx
│   │   │   └── legales/         ← términos, privacidad, cambios
│   │   ├── api/                 ← funciones serverless
│   │   │   ├── checkout/        ← crear preferencia MP
│   │   │   ├── webhook/mp/      ← confirma pago, descuenta stock
│   │   │   ├── emails/          ← envío vía Resend
│   │   │   └── cron/abandoned/  ← detecta carritos abandonados
│   │   └── layout.tsx
│   ├── components/
│   │   ├── cart/                ← drawer, item, resumen
│   │   ├── product/             ← card, galería, selector variante
│   │   ├── checkout/            ← formulario, resumen, selector envío
│   │   ├── conversion/          ← popup salida, barra envío gratis, captura
│   │   └── ui/                  ← botones, inputs, primitivas
│   ├── lib/
│   │   ├── supabase/            ← cliente y queries
│   │   ├── mercadopago/         ← integración pagos
│   │   ├── email/               ← templates y envío
│   │   └── shipping/            ← motor de zonas
│   ├── store/                   ← estado del carrito (cliente)
│   └── types/                   ← tipos TypeScript del modelo
├── public/
└── ...config
```

---

## 5. Funcionalidades del boilerplate base

### Núcleo de venta
- Catálogo con variantes (talle/color) y stock por variante
- Listado de productos con búsqueda y filtros (talle, color, categoría, precio) — instantáneos, sin recarga, mobile-first
- Detalle de producto con selector de variante y stock en tiempo real
- Drawer de carrito lateral (no página aparte) con subtotal en vivo
- Favoritos / wishlist
- Checkout de una pantalla, invitado por defecto
- MercadoPago Bricks embebido
- Cuentas opcionales (registro post-compra → segunda compra de un clic)

### Motor de conversión
- Barra de envío gratis progresivo ("Te faltan $X para envío gratis")
- Transparencia de costos de envío temprana (antes del checkout)
- Pop-up de salida HONESTO (descuento real permanente o "guardá tu carrito"), cupón auto-aplicado, una vez por sesión, disparador adaptado a mobile. SIN cuenta regresiva falsa.
- Captura de contacto (email/WhatsApp) a cambio de cupón de primera compra
- Cross-selling manual curado
- Señales de confianza (medios de pago, HTTPS, política de cambios visible)
- Micro-interacciones con Framer Motion

### Motor de envíos
- Detección de zona por IP (Vercel) + control editable Córdoba/Otra provincia (ver sección 3.ter)
- Tarifa plana por zona con umbral de envío gratis diferenciado por zona
- Retiro en local (gratis, solo Córdoba) mostrado como opción de envío
- Domicilio nacional a otra provincia vía Correo Argentino (tarifa de emprendedor; integración de API de correo por cliente a futuro)

### Pruebas sociales (distribución por momento de duda, basada en estudios)
- Ubicación > cantidad: cada señal donde resuelve la duda específica, sin sobrecargar.
- Home: barra de beneficios bajo el hero (envío, cambios, compra segura, medios de pago) + testimonios destacados (placeholders guía que enseñan especificidad).
- Producto: reseñas/ratings atados al producto puntual (placeholder marcado).
- Checkout/CTA: señales de seguridad (compra protegida, medios de pago).
- En demo: placeholders guía (estrellas + texto instructivo, "+XX envíos"), nunca datos falsos como reales.

### Recuperación
- Carrito persistido con contacto en `abandoned_carts`
- Secuencia de 3 emails (30-60min / 12-24h / 48-72h), incentivo solo en el último, vía Resend serverless (dominio de Level Growth ya disponible)
- **Doble lectura de los emails:** en superficie recuperan el "producto de ropa"; el subtexto le habla al cliente de Level Growth ("tu máquina de ventas te está esperando"). Quien pone su mail en la demo recibe una secuencia que es, en sí misma, la demostración de por qué contratar a Level Growth.
- Clic-to-WhatsApp prellenado para coordinación manual (gratis, sin API)

### Medición y SEO
- Google Analytics + Meta Pixel + Microsoft Clarity desde día uno
- SEO técnico: metadatos, Open Graph (links lindos al compartir por WhatsApp), sitemap, datos estructurados de producto
- Optimización PageSpeed

### Legales (plantillas editables)
- Términos y condiciones
- Política de privacidad
- Política de cambios: "Cambio con ticket y bolsa dentro de los 10 días posteriores a la compra"

---

## 6. Fases futuras (NO en el boilerplate base)

Contempladas en el modelo de datos pero no construidas hasta que un cliente lo justifique:

- **WhatsApp API oficial** (disparo automático de alertas/ofertas): requiere API de WhatsApp Business de Meta (plantillas pre-aprobadas, opt-in, costo por conversación). Upsell de fase 2.
- **Recomendaciones algorítmicas** ("quien vio esto también vio"): necesitan catálogo amplio + datos de comportamiento. Sin sentido con <20 productos.
- **Facturación Arca (ex AFIP)**: integración aparte, por cliente.
- **Integración de API de correos** (Andreani, OCA, Correo Argentino PAQ.AR): por cliente según su contrato logístico.

---

## 7. Plan de construcción por fases

**Fase 0 — Preparación:** este documento + cuentas Supabase y Vercel.

**Fase 1 — Esqueleto:** init Next.js + TS + Tailwind + estructura de carpetas. Conectar repo a Vercel (deploy automático desde día uno).

**Fase 2 — Capa de datos:** crear tablas en Supabase, RLS, productos de prueba, conectar Next.js a Supabase.

**Fase 3 — Storefront:** listado → detalle de producto (selector de variante + stock) → búsqueda y filtros → favoritos.

**Fase 4 — Carrito:** drawer lateral, agregar/quitar, cantidades, subtotal en vivo, persistencia.

**Fase 5 — Checkout y pago (HITO):** checkout una pantalla, invitado por defecto, motor de envíos por zonas, MercadoPago Bricks, webhook que confirma pago y descuenta stock. Al terminar: se puede comprar de verdad.

**Fase 6 — Conversión:** barra envío gratis, pop-up salida honesto, captura con cupón auto-aplicado, secuencia emails carrito abandonado, cross-selling manual.

**Fase 7 — Medición y pulido:** GA + Meta Pixel + Clarity, SEO técnico + OG + sitemap, legales, testeo mobile, PageSpeed.

**Fase 8 — Documentación del boilerplate:** guía de personalización por cliente (colores, tipografías, productos, zonas de envío) para convertir el trabajo en activo reutilizable.

---

## 8. Notas de implementación para Claude Code

- Cada fase se apoya en la anterior; respetar el orden.
- El estado del carrito vive en el cliente (store) pero se persiste en Supabase para recuperación.
- Precios e items se "congelan" en la orden al momento de compra (snapshots) por si el producto cambia después.
- El stock se descuenta en el webhook de pago confirmado, NO al agregar al carrito (evita bloquear stock de compras no concretadas).
- Todo texto de cara al usuario en **español argentino con calidez cordobesa** (ver CLAUDE.md, sección Idioma y tono), con doble lectura cuando aplique. Dirigido a quien compra, no a desarrolladores.
- Sin localStorage/sessionStorage si el código corriera en artefactos; en producción Next.js es libre el uso de almacenamiento del navegador para el carrito.