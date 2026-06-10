"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useCart, type ShippingZone } from "@/store/cart";
import { formatPrice } from "@/lib/colors";
import type { ShippingZoneRow } from "@/types/shipping";
import OrderSummary from "@/components/checkout/OrderSummary";

// ─── Fallback para entornos sin .env.local ────────────────────────────────────

const FALLBACK_ZONES: ShippingZoneRow[] = [
  {
    id: "fb-local",
    name: "Envío a domicilio (Córdoba Capital)",
    zone_type: "local",
    flat_rate: 5500,
    free_shipping_threshold: 45000,
    estimated_days: "En el día (durante el horario comercial)",
    requires_address: true,
    sort_order: 1,
    is_active: true,
  },
  {
    id: "fb-pickup",
    name: "Retiro en local",
    zone_type: "pickup",
    flat_rate: 0,
    free_shipping_threshold: null,
    estimated_days: "En el día (durante el horario comercial)",
    requires_address: false,
    sort_order: 2,
    is_active: true,
  },
  {
    id: "fb-nacional",
    name: "Envío a domicilio (resto del país)",
    zone_type: "nacional",
    flat_rate: 17500,
    free_shipping_threshold: 90000,
    estimated_days: "3–7 días hábiles",
    requires_address: true,
    sort_order: 3,
    is_active: true,
  },
];

const COUNTRIES = [
  { code: "AR", flag: "🇦🇷", name: "Argentina", prefix: "+54" },
  { code: "BO", flag: "🇧🇴", name: "Bolivia", prefix: "+591" },
  { code: "BR", flag: "🇧🇷", name: "Brasil", prefix: "+55" },
  { code: "CL", flag: "🇨🇱", name: "Chile", prefix: "+56" },
  { code: "CO", flag: "🇨🇴", name: "Colombia", prefix: "+57" },
  { code: "CR", flag: "🇨🇷", name: "Costa Rica", prefix: "+506" },
  { code: "CU", flag: "🇨🇺", name: "Cuba", prefix: "+53" },
  { code: "EC", flag: "🇪🇨", name: "Ecuador", prefix: "+593" },
  { code: "ES", flag: "🇪🇸", name: "España", prefix: "+34" },
  { code: "GT", flag: "🇬🇹", name: "Guatemala", prefix: "+502" },
  { code: "HN", flag: "🇭🇳", name: "Honduras", prefix: "+504" },
  { code: "MX", flag: "🇲🇽", name: "México", prefix: "+52" },
  { code: "NI", flag: "🇳🇮", name: "Nicaragua", prefix: "+505" },
  { code: "PA", flag: "🇵🇦", name: "Panamá", prefix: "+507" },
  { code: "PY", flag: "🇵🇾", name: "Paraguay", prefix: "+595" },
  { code: "PE", flag: "🇵🇪", name: "Perú", prefix: "+51" },
  { code: "DO", flag: "🇩🇴", name: "República Dominicana", prefix: "+1" },
  { code: "UY", flag: "🇺🇾", name: "Uruguay", prefix: "+598" },
  { code: "VE", flag: "🇻🇪", name: "Venezuela", prefix: "+58" },
];

const PROVINCES = [
  "Buenos Aires",
  "CABA",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  email: string;
  phone: string;
  street: string;
  apt: string;
  neighborhood: string;
  city: string;
  province: string;
  zip: string;
  reference: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcShippingCost(method: ShippingZoneRow, subtotal: number): number {
  if (method.zone_type === "pickup") return 0;
  const threshold = method.free_shipping_threshold;
  if (threshold && threshold > 0 && subtotal >= threshold) return 0;
  return Number(method.flat_rate);
}

function validateForm(
  form: FormData,
  method: ShippingZoneRow | null,
  zone: ShippingZone
): FormErrors {
  const e: FormErrors = {};

  if (!form.name.trim()) e.name = "Tu nombre es requerido";

  if (!form.email.trim()) {
    e.email = "Tu email es requerido";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    e.email = "Ingresá un email válido";
  }

  if (!form.phone.trim()) e.phone = "Tu teléfono es requerido";

  if (method?.requires_address) {
    if (!form.street.trim()) e.street = "La calle y número son requeridos";
    if (zone === "local" && !form.neighborhood.trim()) {
      e.neighborhood = "El barrio es requerido";
    }
    if (zone === "nacional") {
      if (!form.city.trim()) e.city = "La localidad es requerida";
      if (!form.province.trim()) e.province = "La provincia es requerida";
      if (!form.zip.trim()) e.zip = "El código postal es requerido";
    }
  }

  return e;
}

// ─── Sub-componentes internos ─────────────────────────────────────────────────

function StepHeader({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-6">
      <span
        className="font-display text-sm tabular-nums"
        style={{ color: "var(--color-ink-soft)" }}
      >
        {n}
      </span>
      <h2
        className="font-display text-xl font-semibold"
        style={{ color: "var(--color-ink)" }}
      >
        {title}
      </h2>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className="font-body text-xs block mb-1.5"
        style={{ color: "var(--color-ink-soft)" }}
      >
        {label}
        {required && (
          <span style={{ color: "var(--color-danger)" }}> *</span>
        )}
      </label>
      {children}
      {error && (
        <p
          className="font-body text-xs mt-1"
          style={{ color: "var(--color-danger)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <motion.svg
      width={13}
      height={13}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.2 }}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </motion.svg>
  );
}

function TrustBadges() {
  const items = [
    {
      icon: (
        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      label: "Compra segura",
    },
    {
      icon: (
        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      label: "Datos protegidos",
    },
    {
      icon: (
        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
      label: "Pago con MercadoPago",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 py-4">
      {items.map(({ icon, label }) => (
        <div key={label} className="flex items-center gap-1.5">
          <span style={{ color: "var(--color-ink-soft)" }}>{icon}</span>
          <span
            className="font-body text-xs"
            style={{ color: "var(--color-ink-soft)" }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function CheckoutClient({
  zones: rawZones,
}: {
  zones: ShippingZoneRow[];
}) {
  const zones = rawZones.length > 0 ? rawZones : FALLBACK_ZONES;
  const { items, subtotal, zone: cartZone, setZone, hydrated } = useCart();
  const prefersReducedMotion = useReducedMotion();

  const [selectedZone, setSelectedZone] = useState<ShippingZone>("local");
  const [selectedMethodId, setSelectedMethodId] = useState("");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [orderReady, setOrderReady] = useState(false);
  const [phoneCountry, setPhoneCountry] = useState("AR");
  const [focused, setFocused] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    street: "",
    apt: "",
    neighborhood: "",
    city: "",
    province: "",
    zip: "",
    reference: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Inicializar zona desde el carrito una vez hidratado
  useEffect(() => {
    if (hydrated) setSelectedZone(cartZone);
  }, [hydrated, cartZone]);

  // Métodos disponibles según zona seleccionada
  const availableMethods = zones
    .filter((z) =>
      selectedZone === "local"
        ? z.zone_type === "local" || z.zone_type === "pickup"
        : z.zone_type === "nacional"
    )
    .sort((a, b) => a.sort_order - b.sort_order);

  const selectedMethod =
    availableMethods.find((m) => m.id === selectedMethodId) ??
    availableMethods[0] ??
    null;

  // Auto-seleccionar primer método al cambiar zona
  useEffect(() => {
    const valid = availableMethods.find((m) => m.id === selectedMethodId);
    if (!valid && availableMethods.length > 0) {
      setSelectedMethodId(availableMethods[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedZone]);

  const shippingCost = selectedMethod
    ? calcShippingCost(selectedMethod, subtotal)
    : 0;
  const total = subtotal + shippingCost;

  // El step de pago cambia según si hay dirección
  const paymentStep = selectedMethod?.requires_address ? 4 : 3;

  function handleZoneChange(z: ShippingZone) {
    setSelectedZone(z);
    setZone(z); // sincroniza con el cart store + localStorage
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // SYNC abandoned_carts (Fase 6): cuando email o phone tengan ≥ 5 chars,
    // llamar supabase.from("abandoned_carts").upsert({...}) — ver cart.tsx.
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  // Estilo de input con borde reactivo a foco y errores
  function brd(name: string, hasError: boolean): React.CSSProperties {
    return {
      borderRadius: 2,
      border: `1px solid ${
        hasError
          ? "var(--color-danger)"
          : focused === name
          ? "var(--color-ink)"
          : "var(--color-line)"
      }`,
      backgroundColor: "var(--color-bg)",
      color: "var(--color-ink)",
      transition: "border-color 0.15s ease",
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors = validateForm(form, selectedMethod, selectedZone);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    if (!selectedMethod) return;

    /* ── PAYLOAD PARA MERCADOPAGO (Fase de pago) ─────────────────────────────
     * Listo para enviarse a POST /api/checkout/create-preference.
     * Ver la sección de pago más abajo para el flujo completo.
     * ─────────────────────────────────────────────────────────────────────── */
    const orderPayload = {
      customer: {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: `${COUNTRIES.find((c) => c.code === phoneCountry)?.prefix ?? "+54"} ${form.phone.trim()}`,
      },
      shipping: {
        methodId: selectedMethod.id,
        methodName: selectedMethod.name,
        zoneType: selectedMethod.zone_type,
        cost: shippingCost,
        estimatedDays: selectedMethod.estimated_days,
        address: selectedMethod.requires_address
          ? {
              street: form.street.trim(),
              apt: form.apt.trim() || undefined,
              neighborhood:
                selectedMethod.zone_type === "local"
                  ? form.neighborhood.trim() || undefined
                  : undefined,
              city:
                selectedMethod.zone_type === "nacional"
                  ? form.city.trim()
                  : undefined,
              province:
                selectedMethod.zone_type === "nacional"
                  ? form.province.trim()
                  : undefined,
              zip: form.zip.trim() || undefined,
              reference:
                selectedMethod.zone_type === "local"
                  ? form.reference.trim() || undefined
                  : undefined,
            }
          : undefined,
      },
      items: items.map((i) => ({
        variantId: i.variantId,
        productName: i.productName,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        unitPrice: i.price,
      })),
      subtotal,
      shippingCost,
      total,
    };

    console.log("✅ Pedido validado — payload listo para MercadoPago:", orderPayload);
    setOrderReady(true);
  }

  // ── Estado de carga ────────────────────────────────────────────────────────
  if (!hydrated) {
    return (
      <main className="max-w-screen-md mx-auto px-4 py-16">
        <div className="flex flex-col gap-3">
          {[96, 72, 56, 56, 44].map((h, i) => (
            <div
              key={i}
              style={{
                height: h,
                borderRadius: 2,
                backgroundColor: "var(--color-surface)",
              }}
            />
          ))}
        </div>
      </main>
    );
  }

  // ── Carrito vacío ──────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <main
        className="flex flex-col items-center justify-center text-center px-4"
        style={{ minHeight: "60vh" }}
      >
        <svg
          width={36}
          height={36}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: "var(--color-line)" }}
          aria-hidden="true"
        >
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        <p
          className="font-display text-2xl font-semibold mt-5"
          style={{ color: "var(--color-ink)" }}
        >
          Tu carrito está vacío
        </p>
        <p
          className="font-body text-sm mt-3"
          style={{ color: "var(--color-ink-soft)" }}
        >
          Agregá productos antes de continuar al checkout.
        </p>
        <Link
          href="/productos"
          className="font-body text-sm mt-6 px-6 py-3"
          style={{
            border: "1px solid var(--color-line)",
            borderRadius: 2,
            color: "var(--color-ink)",
          }}
        >
          Ver productos
        </Link>
      </main>
    );
  }

  const ic = "font-body text-sm w-full px-3 py-2.5 outline-none"; // base input class

  return (
    <main style={{ backgroundColor: "var(--color-bg)" }}>

      {/* ── Resumen mobile (sticky bajo el navbar) ─────────────────────────── */}
      <div
        className="lg:hidden sticky z-20"
        style={{
          top: 56,
          backgroundColor: "var(--color-surface)",
          borderBottom: "1px solid var(--color-line)",
        }}
      >
        <button
          type="button"
          onClick={() => setSummaryOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 gap-3"
          aria-expanded={summaryOpen}
          aria-controls="mobile-order-summary"
        >
          <div
            className="flex items-center gap-2"
            style={{ color: "var(--color-ink)" }}
          >
            <svg
              width={15}
              height={15}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="font-body text-sm" style={{ color: "var(--color-ink)" }}>
              {summaryOpen ? "Cerrar resumen" : "Ver resumen del pedido"}
            </span>
            <ChevronDown open={summaryOpen} />
          </div>
          <span
            className="font-body text-sm font-semibold shrink-0"
            style={{ color: "var(--color-ink)" }}
          >
            {formatPrice(total)}
          </span>
        </button>

        <AnimatePresence initial={false}>
          {summaryOpen && (
            <motion.div
              id="mobile-order-summary"
              initial={
                prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }
              }
              animate={
                prefersReducedMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }
              }
              exit={
                prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }
              }
              transition={{ duration: 0.22, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <div
                className="px-4 py-4"
                style={{ borderTop: "1px solid var(--color-line)" }}
              >
                <OrderSummary
                  items={items}
                  subtotal={subtotal}
                  shippingCost={shippingCost}
                  shippingMethodName={selectedMethod?.name ?? ""}
                  total={total}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Contenido ──────────────────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-16 lg:items-start">

          {/* ── Formulario ──────────────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} noValidate>

            {/* 1 · Datos personales ─────────────────────────────────────── */}
            <section
              className="pb-8"
              style={{ borderBottom: "1px solid var(--color-line)" }}
            >
              <StepHeader n={1} title="Tus datos" />
              <div className="flex flex-col gap-4">

                <Field label="Nombre y apellido" required error={errors.name}>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    placeholder="Juan García"
                    autoComplete="name"
                    className={ic}
                    style={brd("name", !!errors.name)}
                  />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Email" required error={errors.email}>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      placeholder="juan@mail.com"
                      autoComplete="email"
                      className={ic}
                      style={brd("email", !!errors.email)}
                    />
                  </Field>

                  <Field label="Teléfono / WhatsApp" required error={errors.phone}>
                    {/* Grupo: selector de país + número */}
                    <div
                      style={{
                        display: "flex",
                        borderRadius: 2,
                        overflow: "hidden",
                        border: `1px solid ${
                          errors.phone
                            ? "var(--color-danger)"
                            : focused === "phone" || focused === "phoneCountry"
                            ? "var(--color-ink)"
                            : "var(--color-line)"
                        }`,
                        backgroundColor: "var(--color-bg)",
                        transition: "border-color 0.15s ease",
                      }}
                    >
                      <select
                        value={phoneCountry}
                        onChange={(e) => setPhoneCountry(e.target.value)}
                        onFocus={() => setFocused("phoneCountry")}
                        onBlur={() => setFocused(null)}
                        aria-label="Código de país"
                        className="font-body text-sm outline-none shrink-0"
                        style={{
                          width: 96,
                          padding: "10px 22px 10px 10px",
                          borderRight: "1px solid var(--color-line)",
                          backgroundColor: "var(--color-surface)",
                          color: "var(--color-ink)",
                          cursor: "pointer",
                          appearance: "none",
                          WebkitAppearance: "none",
                          backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='9' height='5' viewBox='0 0 9 5'%3E%3Cpath d='M0 0l4.5 5L9 0z' fill='%236b6b6b'/%3E%3C/svg%3E\")",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "calc(100% - 8px) center",
                        }}
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.prefix}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        onFocus={() => setFocused("phone")}
                        onBlur={() => setFocused(null)}
                        placeholder="9 351 000-0000"
                        autoComplete="tel-national"
                        className="font-body text-sm flex-1 px-3 py-2.5 outline-none min-w-0"
                        style={{
                          backgroundColor: "var(--color-bg)",
                          color: "var(--color-ink)",
                          border: "none",
                        }}
                      />
                    </div>
                  </Field>
                </div>

              </div>
            </section>

            {/* 2 · Método de entrega ────────────────────────────────────── */}
            <section
              className="py-8"
              style={{ borderBottom: "1px solid var(--color-line)" }}
            >
              <StepHeader n={2} title="Método de entrega" />

              {/* Selector de zona */}
              <div className="flex gap-2 mb-5">
                {(["local", "nacional"] as ShippingZone[]).map((z) => {
                  const active = z === selectedZone;
                  return (
                    <button
                      key={z}
                      type="button"
                      onClick={() => handleZoneChange(z)}
                      className="font-body text-sm px-4 py-1.5"
                      style={{
                        borderRadius: 999,
                        border: active
                          ? "1.5px solid var(--color-ink)"
                          : "1px solid var(--color-line)",
                        backgroundColor: active
                          ? "var(--color-ink)"
                          : "transparent",
                        color: active
                          ? "var(--color-accent-ink)"
                          : "var(--color-ink-soft)",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {z === "local" ? "Córdoba Capital" : "Otra provincia"}
                    </button>
                  );
                })}
              </div>

              {/* Opciones de envío */}
              <div
                role="radiogroup"
                aria-label="Método de entrega"
                className="flex flex-col gap-3"
              >
                {availableMethods.map((method) => {
                  const isSelected = method.id === selectedMethod?.id;
                  const cost = calcShippingCost(method, subtotal);
                  const remaining =
                    method.free_shipping_threshold &&
                    method.zone_type !== "pickup" &&
                    subtotal < method.free_shipping_threshold
                      ? method.free_shipping_threshold - subtotal
                      : 0;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setSelectedMethodId(method.id)}
                      className="flex items-start gap-3 p-4 text-left w-full transition-all"
                      style={{
                        border: isSelected
                          ? "1.5px solid var(--color-ink)"
                          : "1px solid var(--color-line)",
                        borderRadius: 2,
                        backgroundColor: isSelected
                          ? "var(--color-surface)"
                          : "var(--color-bg)",
                        cursor: "pointer",
                      }}
                    >
                      {/* Radio visual */}
                      <div
                        className="shrink-0 mt-0.5"
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          border: isSelected
                            ? "4.5px solid var(--color-ink)"
                            : "1.5px solid var(--color-line)",
                          transition: "border 0.15s ease",
                        }}
                      />

                      {/* Info */}
                      <div className="flex-1">
                        <p
                          className="font-body text-sm font-medium"
                          style={{ color: "var(--color-ink)" }}
                        >
                          {method.name}
                        </p>
                        {method.estimated_days && (
                          <p
                            className="font-body text-xs mt-0.5"
                            style={{ color: "var(--color-ink-soft)" }}
                          >
                            {method.estimated_days}
                          </p>
                        )}
                        {remaining > 0 && (
                          <p
                            className="font-body text-xs mt-1"
                            style={{ color: "var(--color-ink-soft)" }}
                          >
                            Agregá {formatPrice(remaining)} para envío gratis
                          </p>
                        )}
                      </div>

                      {/* Costo */}
                      <p
                        className="font-body text-sm font-medium shrink-0"
                        style={{
                          color:
                            cost === 0
                              ? "var(--color-success)"
                              : "var(--color-ink)",
                        }}
                      >
                        {cost === 0 ? "Gratis" : formatPrice(cost)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 3 · Dirección (condicional) ──────────────────────────────── */}
            <AnimatePresence mode="wait">
              {selectedMethod?.requires_address && (
                <motion.section
                  key={`addr-${selectedMethod.zone_type}`}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 10 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="py-8"
                  style={{ borderBottom: "1px solid var(--color-line)" }}
                >
                  <StepHeader n={3} title="Dirección de entrega" />
                  <div className="flex flex-col gap-4">

                    <Field label="Calle y número" required error={errors.street}>
                      <input
                        type="text"
                        name="street"
                        value={form.street}
                        onChange={handleChange}
                        onFocus={() => setFocused("street")}
                        onBlur={() => setFocused(null)}
                        placeholder={
                          selectedZone === "local"
                            ? "Av. Colón 2500"
                            : "Av. Corrientes 1234"
                        }
                        autoComplete="address-line1"
                        className={ic}
                        style={brd("street", !!errors.street)}
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Piso / Depto" error={errors.apt}>
                        <input
                          type="text"
                          name="apt"
                          value={form.apt}
                          onChange={handleChange}
                          onFocus={() => setFocused("apt")}
                          onBlur={() => setFocused(null)}
                          placeholder="2° A"
                          autoComplete="address-line2"
                          className={ic}
                          style={brd("apt", false)}
                        />
                      </Field>

                      {selectedZone === "local" ? (
                        <Field label="Barrio" required error={errors.neighborhood}>
                          <input
                            type="text"
                            name="neighborhood"
                            value={form.neighborhood}
                            onChange={handleChange}
                            onFocus={() => setFocused("neighborhood")}
                            onBlur={() => setFocused(null)}
                            placeholder="Nueva Córdoba"
                            className={ic}
                            style={brd("neighborhood", !!errors.neighborhood)}
                          />
                        </Field>
                      ) : (
                        <Field label="Localidad" required error={errors.city}>
                          <input
                            type="text"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            onFocus={() => setFocused("city")}
                            onBlur={() => setFocused(null)}
                            placeholder="Rosario"
                            autoComplete="address-level2"
                            className={ic}
                            style={brd("city", !!errors.city)}
                          />
                        </Field>
                      )}
                    </div>

                    {/* Campos específicos por zona */}
                    {selectedZone === "local" ? (
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Referencias para el cadete" error={errors.reference}>
                          <input
                            type="text"
                            name="reference"
                            value={form.reference}
                            onChange={handleChange}
                            onFocus={() => setFocused("reference")}
                            onBlur={() => setFocused(null)}
                            placeholder="Timbre azul, PB derecha"
                            className={ic}
                            style={brd("reference", false)}
                          />
                        </Field>
                        <Field label="Código postal">
                          <input
                            type="text"
                            name="zip"
                            value={form.zip}
                            onChange={handleChange}
                            onFocus={() => setFocused("zip")}
                            onBlur={() => setFocused(null)}
                            placeholder="5000"
                            autoComplete="postal-code"
                            inputMode="numeric"
                            className={ic}
                            style={brd("zip", false)}
                          />
                        </Field>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Provincia" required error={errors.province}>
                          <select
                            name="province"
                            value={form.province}
                            onChange={handleChange}
                            onFocus={() => setFocused("province")}
                            onBlur={() => setFocused(null)}
                            className={ic}
                            style={brd("province", !!errors.province)}
                          >
                            <option value="">Seleccioná...</option>
                            {PROVINCES.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field
                          label="Código postal"
                          required
                          error={errors.zip}
                        >
                          <input
                            type="text"
                            name="zip"
                            value={form.zip}
                            onChange={handleChange}
                            onFocus={() => setFocused("zip")}
                            onBlur={() => setFocused(null)}
                            placeholder="1001"
                            autoComplete="postal-code"
                            inputMode="numeric"
                            className={ic}
                            style={brd("zip", !!errors.zip)}
                          />
                        </Field>
                      </div>
                    )}

                  </div>
                </motion.section>
              )}

              {/* Pickup: mostrar punto de retiro */}
              {selectedMethod?.zone_type === "pickup" && (
                <motion.section
                  key="pickup-info"
                  initial={
                    prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="py-8"
                  style={{ borderBottom: "1px solid var(--color-line)" }}
                >
                  <StepHeader n={3} title="Punto de retiro" />
                  <div
                    className="flex gap-3 p-4"
                    style={{
                      border: "1px solid var(--color-line)",
                      borderRadius: 2,
                      backgroundColor: "var(--color-surface)",
                    }}
                  >
                    <svg
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 mt-0.5"
                      style={{ color: "var(--color-ink-soft)" }}
                      aria-hidden="true"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <div>
                      <p
                        className="font-body text-sm font-medium"
                        style={{ color: "var(--color-ink)" }}
                      >
                        [DIRECCION_LOCAL]
                      </p>
                      <p
                        className="font-body text-xs mt-1"
                        style={{ color: "var(--color-ink-soft)" }}
                      >
                        Te contactamos por WhatsApp para coordinar el horario de
                        retiro.
                      </p>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* Señales de confianza */}
            <TrustBadges />

            {/* 4 · Pago ─────────────────────────────────────────────────── */}
            <section className="pb-8">
              <StepHeader n={paymentStep} title="Pago" />

              {/* ════════════════════════════════════════════════════════════════
                MERCADOPAGO BRICKS — integrar en la Fase de pago

                Flujo completo:
                ─────────────────────────────────────────────────────────────
                1. handleSubmit() valida el formulario y construye orderPayload.

                2. POST /api/checkout/create-preference
                   Body: { orderPayload }
                   → El servidor usa MP_ACCESS_TOKEN (env var PRIVADA, nunca
                     en cliente) para crear una preferencia en MercadoPago
                     y devuelve { preferenceId, amount }.

                3. Con preferenceId, montar el Brick en el cliente:
                     npm install @mercadopago/sdk-react
                     import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
                     initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!);
                     <Payment
                       initialization={{ amount: total, preferenceId }}
                       onSubmit={async (formData) => { ... }}
                       onError={(err) => console.error(err)}
                     />
                   Los datos de tarjeta NUNCA pasan por nuestro servidor.

                4. Webhook POST /api/webhook/mp (llamado por MercadoPago):
                   - Verificar X-Signature
                   - Consultar pago con MP_ACCESS_TOKEN para confirmar estado
                   - RECIÉN ACÁ: INSERT en orders + order_items
                   - Descontar stock en product_variants
                   - Marcar abandoned_cart.recovered = true (Fase 6)
                   - Enviar email de confirmación (Resend)

                REGLA CRÍTICA:
                La orden en la DB NO se crea acá. Solo en el webhook, cuando
                el pago está confirmado. Esto evita órdenes fantasma.
                El stock se descuenta en el webhook, NO en el carrito.
                ════════════════════════════════════════════════════════════════ */}

              <AnimatePresence mode="wait">
                {orderReady ? (
                  <motion.div
                    key="ready"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 text-center"
                    style={{
                      border: "1px solid var(--color-success)",
                      borderRadius: 2,
                      backgroundColor: "var(--color-surface)",
                    }}
                  >
                    <p
                      className="font-display text-base font-semibold"
                      style={{ color: "var(--color-success)" }}
                    >
                      ✓ Pedido validado
                    </p>
                    <p
                      className="font-body text-sm mt-2"
                      style={{ color: "var(--color-ink-soft)" }}
                    >
                      Tu pedido por{" "}
                      <span style={{ color: "var(--color-ink)" }}>
                        {formatPrice(total)}
                      </span>{" "}
                      está listo. El pago con MercadoPago se habilita en la
                      siguiente fase.
                    </p>
                    <p
                      className="font-body text-xs mt-2"
                      style={{ color: "var(--color-ink-soft)" }}
                    >
                      El payload completo está en la consola del navegador.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    exit={{ opacity: 0 }}
                    className="p-6 text-center"
                    style={{
                      border: "1.5px dashed var(--color-line)",
                      borderRadius: 2,
                      backgroundColor: "var(--color-surface)",
                    }}
                  >
                    <div
                      className="inline-flex items-center gap-2 mb-3 px-3 py-1.5"
                      style={{
                        border: "1px solid var(--color-line)",
                        borderRadius: 4,
                        backgroundColor: "var(--color-bg)",
                      }}
                    >
                      <svg
                        width={11}
                        height={11}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ color: "var(--color-ink-soft)" }}
                        aria-hidden="true"
                      >
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                      <span
                        className="font-body text-xs"
                        style={{ color: "var(--color-ink-soft)" }}
                      >
                        MercadoPago Bricks
                      </span>
                    </div>
                    <p
                      className="font-body text-sm"
                      style={{ color: "var(--color-ink-soft)" }}
                    >
                      El formulario de pago se integra en la siguiente fase.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Botón principal */}
            {!orderReady && (
              <motion.button
                type="submit"
                whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
                className="font-body text-sm w-full py-4 tracking-wide"
                style={{
                  borderRadius: 2,
                  backgroundColor: "var(--color-accent)",
                  color: "var(--color-accent-ink)",
                  cursor: "pointer",
                }}
              >
                Confirmar pedido →
              </motion.button>
            )}

            {orderReady && (
              <button
                type="button"
                onClick={() => setOrderReady(false)}
                className="font-body text-sm w-full py-3 mt-3"
                style={{
                  border: "1px solid var(--color-line)",
                  borderRadius: 2,
                  color: "var(--color-ink-soft)",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                }}
              >
                ← Modificar pedido
              </button>
            )}
          </form>

          {/* ── Sidebar desktop ─────────────────────────────────────────────── */}
          <div
            className="hidden lg:block lg:sticky"
            style={{ top: 56 + 24 }}
          >
            <div
              className="p-6"
              style={{
                border: "1px solid var(--color-line)",
                borderRadius: 2,
                backgroundColor: "var(--color-surface)",
              }}
            >
              <h2
                className="font-display text-base font-semibold mb-5"
                style={{ color: "var(--color-ink)" }}
              >
                Resumen del pedido
              </h2>
              <OrderSummary
                items={items}
                subtotal={subtotal}
                shippingCost={shippingCost}
                shippingMethodName={selectedMethod?.name ?? ""}
                total={total}
              />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
