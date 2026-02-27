"use client";
import { useProductRepository } from "@/presentation";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useProductStore } from "../../../application/state/product";
import { LoadingScreen } from "../common/LoadingScreen";

const categories = [
  { rel: "", label: "All categories" },
  { rel: "apple-products", label: "Apple products" },
  { rel: "audio-equipments", label: "Audio Equipments" },
  { rel: "camera-video", label: "Camera & Video" },
  { rel: "game-room-furniture", label: "Game & Room Furniture" },
  { rel: "gaming-accessories", label: "Gaming Accessories" },
  { rel: "headphone", label: "Headphone" },
  { rel: "laptop-tablet", label: "Laptop & Tablet" },
  { rel: "server-workstation", label: "Server & Workstation" },
  { rel: "smartphone", label: "Smartphone" },
  { rel: "smartwatch", label: "Smartwatch" },
  { rel: "storage-digital-devices", label: "Storage & Digital Devices" },
  { rel: "tv-computer-screen", label: "TV & Computer Screen" },
];

export default function SearchForm({
  parentClass = "form-search-product style-2",
  variant = "default",
}: {
  parentClass?: string;
  variant?: "default" | "orange";
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const navRef = useRef(null);

  const { setProduct } = useProductStore();
  const router = useRouter();

  const { importProductFromUrl } = useProductRepository();
  const { mutateAsync, isLoading } = importProductFromUrl();

  const handleClientScriptLoad = async () => {
    try {
      // Validar que sea una URL válida

      const result = await mutateAsync({ url: searchTerm });

      // Navegar primero para evitar delay, pasando la URL como query param
      const productUrl = encodeURIComponent(searchTerm);
      router.push(`/product-detail/${result.productData.product_id}?url=${productUrl}`);

      // Actualizar el store después (esto se hace en segundo plano)
      setProduct(result);
      setSearchTerm("");

    } catch (error: any) {
      console.error("❌ Error al importar producto:", error);
    }
  }

  const isOrange = variant === "orange";

  return (
    <form
      ref={navRef}
      onSubmit={(e) => e.preventDefault()}
      className={parentClass}
      style={{
        position: 'relative',
        ...(isOrange && { borderColor: '#ffffff' }),
      }}
    >
      <fieldset>
        <input
          className={isOrange ? "input-orange-variant" : undefined}
          style={{ ...(isOrange && { backgroundColor: 'var(--color-brand-orange)', color: 'white' }) }}
          type="text"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          placeholder='Cotiza tu producto ahora!' />
      </fieldset>
      <button
        onClick={handleClientScriptLoad}
        className="btn-submit-form"
        disabled={isLoading}
        type="button"
        style={isOrange ? { backgroundColor: '#ffffff', color: 'var(--color-brand-orange)' } : undefined}
      >
        <i className="icon-search"></i>
      </button >
      <LoadingScreen show={isLoading} />
    </form >
  );
}
