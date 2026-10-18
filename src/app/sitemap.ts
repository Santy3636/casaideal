import type { MetadataRoute } from "next";
import { getProperties } from "@/lib/data";
import { SITE } from "@/lib/utils";
export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items = await getProperties(); // incluye vendidas/arrendadas: siguen indexables
  return [{ url: SITE, changeFrequency: "daily", priority: 1 }, { url: `${SITE}/propiedades`, changeFrequency: "daily", priority: 0.9 },
    ...items.map((p) => ({ url: `${SITE}/propiedades/${p.slug}`, lastModified: p.created_at, priority: 0.7 }))];
}
