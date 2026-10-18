export type Status = "disponible" | "reservada" | "vendida" | "arrendada";
export interface Property {
  id: string; code: string; slug: string; title: string; price: number; currency: "CLP" | "UF" | "USD";
  operation: "venta" | "arriendo"; type: "casa" | "departamento" | "parcela" | "oficina" | "local" | "terreno";
  status: Status; featured: boolean; published: boolean;
  region: string | null; comuna: string | null; address: string | null;
  built_m2: number | null; total_m2: number | null; bedrooms: number | null; bathrooms: number | null; parking: number | null; storage: number | null;
  description: string | null; highlights: string[] | null; images: { url: string }[];
  video_url: string | null; tour_url: string | null; meta_title: string | null; meta_description: string | null; og_image: string | null; created_at: string;
}
export interface Settings { company: string; whatsapp: string; phone: string | null; email: string | null; address: string | null; default_message: string }
