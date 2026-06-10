# Capa de contenido — Level Commerce

## Estructura

```
src/content/
├── config.ts    — Configuración global: DEMO_MODE, locale, moneda, zona por defecto
├── brand.ts     — TODO el contenido de marca (el archivo que cambia por cliente)
├── nav.ts       — Estructura y copy de la navegación
└── footer.ts    — Copy y links del pie de página
```

Los componentes leen su contenido de estos archivos. No hay texto hardcodeado en los componentes.

---

## Convención de demo: `[DEMO]`

Cada valor que debe reemplazarse al adaptar para una marca real está marcado con el comentario:

```typescript
// [DEMO] descripción de qué reemplazar y con qué
```

Para ver todos los reemplazos pendientes de una vez:

```bash
grep -r "\[DEMO\]" src/content/
```

---

## DEMO_MODE

La variable de entorno `NEXT_PUBLIC_DEMO_MODE` controla elementos que *solo existen* en la demo de Level Commerce:

- **`true`** → se renderizan avisos, pop-ups de disclaimer y cualquier elemento de presentación
- **`false`** (o variable ausente) → la tienda funciona en modo producción sin esos elementos

Activar en `.env.local`:
```
NEXT_PUBLIC_DEMO_MODE=true
```

Los componentes acceden al flag a través de `DEMO_MODE` de `src/content/config.ts`:
```typescript
import { DEMO_MODE } from "@/content/config";
if (DEMO_MODE) { /* solo en demo */ }
```

---

## Tokens visuales

Los colores, tipografías y espaciados viven en `src/app/globals.css` como variables CSS (`--color-bg`, `--color-ink`, `--font-display`, etc.). Modificarlos para cada marca sin tocar los componentes.

---

## Cómo adaptar para una marca real

1. **Contenido** → editar `src/content/brand.ts` con los datos reales de la marca. Reemplazar todos los valores `[DEMO]`.
2. **Navegación** → editar `src/content/nav.ts` si la marca tiene categorías propias.
3. **Footer** → editar `src/content/footer.ts` (medios de pago, trust badges, crédito).
4. **Visual** → reemplazar los tokens en `src/app/globals.css` con la paleta y tipografías de la marca.
5. **Logo** → subir el logo a `public/images/logo.svg` y actualizar `brand.logo`.
6. **DEMO_MODE** → `NEXT_PUBLIC_DEMO_MODE=false` en producción.
7. **Productos** → cargar el catálogo real en Supabase (reemplaza los datos de prueba).

El resultado es una tienda con la identidad de la marca sin haber tocado ningún componente.
