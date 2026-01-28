"use client";
import Header4 from "@/presentation/components/headers/Header4";
import Details1 from "@/presentation/components/product-detail/Details1";
import React, { useEffect, Suspense, useRef } from "react";
import Link from "next/link";
import { useProductStore } from "../../../../application/state/product";
import { useSearchParams } from "next/navigation";
import { useProductRepository } from "@/presentation";
import { LoadingScreen } from "@/presentation/components/common/LoadingScreen";

function ProductDetailContent() {
  const { product, setProduct } = useProductStore();
  const searchParams = useSearchParams();
  const productUrl = searchParams.get('url');
  const fetchedUrlRef = useRef<string | null>(null);

  const { importProductFromUrl } = useProductRepository();
  const { mutateAsync, isLoading } = importProductFromUrl();

  useEffect(() => {
    const fetchProduct = async () => {
      // Evitar fetch si ya se hizo para esta URL
      if (!productUrl || fetchedUrlRef.current === productUrl) {
        return;
      }

      // Si ya hay un producto con la misma URL, no hacer fetch
      if (product?.url === productUrl) {
        fetchedUrlRef.current = productUrl;
        return;
      }

      try {
        fetchedUrlRef.current = productUrl;
        const decodedUrl = decodeURIComponent(productUrl);
        const result = await mutateAsync({ url: decodedUrl });
        setProduct(result);
      } catch (error) {
        console.error("❌ Error al cargar producto:", error);
        fetchedUrlRef.current = null; // Reset para permitir retry
      }
    };

    fetchProduct();
  }, [productUrl, mutateAsync, setProduct]);

  // Mostrar loading mientras se hace el fetch
  if (isLoading || (!product && productUrl)) {
    return (
      <>
        <Header4 />
        <LoadingScreen show={true} />
      </>
    );
  }

  return (
    <>
      <Header4 />
      <div className="tf-sp-1">
        <div className="container">
          <ul className="breakcrumbs">
            <li>
              <Link href={`/`} className="body-small link">
                {" "}
                Home{" "}
              </Link>
            </li>
            <li className="d-flex align-items-center">
              <i className="icon icon-arrow-right" />
            </li>
            <li>
              <Link href={`/product-grid`} className="body-small link">
                {" "}
                Shop{" "}
              </Link>
            </li>
            <li className="d-flex align-items-center">
              <i className="icon icon-arrow-right" />
            </li>
            <li>
              <span className="body-small">Product Detail</span>
            </li>
          </ul>
        </div>
      </div>
      <Details1 product={product} />
    </>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={
      <>
        <Header4 />
        <LoadingScreen show={true} />
      </>
    }>
      <ProductDetailContent />
    </Suspense>
  );
}

