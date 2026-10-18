import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
export async function GET(req: Request) {
  const u = new URL(req.url); const code = u.searchParams.get("code"); const next = u.searchParams.get("next") || "/admin";
  if (code) await supabaseServer().auth.exchangeCodeForSession(code);
  return NextResponse.redirect(new URL(next.startsWith("/admin") ? next : "/admin", u.origin));
}
