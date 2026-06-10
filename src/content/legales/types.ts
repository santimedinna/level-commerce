// Tipos compartidos para el contenido de páginas legales.

export type Block =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

export interface LegalSection {
  title: string;
  blocks: Block[];
}

export interface LegalContent {
  title: string;
  subtitle?: string;
  lastUpdated: string;
  intro?: string;
  sections: LegalSection[];
}
