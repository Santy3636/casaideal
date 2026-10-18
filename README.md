# Casa Ideal · Nueva plataforma (Next.js + Supabase)

Proyecto **independiente** del WordPress actual: no lo toca. Se despliega aparte (p. ej. Vercel en `nuevo.tucasaideal.cl`) y se puede cambiar el dominio principal cuando estés conforme.

## Puesta en marcha
1. Crea un proyecto en supabase.com → SQL Editor → pega y ejecuta `supabase/schema.sql`.
2. Authentication → Users → crea tu usuario, y ejecuta el `insert into admins ...` del final del SQL.
3. Authentication → URL Configuration: agrega tu dominio y `/auth/callback` como redirect.
4. `cp .env.example .env.local` y completa las claves. `npm install && npm run dev`.
5. Entra a `/admin`, ve a **Ajustes** y configura el WhatsApp.

## Estructura
- Público: `/`, `/propiedades` (filtros instantáneos), `/propiedades/[slug]`, `sitemap.xml`, `robots.txt`
- Admin (protegido por login + tabla `admins` + RLS): `/admin`, `/admin/propiedades`, `/admin/usuarios`, `/admin/ajustes`
