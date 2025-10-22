"use client";
import { useProductRepository } from "@/presentation";
import React, { useEffect, useRef, useState } from "react";
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
}) {
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navRef = useRef(null);

  const { setProduct } = useProductStore();
  const router = useRouter();

  const { importProductFromUrl } = useProductRepository();
  const { mutateAsync, isSuccess, isError, data, error, isLoading } = importProductFromUrl();


  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(false); // Close the menu
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Limpiar mensaje de error cuando el usuario cambia el término de búsqueda
  useEffect(() => {
    if (errorMessage) {
      setErrorMessage("");
    }
  }, [searchTerm]);

  const handleClientScriptLoad = async () => {
    try {
      setErrorMessage("");

      // Validar que sea una URL válida
      if (searchTerm && (searchTerm.startsWith("http://") || searchTerm.startsWith("https://"))) {
        const result = await mutateAsync({ url: searchTerm });

        console.log("✅ Producto importado:", result);
        setProduct(result);
        router.push(`/product-detail/${result.product_id}`);
        setSearchTerm("");
      } else {
        setErrorMessage("Por favor ingresa una URL válida (debe comenzar con http:// o https://)");
      }
    } catch (error: any) {
      console.error("❌ Error al importar producto:", error);

      // Mostrar mensaje de error amigable al usuario
      const errorMsg = error?.message || "Error desconocido al importar el producto";
      setErrorMessage(errorMsg);
    }
  }

  return (
    <form
      ref={navRef}
      onSubmit={(e) => e.preventDefault()}
      className={parentClass}
      style={{ position: 'relative' }}
    >
      <fieldset>
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search for products" />
      </fieldset>
      <button
        onClick={handleClientScriptLoad}
        className="btn-submit-form"
        disabled={isLoading}
        type="button"
      >
        <i className="icon-search"></i>
      </button>
      <LoadingScreen show={isLoading} />
    </form>
  );
}
