"use client";
import { useEffect } from "react";
import { track } from "@/lib/track";
export default function ViewTracker({ id }: { id: string }) { useEffect(() => { track("view", id); }, [id]); return null; }
