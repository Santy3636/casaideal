const host = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/^https?:\/\//, "");
/** @type {import('next').NextConfig} */
module.exports = {
  images: { formats: ["image/avif","image/webp"], remotePatterns: host ? [{ protocol:"https", hostname: host }] : [] },
  poweredByHeader: false,
};
