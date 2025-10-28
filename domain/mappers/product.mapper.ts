import type { IImportProductResponse } from "../dto/import-product.dto";

/**
 * Representa un producto en el carrito de compras
 */
export interface CartProduct {
  id: string; // Ahora es string para soportar product_id
  title: string;
  description?: string;
  price: number; // Precio en número
  currency: string;
  brand?: string;
  stock: boolean;
  weight?: string;
  dimensions?: string;
  images: string[];
  imgSrc: string; // Imagen principal (primera imagen)
  imgHover?: string; // Segunda imagen para hover
  quantity: number; // Cantidad en el carrito
  // Detalles de precio
  priceDetails?: {
    basePriceUsd: string;
    exchangeRate: string;
    basePriceGtq: string;
    taxes: { dutyRate: string };
    operationalCosts: {
      flete: string;
      dai: string;
      iva: string;
      servicioCalshop: string;
      comisionParcela: string;
      valorCif: string;
    };
    finalPrice: string;
  };
}

/**
 * Convierte un IImportProductResponse a CartProduct
 */
export function mapImportProductToCartProduct(
  importProduct: IImportProductResponse,
  quantity: number = 1
): CartProduct {
  const { productData } = importProduct;

  return {
    id: productData.product_id,
    title: productData.title,
    description: productData.description,
    price: productData.price,
    currency: productData.currency,
    brand: productData.brand,
    stock: productData.stock,
    weight: String(productData.weight ?? ''),
    dimensions: productData.dimensions,
    images: productData.images || [],
    imgSrc: productData.images?.[0] || "/images/product/default.jpg",
    imgHover: productData.images?.[1],
    quantity,
    priceDetails: productData.price_details ? {
      basePriceUsd: productData.price_details.priceBreakdown.priceUsd.toString(),
      exchangeRate: productData.price_details.priceBreakdown.exchangeRate.toString(),
      basePriceGtq: productData.price_details.priceBreakdown.baseGtq.toString(),
      taxes: {
        dutyRate: productData.price_details.priceBreakdown.daiPercentage.toString(),
      },
      operationalCosts: {
        flete: productData.price_details.priceBreakdown.shippingCost.toString(),
        dai: productData.price_details.priceBreakdown.dai.toString(),
        iva: productData.price_details.priceBreakdown.iva.toString(),
        servicioCalshop: productData.price_details.priceBreakdown.calshopServiceFee.toString(),
        comisionParcela: productData.price_details.priceBreakdown.paymentFee.toString(),
        valorCif: productData.price_details.priceBreakdown.cif.toString(),
      },
      finalPrice: productData.price_details.priceBreakdown.totalGtq.toString(),
    } : undefined,
  };
}

/**
 * Convierte productos legacy (del constants) a IImportProductResponse
 * Esto mantiene compatibilidad con los productos existentes
 */
export function mapLegacyProductToImportProduct(
  legacyProduct: any
): IImportProductResponse {
  const price = legacyProduct.price || 0;
  return {
    success: true,
    url: "",
    productData: {
      product_id: String(legacyProduct.id),
      title: legacyProduct.title || "",
      description: legacyProduct.description || "",
      price: price,
      currency: "USD",
      brand: legacyProduct.brand || "",
      categoria: "",
      stock: true,
      weight: null,
      dimensions: legacyProduct.dimensions || "",
      images: legacyProduct.thumbImages || [legacyProduct.imgSrc] || [],
      price_details: {
        original_price: String(price),
        discount: "0",
        calculatedPriceGtq: price * 7.8, // Tasa de cambio aproximada
        priceBreakdown: {
          priceUsd: price,
          exchangeRate: 7.8,
          baseGtq: price * 7.8,
          weightLb: 0,
          shippingCost: 0,
          insuranceCost: 0,
          cif: price * 7.8,
          category: "",
          daiPercentage: 0,
          dai: 0,
          ivaPercentage: 0,
          iva: 0,
          clearanceCost: 0,
          calshopServiceFee: 0,
          paymentFee: 0,
          totalFees: 0,
          totalGtq: price * 7.8,
        },
      },
    },
  };
}

/**
 * Convierte productos legacy (del constants) a CartProduct
 * Esto mantiene compatibilidad con los productos existentes
 * @deprecated Use mapLegacyProductToImportProduct + mapImportProductToCartProduct instead
 */
export function mapLegacyProductToCartProduct(
  legacyProduct: any,
  quantity: number = 1
): CartProduct {
  return {
    id: String(legacyProduct.id), // Convertir número a string
    title: legacyProduct.title || "",
    description: legacyProduct.description,
    price: legacyProduct.price || 0,
    currency: "USD",
    brand: legacyProduct.brand,
    stock: true,
    weight: legacyProduct.weight,
    dimensions: legacyProduct.dimensions,
    images: legacyProduct.thumbImages || [legacyProduct.imgSrc],
    imgSrc: legacyProduct.imgSrc || "/images/product/default.jpg",
    imgHover: legacyProduct.imgHover,
    quantity,
  };
}
