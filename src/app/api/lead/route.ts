import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabase/server";
const cut = (v: unknown, n: number) => String(v ?? "").slice(0, n);
export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b || !cut(b.name, 120).trim() || (!cut(b.phone, 40).trim() && !cut(b.email, 120).trim())) return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  const sb = supabasePublic();
  const { error } = await sb.from("leads").insert({ property_id: b.propertyId || null, name: cut(b.name, 120), phone: cut(b.phone, 40), email: cut(b.email, 120), message: cut(b.message, 2000), intent: cut(b.intent, 20) });
  if (error) return NextResponse.json({ error: "No se pudo guardar" }, { status: 500 });
  if (b.propertyId) await sb.from("property_events").insert({ type: "contact", property_id: b.propertyId });
  return NextResponse.json({ ok: true });
}
