"use client";

// Favoritos del invitado: persisten en localStorage sin requerir cuenta.
// Cuando haya auth, sincronizar con la tabla `favorites` de Supabase:
//   - al cargar: GET supabase.from("favorites").select().eq("user_id", session.user.id)
//     → merge con localStorage, resolver conflictos por fecha
//   - toggle: upsert/delete en la tabla además de actualizar estado local
//   - al cerrar sesión: vaciar estado (mantener localStorage para continuidad)
// Por ahora toda la lógica es local; la integración con Supabase va en la Fase de Auth.

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const STORAGE_KEY = "lc_favorites";

interface FavoritesCtx {
  ids: string[];
  hydrated: boolean;
  toggle: (id: string) => void;
  isFavorited: (id: string) => boolean;
  count: number;
}

const FavoritesContext = createContext<FavoritesCtx | null>(null);

export function FavoritesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {
      // localStorage puede estar bloqueado en modo privado muy restrictivo
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {}
  }, [ids, hydrated]);

  const toggle = useCallback((id: string) => {
    setIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  }, []);

  const isFavorited = useCallback(
    (id: string) => ids.includes(id),
    [ids]
  );

  return (
    <FavoritesContext.Provider
      value={{ ids, hydrated, toggle, isFavorited, count: ids.length }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites debe usarse dentro de FavoritesProvider");
  return ctx;
}
