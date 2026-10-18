import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { brand:"#FB454C", brandDark:"#E8343A", navy:"#0F0F30", header:"#091330", ink:"#595970", line:"#DFDFE2", soft:"#F4F4F5", paper:"#FBFBFB" },
    fontFamily: { sans: ["var(--font-montserrat)","system-ui","sans-serif"] },
    boxShadow: { card:"0 10px 30px -12px rgba(15,15,48,.18)" },
    keyframes: { up:{from:{opacity:"0",transform:"translateY(12px)"},to:{opacity:"1",transform:"none"}}, pop:{from:{opacity:"0",transform:"scale(.96)"},to:{opacity:"1",transform:"none"}} },
    animation: { up:"up .5s ease both", pop:"pop .25s ease both" }
  } }, plugins: []
} satisfies Config;
