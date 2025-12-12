"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ConfigurationsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir automáticamente a la página de direcciones
    router.replace("/configurations/address");
  }, [router]);

  return null;
}
