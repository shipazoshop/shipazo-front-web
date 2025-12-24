"use client";
import Footer1 from "@/presentation/components/footers/Footer1";
import Header4 from "@/presentation/components/headers/Header4";
import Details1 from "@/presentation/components/product-detail/Details1";
import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useProductStore } from "../../../../application/state/product";
import { useSearchParams } from "next/navigation";
import { useProductRepository } from "@/presentation";
import { LoadingScreen } from "@/presentation/components/common/LoadingScreen";

function ProductDetailContent() {
  const { product, setProduct } = useProductStore();
  const searchParams = useSearchParams();
  const productUrl = searchParams.get('url');

  const { importProductFromUrl } = useProductRepository();
  const { mutateAsync, isLoading } = importProductFromUrl();

  useEffect(() => {
    const fetchProduct = async () => {
      // Si no hay producto en store pero hay URL en params, hacer fetch
      if (!product && productUrl || product && product.url !== productUrl) {
        try {
          const decodedUrl = decodeURIComponent(productUrl);
          const result = await mutateAsync({ url: decodedUrl });
          setProduct(result);
        } catch (error) {
          console.error("❌ Error al cargar producto:", error);
        }
      }
    };

    fetchProduct();
  }, [product, productUrl]);

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

