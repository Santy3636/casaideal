import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import AdminList from "@/components/AdminList";
export default async function List() {
  const { data } = await supabaseServer().from("properties").select("id,code,slug,title,price,currency,status,featured,published,images,operation,type,comuna,created_at").order("created_at", { ascending: false });
  return <div><div className="mb-6 flex items-center justify-between"><h1 className="text-2xl font-bold">Propiedades</h1><Link href="/admin/propiedades/nueva" className="btn-primary">＋ Nueva</Link></div><AdminList initial={(data ?? []) as any} /></div>;
}
