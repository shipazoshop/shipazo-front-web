"use client";

import HeaderLight from "@/presentation/components/headers/HeaderLight";
import Details2 from "@/presentation/components/product-detail/Details2";
import FooterLight from "@/presentation/components/footers/FooterLight";
import React, { useEffect, Suspense, useRef } from "react";
import { useProductStore } from "../../../../application/state/product";
import { useSearchParams, useRouter } from "next/navigation";
import { useProductRepository } from "@/presentation";
import { LoadingScreen } from "@/presentation/components/common/LoadingScreen";
import { ApiError } from "@/domain";
import { useShowSnackbar } from "@/application/stores/useSnackbarStore";

function ProductDetailContent() {
  const { product, setProduct } = useProductStore();
  const searchParams = useSearchParams();
  const productUrl = searchParams.get("url");
  const fetchedUrlRef = useRef<string | null>(null);
  const router = useRouter();
  const showSnackbar = useShowSnackbar();

  const { importProductFromUrl } = useProductRepository();
  const { mutateAsync, isLoading } = importProductFromUrl();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productUrl || fetchedUrlRef.current === productUrl) return;
      if (product?.url === productUrl) {
        fetchedUrlRef.current = productUrl;
        return;
      }
      try {
        fetchedUrlRef.current = productUrl;
        const decodedUrl = decodeURIComponent(productUrl);
        const result = await mutateAsync({ url: decodedUrl });
        setProduct(result);
      } catch (err) {
        handleError(err as ApiError);
        fetchedUrlRef.current = null;
      }
    };
    fetchProduct();
  }, [productUrl, mutateAsync, setProduct]);

  const handleError = (error: ApiError) => {
    if (error.message?.includes("404")) {
      showSnackbar("Ups! No encontramos tu producto, verifica que sea una URL válida", "error");
    } else {
      showSnackbar("Ups! Hubo un error al obtener tu producto, inténtalo más tarde", "error");
    }
    router.push("/home");
  };

  if (isLoading || (!product && productUrl)) {
    return (
      <div style={{ background: "#FAF7F2", minHeight: "100vh" }}>
        <HeaderLight />
        <LoadingScreen show={true} />
      </div>
    );
  }

  return (
    <div style={{ background: "#FAF7F2", minHeight: "100vh" }}>
      <HeaderLight />
      <Details2 product={product} />
      <FooterLight />
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <div style={{ background: "#FAF7F2", minHeight: "100vh" }}>
          <HeaderLight />
          <LoadingScreen show={true} />
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  );
}
