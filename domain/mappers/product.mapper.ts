import type { IImportProductResponse } from "../dto/import-product.dto";

/**
 * Representa un producto en el carrito de compras
 * Extiende IImportProductResponse para estandarizar interfaces
 */
export interface CartProduct extends IImportProductResponse {
  quantity: number; // Cantidad que el usuario desea en el carrito
}

/**
 * Representa un producto en la lista de deseos (wishlist)
 * Es simplemente un IImportProductResponse sin campos adicionales
 */
export interface WishlistProduct extends IImportProductResponse {
  // No necesita campos adicionales, solo es para type safety
}

/**
 * Convierte un IImportProductResponse a CartProduct
 * Mantiene toda la estructura de IImportProductResponse y agrega quantity
 */
export function mapImportProductToCartProduct(
  importProduct: IImportProductResponse,
  quantity: number = 1
): CartProduct {
  return {
    ...importProduct,
    quantity,
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
 * Usa mapLegacyProductToImportProduct para mantener estandarización
 */
export function mapLegacyProductToCartProduct(
  legacyProduct: any,
  quantity: number = 1
): CartProduct {
  const importProduct = mapLegacyProductToImportProduct(legacyProduct);
  return mapImportProductToCartProduct(importProduct, quantity);
}

/**
 * Convierte un IImportProductResponse a WishlistProduct
 * Simplemente retorna el mismo objeto con el tipo WishlistProduct
 */
export function mapImportProductToWishlistProduct(
  importProduct: IImportProductResponse
): WishlistProduct {
  return importProduct;
}

/**
 * Convierte productos legacy (del constants) a WishlistProduct
 * Usa mapLegacyProductToImportProduct para mantener estandarización
 */
export function mapLegacyProductToWishlistProduct(
  legacyProduct: any
): WishlistProduct {
  const importProduct = mapLegacyProductToImportProduct(legacyProduct);
  return mapImportProductToWishlistProduct(importProduct);
}
