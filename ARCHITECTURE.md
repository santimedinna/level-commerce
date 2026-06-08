# Level Commerce — Documento de Arquitectura

> Boilerplate de ecommerce optimizado para conversión.
> Base reutilizable de Level Growth Agency para tiendas online en Argentina.
> Este documento es el contexto maestro del proyecto. Leerlo completo antes de escribir código.

---

## 1. Objetivo del proyecto

Construir **una tienda online terminada, con una base neutra y sin marca asignada todavía** — una sola tienda concreta y funcional, no una plataforma. La base es neutra (un lienzo premium), pero cada implementación sobre ella es única y a medida de la marca. Incorpora técnicas de conversión validadas (las que vienen puliendo Tienda Nube, Shopify, Mercado Libre) y sirve como **boceto/demo vendible**: una tienda real que se puede mostrar a un negocio para decir "tu marca puede tener esto".

Nota de vocabulario: la base es **neutra / premium**, nunca "genérica". Una tienda hecha con este sistema no es de molde — es cuidada y se viste con la identidad única de cada marca. Evitar la palabra "genérico" en código, copy y comunicación: arrastra connotación de barato, lo contrario de lo que se construye y se vende.

**QUÉ ES (leer con atención para no malinterpretar el alcance):**
- Es **una tienda terminada** que funciona de punta a punta: catálogo, carrito, checkout, pago.
- Es **neutra y premium**, sin marca asignada todavía, para después trasladarla a la marca de cada cliente. (Base neutra, nunca "genérica".)
- El traslado a cada marca lo hace **la agencia (un desarrollador), fuera del producto**, editando código y tokens. NO es una tarea del usuario final.

**QUÉ NO ES (importante):**
- **NO es una plataforma tipo Tienda Nube / Shopify / Wix.** No existe ningún "usuario que arma o personaliza su tienda" dentro del producto.
- **NO tiene "modo personalización", ni editor visual, ni onboarding de marca, ni botón "Personalizar".** Nada de eso. De Tienda Nube/Shopify se copian las TÉCNICAS DE CONVERSIÓN del lado del comprador, no su modelo de "constructor de tiendas".
- La única persona que toca colores, fuentes y marca es el desarrollador de la agencia, editando el código. El sitio en sí solo le sirve a UNA persona: **quien compra.**

**En una frase:** estamos haciendo la tienda de un negocio (con base neutra por ahora), no la herramienta con la que un negocio se hace su tienda.

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

**`shipping_zones`** ← motor de envíos configurable
- `id` (uuid, pk)
- `name` (text) — ej. "Córdoba Centro", "Córdoba Anillo Medio", "Periferia"
- `flat_rate` (numeric) — tarifa plana de la zona
- `estimated_days` (text) — ej. "24-48hs"
- `is_active` (boolean, default true)

**`coupons`** ← cupones de captación / recuperación
- `id` (uuid, pk)
- `code` (text, unique)
- `discount_type` (text) — "percentage" o "fixed"
- `discount_value` (numeric)
- `single_use` (boolean, default true)
- `used` (boolean, default false)
- `expires_at` (timestamptz, nullable)

### Row Level Security (clave de seguridad sin ser experto)

- `products`, `product_variants`, `categories`, `shipping_zones`: lectura pública, escritura solo admin.
- `orders`, `order_items`: un usuario solo ve sus propias órdenes; invitados vía token de orden.
- `favorites`: un usuario solo ve sus propios favoritos.
- `abandoned_carts`, `coupons`: solo accesibles desde funciones serverless con service role.

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
- Capa configurable por zonas con tarifa plana (resuelve el problema del costo variable de Uber/mensajería en Córdoba)
- Retiro en local (gratis) mostrado como una opción de envío más
- Domicilio nacional (preparado, integración de correo por cliente)

### Recuperación
- Carrito persistido con contacto en `abandoned_carts`
- Secuencia de 3 emails (30-60min / 12-24h / 48-72h), incentivo solo en el último, vía Resend serverless
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
- Todo texto de cara al usuario en español rioplatense, dirigido a quien compra, no a desarrolladores.
- Sin localStorage/sessionStorage si el código corriera en artefactos; en producción Next.js es libre el uso de almacenamiento del navegador para el carrito.