import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabase/server";
export async function POST(req: Request) {
  try {
    const { type, propertyId } = await req.json();
    if (!["view", "whatsapp", "contact"].includes(type) || !/^[0-9a-f-]{36}$/.test(propertyId)) return NextResponse.json({ ok: false }, { status: 400 });
    await supabasePublic().from("property_events").insert({ type, property_id: propertyId });
  } catch {}
  return NextResponse.json({ ok: true });
}
