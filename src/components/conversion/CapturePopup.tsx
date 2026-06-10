"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { popupContent, POPUP_LS_KEYS } from "@/content/popup";

// ─── Constantes ───────────────────────────────────────────────────────────────

const TRIGGER_DELAY_MS = 8_000;   // 8s de navegación → mostrar
const DISMISS_TTL_MS = 24 * 60 * 60 * 1000; // 24h antes de volver a mostrar

// ─── Helpers de localStorage ──────────────────────────────────────────────────

function readLS(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function writeLS(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch {}
}

function isSuppressed(): boolean {
  if (readLS(POPUP_LS_KEYS.subscribed)) return true;
  const dismissed = readLS(POPUP_LS_KEYS.dismissed);
  if (dismissed && Date.now() - Number(dismissed) < DISMISS_TTL_MS) return true;
  return false;
}

// ─── Íconos inline ───────────────────────────────────────────────────────────

function IconCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ─── Subcomponente: estado de éxito ──────────────────────────────────────────

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center text-center gap-5 py-2">
      <div
        className="flex items-center justify-center w-12 h-12 rounded-full"
        style={{ backgroundColor: "var(--color-success)", color: "#ffffff" }}
      >
        <IconCheck />
      </div>

      <div className="flex flex-col gap-2">
        <h2
          className="font-display text-xl font-semibold"
          style={{ color: "var(--color-ink)" }}
        >
          {popupContent.successTitle}
        </h2>
        <p
          className="font-body text-sm leading-relaxed"
          style={{ color: "var(--color-ink-soft)" }}
        >
          {popupContent.successBody}
        </p>
      </div>

      <button
        onClick={onClose}
        className="font-body text-sm px-8 py-3 w-full transition-opacity hover:opacity-75"
        style={{
          border: "1px solid var(--color-line)",
          borderRadius: 4,
          color: "var(--color-ink)",
        }}
      >
        {popupContent.successCta}
      </button>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function CapturePopup() {
  const prefersReducedMotion = useReducedMotion();

  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [apiError, setApiError] = useState("");

  const hasShown = useRef(false);

  // Muestra el popup (una sola vez por sesión de triggers)
  const show = useCallback(() => {
    if (hasShown.current || isSuppressed()) return;
    hasShown.current = true;
    setVisible(true);
  }, []);

  // Cierra y registra dismissal (no volver a mostrar por 24h)
  const dismiss = useCallback(() => {
    setVisible(false);
    writeLS(POPUP_LS_KEYS.dismissed, Date.now().toString());
  }, []);

  // Cierra sin marcar dismissal (post-submit: ya no mostrar nunca)
  const closeAfterSubmit = useCallback(() => setVisible(false), []);

  // ── Triggers ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (isSuppressed()) return;

    // Trigger 1: timer
    const timer = setTimeout(show, TRIGGER_DELAY_MS);

    // Trigger 2: exit intent — mouse saliendo por la parte superior (desktop)
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10) show();
    };
    document.addEventListener("mouseleave", onMouseLeave);

    // Trigger 3: scroll brusco hacia arriba (señal de "quiero salir" en mobile)
    let prevY = window.scrollY;
    let prevT = Date.now();
    const onScroll = () => {
      const y = window.scrollY;
      const t = Date.now();
      const dy = prevY - y;  // positivo = scrolleando hacia arriba
      const dt = t - prevT;
      if (dy > 80 && dt < 400 && dt > 0) show();
      prevY = y;
      prevT = t;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [show]);

  // ESC para cerrar
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") dismiss(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, dismiss]);

  // ── Submit ──────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldError("");
    setApiError("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedEmail)) {
      setFieldError(popupContent.errorInvalidEmail);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          phone: phone.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");

      // Guardar cupón en localStorage para auto-aplicar en checkout
      writeLS(POPUP_LS_KEYS.coupon, data.couponCode as string);
      writeLS(POPUP_LS_KEYS.subscribed, "1");

      setSubmitted(true);
    } catch {
      setApiError(popupContent.errorGeneric);
    } finally {
      setLoading(false);
    }
  }

  // ── Animaciones ─────────────────────────────────────────────────────────

  const ease = [0.22, 1, 0.36, 1] as const;
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25 } },
    exit:   { opacity: 0, transition: { duration: 0.2 } },
  };
  const modalVariants = {
    hidden:  prefersReducedMotion ? { opacity: 0 }           : { opacity: 0, y: 28, scale: 0.97 },
    visible: prefersReducedMotion ? { opacity: 1 }           : { opacity: 1, y: 0,  scale: 1 },
    exit:    prefersReducedMotion ? { opacity: 0 }           : { opacity: 0, y: 16, scale: 0.98 },
  };
  const transition = { duration: 0.38, ease };

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="popup-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[60]"
            style={{ backgroundColor: "rgba(0,0,0,0.48)" }}
            onClick={dismiss}
            aria-hidden="true"
          />

          {/* Contenedor de posicionamiento:
              mobile  → flex al fondo (bottom sheet flotante)
              desktop → flex centrado */}
          <div
            className="fixed inset-0 z-[61] flex items-end md:items-center justify-center p-4 md:p-8 pointer-events-none"
          >
            <motion.div
              key="popup-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="popup-title"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={transition}
              className="w-full pointer-events-auto relative"
              style={{
                maxWidth: 420,
                backgroundColor: "var(--color-bg)",
                borderRadius: 8,
                boxShadow:
                  "0 32px 80px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.08)",
              }}
            >
              {/* Botón cerrar */}
              <button
                onClick={dismiss}
                aria-label="Cerrar"
                className="absolute top-4 right-4 flex items-center justify-center transition-opacity hover:opacity-50"
                style={{ color: "var(--color-ink-soft)", padding: 4 }}
              >
                <IconClose />
              </button>

              <div className="p-8 md:p-10">
                {submitted ? (
                  <SuccessState onClose={closeAfterSubmit} />
                ) : (
                  <>
                    {/* Badge */}
                    <span
                      className="inline-block font-body text-[10px] font-medium uppercase tracking-widest mb-5 px-2.5 py-1"
                      style={{
                        border: "1px solid var(--color-line)",
                        borderRadius: 2,
                        color: "var(--color-ink-soft)",
                        letterSpacing: "0.12em",
                      }}
                    >
                      {popupContent.badge}
                    </span>

                    {/* Título */}
                    <h2
                      id="popup-title"
                      className="font-display text-2xl font-semibold leading-tight mb-3"
                      style={{ color: "var(--color-ink)" }}
                    >
                      {popupContent.title}
                    </h2>

                    {/* Subtítulo */}
                    <p
                      className="font-body text-sm leading-relaxed mb-7"
                      style={{ color: "var(--color-ink-soft)" }}
                    >
                      {popupContent.subtitle}
                    </p>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

                      {/* Email */}
                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="popup-email"
                          className="font-body text-xs font-medium"
                          style={{ color: "var(--color-ink)", letterSpacing: "0.05em" }}
                        >
                          {popupContent.emailLabel}
                        </label>
                        <input
                          id="popup-email"
                          type="email"
                          autoComplete="email"
                          placeholder={popupContent.emailPlaceholder}
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (fieldError) setFieldError("");
                          }}
                          disabled={loading}
                          className="font-body text-sm w-full bg-transparent outline-none transition-colors"
                          style={{
                            border: fieldError
                              ? "1px solid var(--color-danger)"
                              : "1px solid var(--color-line)",
                            borderRadius: 4,
                            padding: "10px 12px",
                            color: "var(--color-ink)",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "var(--color-ink)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = fieldError
                              ? "var(--color-danger)"
                              : "var(--color-line)";
                          }}
                        />
                        {fieldError && (
                          <p
                            className="font-body text-xs"
                            style={{ color: "var(--color-danger)" }}
                            role="alert"
                          >
                            {fieldError}
                          </p>
                        )}
                      </div>

                      {/* WhatsApp (opcional) */}
                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="popup-phone"
                          className="font-body text-xs font-medium"
                          style={{ color: "var(--color-ink)", letterSpacing: "0.05em" }}
                        >
                          {popupContent.phoneLabel}
                        </label>
                        <input
                          id="popup-phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder={popupContent.phonePlaceholder}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          disabled={loading}
                          className="font-body text-sm w-full bg-transparent outline-none transition-colors"
                          style={{
                            border: "1px solid var(--color-line)",
                            borderRadius: 4,
                            padding: "10px 12px",
                            color: "var(--color-ink)",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "var(--color-ink)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "var(--color-line)";
                          }}
                        />
                        <p
                          className="font-body text-[11px]"
                          style={{ color: "var(--color-ink-soft)" }}
                        >
                          {popupContent.phoneHint}
                        </p>
                      </div>

                      {/* Error de API */}
                      {apiError && (
                        <p
                          className="font-body text-xs"
                          style={{ color: "var(--color-danger)" }}
                          role="alert"
                        >
                          {apiError}
                        </p>
                      )}

                      {/* CTA principal */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="font-body text-sm font-medium w-full py-3.5 transition-opacity mt-1"
                        style={{
                          backgroundColor: "var(--color-accent)",
                          color: "var(--color-accent-ink)",
                          borderRadius: 4,
                          opacity: loading ? 0.6 : 1,
                          cursor: loading ? "not-allowed" : "pointer",
                        }}
                      >
                        {loading ? "Guardando…" : popupContent.cta}
                      </button>

                    </form>

                    {/* Dismiss */}
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={dismiss}
                        className="font-body text-xs transition-opacity hover:opacity-60"
                        style={{ color: "var(--color-ink-soft)" }}
                      >
                        {popupContent.dismiss}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
