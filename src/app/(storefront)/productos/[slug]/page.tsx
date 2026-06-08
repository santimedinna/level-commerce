interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductoDetallePage({ params }: Props) {
  const { slug } = await params;

  return (
    <main className="px-6 py-12">
      <h1 className="font-display text-4xl font-semibold" style={{ color: "var(--color-ink)" }}>
        Producto: {slug}
      </h1>
      <p className="font-body text-base mt-4" style={{ color: "var(--color-ink-soft)" }}>
        Detalle, selector de variante y stock — Fase 3
      </p>
    </main>
  );
}
