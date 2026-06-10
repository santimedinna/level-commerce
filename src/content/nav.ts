import { brand } from "./brand";

// Contenido y estructura de la navegación.
// Modificar links[] para agregar categorías o secciones propias de cada marca.

export const navContent = {
  logoLabel: brand.name,
  logoHref: "/",

  // Links de navegación principal
  // [DEMO] Agregar categorías propias cuando la marca las tenga
  links: [{ label: "Productos", href: "/productos" }],

  search: {
    label: "Buscar productos",
    href: "/productos",
  },

  favorites: {
    label: "Favoritos",
    href: "/favoritos",
  },

  mobileMenuAriaLabel: "Abrir menú de navegación",
  closeMenuAriaLabel: "Cerrar menú",
};
