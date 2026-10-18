import { supabasePublic } from "./supabase/server";
import { DEFAULT_SETTINGS, sortProps } from "./utils";
import type { Property, Settings } from "./types";
export async function getSettings(): Promise<Settings> {
  const { data } = await supabasePublic().from("site_settings").select("*").eq("id", 1).maybeSingle();
  return { ...DEFAULT_SETTINGS, ...(data ?? {}) };
}
export async function getProperties(): Promise<Property[]> {
  const { data } = await supabasePublic().from("properties").select("*").eq("published", true);
  return sortProps((data ?? []) as Property[]);
}
export async function getBySlug(slug: string): Promise<Property | null> {
  const { data } = await supabasePublic().from("properties").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  return (data as Property) ?? null;
}
