"use client";

// Estado del carrito — persiste en localStorage bajo la clave STORAGE_KEY.
//
// SYNC CON abandoned_carts (Fase 6):
//   Cuando el usuario ingrese email/teléfono en el checkout (Fase 5), llamar:
//     supabase.from("abandoned_carts").upsert({
//       cart_data: items,
//       contact_email: email,
//       contact_phone: phone,
//       recovery_stage: 0,
//       recovered: false,
//     })
//   El cron de Fase 6 detecta filas con recovery_stage < 3 y
//   created_at > 30min sin convertirse en orden, y dispara la secuencia de emails.
//   Al completar una orden, marcar recovered: true para detener la secuencia.

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import type { CartItem } from "@/types/cart";

const STORAGE_KEY = "lc_cart";

export type ShippingZone = "local" | "nacional";

export const DEFAULT_THRESHOLDS: Record<ShippingZone, number> = {
  local: 45000,
  nacional: 90000,
};

// ─── State & Actions ──────────────────────────────────────────────────────────

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  hydrated: boolean;
  zone: ShippingZone;
}

type Action =
  | { type: "HYDRATE"; items: CartItem[]; zone: ShippingZone }
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; variantId: string }
  | { type: "UPDATE_QTY"; variantId: string; qty: number }
  | { type: "CLEAR" }
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "SET_ZONE"; zone: ShippingZone };

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, items: action.items, zone: action.zone, hydrated: true };

    case "ADD": {
      const idx = state.items.findIndex(
        (i) => i.variantId === action.item.variantId
      );
      if (idx >= 0) {
        return {
          ...state,
          items: state.items.map((i, n) =>
            n === idx
              ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.item] };
    }

    case "REMOVE":
      return {
        ...state,
        items: state.items.filter((i) => i.variantId !== action.variantId),
      };

    case "UPDATE_QTY": {
      if (action.qty <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.variantId !== action.variantId),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.variantId === action.variantId
            ? { ...i, quantity: Math.min(action.qty, i.stock) }
            : i
        ),
      };
    }

    case "CLEAR":
      return { ...state, items: [] };

    case "OPEN":
      return { ...state, isOpen: true };

    case "CLOSE":
      return { ...state, isOpen: false };

    case "SET_ZONE":
      return { ...state, zone: action.zone };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CartCtx {
  items: CartItem[];
  isOpen: boolean;
  hydrated: boolean;
  itemCount: number;
  subtotal: number;
  zone: ShippingZone;
  /** Umbrales de envío gratis por zona — viene de shipping_zones en Supabase */
  thresholds: Record<ShippingZone, number>;
  setZone: (zone: ShippingZone) => void;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, qty: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartCtx | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface CartProviderProps {
  children: React.ReactNode;
  /** Zona detectada por el servidor (headers de Vercel). El usuario puede cambiarla. */
  initialZone?: ShippingZone;
  /** Umbrales leídos de shipping_zones en Supabase. Fallback a DEFAULT_THRESHOLDS. */
  thresholds?: Record<ShippingZone, number>;
}

export function CartProvider({
  children,
  initialZone = "local",
  thresholds = DEFAULT_THRESHOLDS,
}: CartProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    items: [],
    isOpen: false,
    hydrated: false,
    zone: initialZone,
  });

  // Hidratar desde localStorage.
  // Formato nuevo: { items: CartItem[], zone: ShippingZone }
  // Formato viejo (Fase 4): CartItem[] — compatibilidad hacia atrás
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Formato viejo
          dispatch({ type: "HYDRATE", items: parsed, zone: initialZone });
        } else {
          dispatch({
            type: "HYDRATE",
            items: parsed.items ?? [],
            // La zona guardada tiene prioridad sobre la detección del servidor
            zone: (parsed.zone as ShippingZone) ?? initialZone,
          });
        }
      } else {
        dispatch({ type: "HYDRATE", items: [], zone: initialZone });
      }
    } catch {
      dispatch({ type: "HYDRATE", items: [], zone: initialZone });
    }
  // initialZone es estable dentro del ciclo de vida; no necesita re-ejecutarse
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persistir items + zona en localStorage
  useEffect(() => {
    if (!state.hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items: state.items, zone: state.zone })
      );
    } catch {}
  }, [state.items, state.zone, state.hydrated]);

  const addItem = useCallback(
    (item: CartItem) => dispatch({ type: "ADD", item }),
    []
  );
  const removeItem = useCallback(
    (variantId: string) => dispatch({ type: "REMOVE", variantId }),
    []
  );
  const updateQuantity = useCallback(
    (variantId: string, qty: number) =>
      dispatch({ type: "UPDATE_QTY", variantId, qty }),
    []
  );
  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const openCart = useCallback(() => dispatch({ type: "OPEN" }), []);
  const closeCart = useCallback(() => dispatch({ type: "CLOSE" }), []);
  const setZone = useCallback(
    (zone: ShippingZone) => dispatch({ type: "SET_ZONE", zone }),
    []
  );

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        hydrated: state.hydrated,
        itemCount,
        subtotal,
        zone: state.zone,
        thresholds,
        setZone,
        addItem,
        removeItem,
        updateQuantity,
        clear,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
