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
  const { product_id, productData } = importProduct;

  // Convertir precio de string a number
  const priceNumber = parseFloat(productData.price) || 0;

  return {
    id: product_id,
    title: productData.title,
    description: productData.description,
    price: priceNumber,
    currency: productData.currency,
    brand: productData.brand,
    stock: productData.stock,
    weight: productData.weight,
    dimensions: productData.dimensions,
    images: productData.images || [],
    imgSrc: productData.images?.[0] || "/images/product/default.jpg",
    imgHover: productData.images?.[1],
    quantity,
    priceDetails: productData.price_details ? {
      basePriceUsd: productData.price_details.base_price_usd,
      exchangeRate: productData.price_details.exchange_rate,
      basePriceGtq: productData.price_details.base_price_gtq,
      taxes: {
        dutyRate: productData.price_details.taxes.duty_rate,
      },
      operationalCosts: {
        flete: productData.price_details.operational_costs.flete,
        dai: productData.price_details.operational_costs.dai,
        iva: productData.price_details.operational_costs.iva,
        servicioCalshop: productData.price_details.operational_costs.servicio_calshop,
        comisionParcela: productData.price_details.operational_costs.comision_parcela,
        valorCif: productData.price_details.operational_costs.valor_cif,
      },
      finalPrice: productData.price_details.final_price,
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
  return {
    success: true,
    url: "",
    product_id: String(legacyProduct.id),
    productData: {
      title: legacyProduct.title || "",
      description: legacyProduct.description || "",
      price: String(legacyProduct.price || 0),
      currency: "USD",
      brand: legacyProduct.brand || "",
      stock: true,
      weight: legacyProduct.weight || "",
      dimensions: legacyProduct.dimensions || "",
      images: legacyProduct.thumbImages || [legacyProduct.imgSrc] || [],
      price_details: {
        base_price_usd: String(legacyProduct.price || 0),
        exchange_rate: "1",
        base_price_gtq: String(legacyProduct.price || 0),
        taxes: { duty_rate: "0" },
        operational_costs: {
          flete: "0",
          dai: "0",
          iva: "0",
          servicio_calshop: "0",
          comision_parcela: "0",
          valor_cif: String(legacyProduct.price || 0),
        },
        final_price: String(legacyProduct.price || 0),
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
