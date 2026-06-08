# CLAUDE.md — Reglas de trabajo · Level Commerce

> Reglas de cómo trabajar en este proyecto. El QUÉ construir está en `ARCHITECTURE.md` — leelo antes de empezar cualquier tarea.
> Este archivo define el CÓMO: convenciones, comportamiento esperado y sistema de diseño base.

---

## Comportamiento esperado

- **Leé `ARCHITECTURE.md` primero.** Es el plano maestro. No improvises fuera de lo que define.
- **Esto es UNA tienda terminada, NO una plataforma.** No es Tienda Nube / Shopify / Wix. No existe "usuario que personaliza su tienda" dentro del producto. No construyas modo personalización, editor de marca, onboarding, ni botones tipo "Personalizar". La marca la aplica el desarrollador de la agencia editando código/tokens, fuera del producto. El sitio le sirve a una sola persona: quien compra. (Ver sección 1 de ARCHITECTURE.md.)
- **Respetá el orden de fases.** Cada fase se apoya en la anterior. No adelantes trabajo de fases posteriores salvo que se pida.
- **No inventes.** Si falta un dato o una decisión, preguntá antes de asumir. No inventes métricas, precios, ni APIs.
- **Alcance acotado por tarea.** Hacé lo que se pide en cada prompt, bien y completo, sin agregar features no solicitadas.
- **Avisá los desvíos.** Si algo del plano no se puede hacer como está escrito, explicá por qué y proponé alternativa antes de cambiarlo.

## Convenciones de código

- **Next.js App Router + TypeScript.** Tipado estricto; tipos del modelo en `src/types/`.
- **Componentes chicos y reutilizables.** Una responsabilidad por componente.
- **Tailwind para estilos.** Sin CSS suelto salvo casos justificados. Tokens de diseño vía variables CSS (ver abajo).
- **Server Components por defecto;** Client Components solo cuando hay interactividad real.
- **Nombres claros en inglés para el código** (variables, funciones, archivos).
- **Sin dependencias innecesarias.** Antes de sumar una librería, justificá por qué.

## Idioma de cara al usuario

- **Todo texto visible para quien compra: español rioplatense** (vos, tenés, hacés).
- Dirigido a **quien compra**, no a desarrolladores ni con jerga técnica.
- Tono directo y claro. Sin relleno.

## Reglas de negocio críticas (de ARCHITECTURE.md, repetidas por importancia)

- **Stock por variante** (talle + color), nunca por producto.
- **Stock se descuenta en el webhook de pago confirmado,** no al agregar al carrito.
- **Precios e items se congelan** (snapshot) en la orden al momento de compra.
- **Datos de tarjeta nunca pasan por nuestro servidor.** Solo MercadoPago Bricks.
- **Todo serverless. Sin VPS.**

---

## Sistema de diseño base

> Filosofía: base limpia y premium, NEUTRA. Es el piso visual sobre el que después se monta la identidad de cada cliente (lo hace la agencia, no el usuario final). Tiene que sentirse profesional, premium y único — listo para mostrar como demo de venta.

La elegancia acá viene de la **precisión y la contención**, no de los efectos. Es minimalismo refinado: cada espacio, cada peso tipográfico y cada línea está pensado. Menos elementos, mejor ejecutados.

### Principios

- **Aire generoso.** El espacio en blanco no es vacío, es jerarquía. No llenar por llenar.
- **Restricción.** Pocos colores, pocos pesos tipográficos, pocas decoraciones. La calidad se nota en lo que se quita.
- **Jerarquía clara.** En cada pantalla queda obvio qué es lo más importante. Una sola acción principal por vista.
- **Foco en el producto.** En ecommerce, el protagonista es el producto. El diseño lo enmarca, no compite con él.
- **Consistencia.** Mismos espaciados, mismos radios, mismos tiempos de animación en todo el sistema.

### Paleta base (neutra, premium)

Definida como variables CSS para que cada cliente la sobrescriba sin tocar componentes:

```css
:root {
  /* Neutros — el corazón del sistema */
  --color-bg: #ffffff;          /* fondo principal */
  --color-surface: #fafafa;     /* superficies elevadas sutiles */
  --color-ink: #0a0a0a;         /* texto principal, casi negro */
  --color-ink-soft: #6b6b6b;    /* texto secundario */
  --color-line: #ebebeb;        /* bordes y divisores */

  /* Acento — un solo color, sobrescribible por marca */
  --color-accent: #0a0a0a;      /* por defecto el mismo negro; cada cliente le pone el suyo */
  --color-accent-ink: #ffffff;  /* texto sobre acento */

  /* Estado */
  --color-success: #16a34a;
  --color-danger: #dc2626;
}
```

Regla: el boilerplate base usa **blanco y negro casi puro**. El color de marca entra por `--color-accent` en la personalización. Nada de gradientes violetas ni paletas genéricas de "plantilla AI".

### Tipografía

- **Un display refinado para títulos + un sans limpio para cuerpo.** Par tipográfico, no una sola fuente para todo.
- Evitar fuentes genéricas (Arial, Inter, Roboto, system). Elegir algo con carácter pero sobrio.
- Pocos pesos: regular y un bold/semibold. La jerarquía se logra con tamaño y espacio, no con seis pesos distintos.
- Definir las fuentes como variables CSS para sobrescribir por cliente.

### Espaciado y forma

- Escala de espaciado consistente (múltiplos de 4px).
- Radios sutiles y consistentes (ni cuadrado total ni demasiado redondeado).
- Sombras suaves y escasas — la profundidad se sugiere, no se grita.

### Movimiento (Framer Motion)

- **Sutil y con propósito.** Micro-interacciones que dan sensación de calidad, no animaciones que distraen.
- Momentos de alto impacto: una entrada de página bien orquestada vale más que diez micro-animaciones sueltas.
- Feedback suave al agregar al carrito, transiciones del drawer, hover de cards.
- Tiempos consistentes (definir duración y easing como tokens y reusarlos).
- Respetar `prefers-reduced-motion`.

### Lo que NO hacer

- Nada de estética genérica "plantilla AI": gradientes violetas sobre blanco, fuentes system, layouts predecibles sin carácter.
- No sobrecargar. Ante la duda, quitar.
- No animar por animar.
- No competir con el producto.

---

## Recordatorio sobre los MCP (para la Fase 2)

Cuando lleguemos a la capa de datos, conviene activar los MCP de **Supabase** (crear/consultar tablas directo) y **Vercel** (estado de deploys). Son opcionales pero ahorran fricción. Avisar al llegar a esa fase.