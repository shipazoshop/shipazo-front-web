"use client";
import { useProductRepository } from "@/presentation";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useProductStore } from "../../../application/state/product";

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
      <div className={`select-category ${activeDropdown ? "active" : ""}`}>
        <div
          onClick={() => setActiveDropdown(true)}
          className="tf-select-custom"
        >
          {activeCategory}
        </div>
        <ul
          className="select-options"
          style={{ display: activeDropdown ? "block" : "none" }}
        >
          <div className="header-select-option">
            <span>Select Categories</span>
            <span
              className="close-option"
              onClick={() => setActiveDropdown(false)}
            >
              <i className="icon-close"></i>
            </span>
          </div>
          {categories.map((item, index) => (
            <li
              rel={item.rel}
              onClick={() => {
                setActiveCategory(item.label);
                setActiveDropdown(false);
              }}
              key={index}
            >
              {item.label}
            </li>
          ))}
        </ul>
        <ul className="select-options">
          <li className="link" rel="">
            <span>All categories</span>
          </li>
          <li className="link" rel="apple-products">
            <span>Apple products</span>
          </li>
          <li className="link" rel="audio-equipments">
            <span>Audio Equipments</span>
          </li>
          <li className="link" rel="camera-video">
            <span>Camera &amp; Video</span>
          </li>
          <li className="link" rel="game-room-furniture">
            <span>Game &amp; Room Furniture</span>
          </li>
          <li className="link" rel="gaming-accessories">
            <span>Gaming Accessories</span>
          </li>
          <li className="link" rel="headphone">
            <span>Headphone</span>
          </li>
          <li className="link" rel="laptop-tablet">
            <span>Laptop &amp; Tablet</span>
          </li>
          <li className="link" rel="server-workstation">
            <span>Server &amp; Workstation</span>
          </li>
          <li className="link" rel="smartphone">
            <span>Smartphone</span>
          </li>
          <li className="link" rel="smartwatch">
            <span>Smartwatch</span>
          </li>
          <li className="link" rel="storage-digital-devices">
            <span>Storage &amp; Digital Devices</span>
          </li>
          <li className="link" rel="tv-computer-screen">
            <span>TV &amp; Computer Screen</span>
          </li>
        </ul>
      </div>
      <span className="br-line type-vertical bg-line"></span>
      <fieldset>
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search for products" />
      </fieldset>
      <button
        onClick={handleClientScriptLoad}
        className="btn-submit-form"
        disabled={isLoading}
        type="button"
      >
        {isLoading ? <i className="icon-spinner"></i> : <i className="icon-search"></i>}
      </button>
      {errorMessage && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '8px',
          padding: '12px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          color: '#c33',
          fontSize: '14px',
          zIndex: 1000
        }}>
          {errorMessage}
        </div>
      )}

    </form>
  );
}
