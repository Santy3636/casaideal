import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import BarChart from "@/components/BarChart";
export default async function Dashboard() {
  const sb = supabaseServer();
  const count = async (q: any) => (await q).count ?? 0;
  const head = { count: "exact" as const, head: true };
  const since = new Date(Date.now() - 14 * 864e5).toISOString();
  const [act, sold, rent, feat, leads, wa, ev, top] = await Promise.all([
    count(sb.from("properties").select("id", head).in("status", ["disponible", "reservada"]).eq("published", true)),
    count(sb.from("properties").select("id", head).eq("status", "vendida")),
    count(sb.from("properties").select("id", head).eq("status", "arrendada")),
    count(sb.from("properties").select("id", head).eq("featured", true).in("status", ["disponible", "reservada"])),
    count(sb.from("leads").select("id", head)),
    count(sb.from("property_events").select("id", head).eq("type", "whatsapp")),
    sb.from("property_events").select("type,created_at").gte("created_at", since).limit(20000),
    sb.from("property_stats").select("*").order("views", { ascending: false }).limit(5),
  ]);
  const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(Date.now() - (13 - i) * 864e5); return { key: d.toISOString().slice(0, 10), label: `${d.getDate()}/${d.getMonth() + 1}`, a: 0, b: 0 }; });
  (ev.data ?? []).forEach((e: any) => { const d = days.find((x) => x.key === e.created_at.slice(0, 10)); if (d) { if (e.type === "view") d.a++; if (e.type === "whatsapp") d.b++; } });
  const cards: [string, number][] = [["Activas", act], ["Vendidas", sold], ["Arrendadas", rent], ["Destacadas", feat], ["Consultas recibidas", leads], ["Clicks WhatsApp", wa]];
  return (<div className="space-y-8"><div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Dashboard</h1><Link href="/admin/propiedades/nueva" className="btn-primary">＋ Nueva propiedad</Link></div>
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">{cards.map(([k, v]) => <div key={k} className="card p-5"><p className="text-3xl font-extrabold text-navy">{v}</p><p className="text-xs">{k}</p></div>)}</div>
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="card p-6"><h2 className="mb-4 font-bold">Actividad · últimos 14 días</h2><BarChart data={days} keys={["Visitas", "Clicks WhatsApp"]} /></div>
      <div className="card p-6"><h2 className="mb-4 font-bold">Propiedades más vistas</h2>
        <ol className="space-y-3">{(top.data ?? []).map((t: any) => { const m = Math.max(1, (top.data as any[])[0].views); return <li key={t.id}><div className="flex justify-between text-sm"><Link href={`/propiedades/${t.slug}`} className="font-medium text-navy">{t.title}</Link><span>{t.views} vistas · {t.whatsapp} WA</span></div><div className="mt-1 h-2 rounded-full bg-soft"><div className="h-2 rounded-full bg-brand" style={{ width: `${(t.views / m) * 100}%` }} /></div></li>; })}</ol></div></div></div>);
}
