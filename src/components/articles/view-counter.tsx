"use client";

import { useEffect, useRef } from "react";
import { incrementView } from "@/app/actions/views";

export function ViewCounter({ slug }: { slug: string }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    incrementView(slug);
  }, [slug]);

  return null;
}
