import type { Property, Settings } from "./types";
export const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const TYPES: Record<string, string> = { casa: "Casa", departamento: "Departamento", parcela: "Parcela", oficina: "Oficina", local: "Local comercial", terreno: "Terreno" };
export const OPS: Record<string, string> = { venta: "Venta", arriendo: "Arriendo" };
export const STATUS: Record<string, string> = { disponible: "Disponible", reservada: "Reservada", vendida: "Vendida", arrendada: "Arrendada" };
export const REGIONES = ["Arica y Parinacota","Tarapacá","Antofagasta","Atacama","Coquimbo","Valparaíso","Metropolitana de Santiago","O'Higgins","Maule","Ñuble","Biobío","La Araucanía","Los Ríos","Los Lagos","Aysén","Magallanes"];
export const DEFAULT_SETTINGS: Settings = { company: "Casa Ideal", whatsapp: "56900000000", phone: null, email: null, address: null, default_message: "Hola, me interesa esta propiedad y me gustaría recibir más información." };
export const isClosed = (p: Pick<Property, "status">) => p.status === "vendida" || p.status === "arrendada";
export function formatPrice(p: Pick<Property, "price" | "currency">) {
  const n = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 }).format(p.price);
  return p.currency === "UF" ? `UF ${n}` : p.currency === "USD" ? `US$ ${n}` : `$ ${n}`;
}
// Orden: destacadas disponibles → disponibles → reservadas → vendidas/arrendadas (siempre al final)
export const rank = (p: Property) => isClosed(p) ? 3 : p.status === "reservada" ? 2 : p.featured ? 0 : 1;
export const sortProps = (l: Property[]) => [...l].sort((a, b) => rank(a) - rank(b) || +new Date(b.created_at) - +new Date(a.created_at));
export const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export const waLink = (number: string, text: string) => `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
export function waMessage(base: string, p?: Pick<Property, "title" | "code" | "slug">, extra?: string) {
  if (!p) return extra ? `${extra}` : base;
  return `${extra ?? base}\n\nPropiedad: ${p.title}\nCódigo: ${p.code}\n${SITE}/propiedades/${p.slug}`;
}
export const cover = (p: Property) => p.images?.[0]?.url || "/hero.jpg";
export function embedUrl(u?: string | null) {
  if (!u) return null;
  const y = u.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/); if (y) return `https://www.youtube.com/embed/${y[1]}`;
  const v = u.match(/vimeo\.com\/(\d+)/); if (v) return `https://player.vimeo.com/video/${v[1]}`;
  return u;
}
