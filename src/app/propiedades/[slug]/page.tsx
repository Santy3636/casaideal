import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import Gallery from "@/components/Gallery";
import ContactPanel from "@/components/ContactPanel";
import ViewTracker from "@/components/ViewTracker";
import PropertyCard from "@/components/PropertyCard";
import { getBySlug, getProperties, getSettings } from "@/lib/data";
import { SITE, TYPES, STATUS, cover, embedUrl, formatPrice, isClosed } from "@/lib/utils";
export const revalidate = 60;
type Ctx = { params: { slug: string } };
export async function generateMetadata({ params }: Ctx): Promise<Metadata> {
  const p = await getBySlug(params.slug); if (!p) return {};
  const title = p.meta_title || `${p.title} – ${TYPES[p.type]} en ${p.operation}${p.comuna ? ` en ${p.comuna}` : ""}`;
  const description = p.meta_description || (p.description ?? "").slice(0, 155);
  const img = p.og_image || cover(p);
  return { title, description, alternates: { canonical: `/propiedades/${p.slug}` }, openGraph: { title, description, type: "website", url: `${SITE}/propiedades/${p.slug}`, images: [{ url: img }] }, twitter: { card: "summary_large_image", title, description, images: [img] } };
}
export default async function Page({ params }: Ctx) {
  const [p, all, s] = await Promise.all([getBySlug(params.slug), getProperties(), getSettings()]);
  if (!p) notFound();
  const closed = isClosed(p);
  const related = all.filter((x) => x.id !== p.id && (x.comuna === p.comuna || x.type === p.type) && !isClosed(x)).slice(0, 3);
  const mapQ = encodeURIComponent([p.address, p.comuna, p.region, "Chile"].filter(Boolean).join(", "));
  const video = embedUrl(p.video_url), tour = embedUrl(p.tour_url);
  const ld = { "@context": "https://schema.org", "@type": ["Product", "RealEstateListing"], name: p.title, description: p.description, image: p.images.map((i) => i.url), sku: p.code, url: `${SITE}/propiedades/${p.slug}`,
    offers: { "@type": "Offer", price: p.price, priceCurrency: p.currency === "UF" ? "CLF" : p.currency, availability: closed ? "https://schema.org/SoldOut" : "https://schema.org/InStock", url: `${SITE}/propiedades/${p.slug}` },
    contentLocation: { "@type": "Place", address: { "@type": "PostalAddress", streetAddress: p.address, addressLocality: p.comuna, addressRegion: p.region, addressCountry: "CL" } } };
  const facts: [string, string | number | null][] = [["Dormitorios", p.bedrooms], ["Baños", p.bathrooms], ["Estacionamientos", p.parking], ["Bodegas", p.storage], ["M² construidos", p.built_m2], ["M² totales", p.total_m2]];
  return (<SiteShell property={p}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    <ViewTracker id={p.id} />
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:grid-cols-[1fr_380px]">
      <div className="min-w-0 space-y-10">
        <div className="relative"><Gallery images={p.images} title={p.title} />
          {closed && <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-2xl border-[6px] border-white px-8 py-2 text-4xl font-extrabold uppercase tracking-widest text-white drop-shadow-lg sm:text-6xl">{STATUS[p.status]}</div>}</div>
        <section>
          <div className="mb-3 flex flex-wrap gap-2 text-xs font-semibold"><span className="rounded-full bg-soft px-3 py-1">{TYPES[p.type]}</span><span className="rounded-full bg-soft px-3 py-1">{p.operation === "venta" ? "Venta" : "Arriendo"}</span><span className="rounded-full bg-soft px-3 py-1">Cód. {p.code}</span>{p.status === "reservada" && <span className="rounded-full bg-amber-400 px-3 py-1 text-navy">Reservada</span>}</div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">{p.title}</h1>
          <p className="mt-2">{[p.address, p.comuna, p.region].filter(Boolean).join(", ")}</p>
          <p className="mt-4 text-3xl font-extrabold text-brand">{formatPrice(p)}</p>
        </section>
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">{facts.filter(([, v]) => v).map(([k, v]) => <div key={k} className="card p-4"><p className="text-2xl font-bold text-navy">{v}</p><p className="text-xs">{k}</p></div>)}</section>
        {p.description && <section><h2 className="mb-3 text-xl font-bold">Descripción</h2><p className="whitespace-pre-line leading-relaxed">{p.description}</p></section>}
        {!!p.highlights?.length && <section><h2 className="mb-3 text-xl font-bold">Características destacadas</h2><ul className="grid gap-2 sm:grid-cols-2">{p.highlights.map((h) => <li key={h} className="flex gap-2 rounded-2xl bg-white p-3 shadow-card text-sm"><span className="text-brand">✓</span>{h}</li>)}</ul></section>}
        {video && <section><h2 className="mb-3 text-xl font-bold">Video</h2><iframe src={video} title="Video" loading="lazy" allowFullScreen className="aspect-video w-full rounded-3xl" /></section>}
        {tour && <section><h2 className="mb-3 text-xl font-bold">Tour virtual</h2><iframe src={tour} title="Tour virtual" loading="lazy" allowFullScreen className="aspect-video w-full rounded-3xl" /></section>}
        {(p.address || p.comuna) && <section><h2 className="mb-3 text-xl font-bold">Ubicación</h2><iframe title="Mapa" loading="lazy" src={`https://www.google.com/maps?q=${mapQ}&output=embed`} className="h-80 w-full rounded-3xl border-0" /></section>}
      </div>
      <aside>{closed ? <div className="card p-6 text-center"><p className="font-bold text-navy">Esta propiedad ya fue {p.status === "vendida" ? "vendida" : "arrendada"}</p><p className="mt-2 text-sm">Te ayudamos a encontrar una similar.</p><a className="btn-primary mt-4 w-full" href="/propiedades">Ver propiedades disponibles</a></div>
        : <ContactPanel p={p} whatsapp={s.whatsapp} base={s.default_message} />}</aside>
    </div>
    {related.length > 0 && <section className="mx-auto max-w-7xl px-5"><h2 className="mb-6 text-2xl font-bold">Propiedades relacionadas</h2><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((r) => <PropertyCard key={r.id} p={r} />)}</div></section>}
  </SiteShell>);
}
