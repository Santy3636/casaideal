"use client";
import { track } from "@/lib/track";
import { waLink, waMessage } from "@/lib/utils";
import type { Property } from "@/lib/types";
export default function WhatsAppFloat({ number, base, property }: { number: string; base: string; property?: Property }) {
  return (
    <a href={waLink(number, waMessage(base, property))} target="_blank" rel="noopener" aria-label="Escribir por WhatsApp"
       onClick={() => track("whatsapp", property?.id)}
       className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-card transition hover:scale-110">
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M9 10c.5 2 2.500 4 5 5l1.500-1.500-2-1-1 .8c-.8-.4-1.600-1.200-2-2l.8-1-1-2Z"/></svg>
    </a>
  );
}
