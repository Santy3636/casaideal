import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import Explorer from "@/components/Explorer";
import { getProperties } from "@/lib/data";
export const revalidate = 60;
export const metadata: Metadata = { title: "Propiedades en venta y arriendo", description: "Busca casas, departamentos, parcelas, oficinas, locales y terrenos." };
export default async function Page({ searchParams }: { searchParams: Record<string, string> }) {
  const items = await getProperties();
  return (<SiteShell><div className="mx-auto max-w-7xl px-5 py-12"><h1 className="mb-8 text-3xl font-bold">Propiedades</h1><Explorer items={items} initial={searchParams} /></div></SiteShell>);
}
