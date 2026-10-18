export function track(type: "view" | "whatsapp" | "contact", propertyId?: string) {
  if (!propertyId) return;
  try {
    const body = JSON.stringify({ type, propertyId });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    else fetch("/api/track", { method: "POST", body, keepalive: true });
  } catch {}
}
