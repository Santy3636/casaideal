import { notFound } from "next/navigation";
import PropertyForm from "@/components/PropertyForm";
import { supabaseServer } from "@/lib/supabase/server";
export default async function Edit({ params }: { params: { id: string } }) {
  const { data } = await supabaseServer().from("properties").select("*").eq("id", params.id).maybeSingle();
  if (!data) notFound();
  return <div><h1 className="mb-6 text-2xl font-bold">Editar · {data.code}</h1><PropertyForm initial={data} comunas={[]} /></div>;
}
