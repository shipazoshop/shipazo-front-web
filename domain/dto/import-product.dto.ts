export interface ImportFromUrlDto {
    url: string;
};

export interface IImportProductResponse {
    success:     boolean;
    url:         string;
    store:       string;
    productData: ProductData;
}

export interface ProductData {
    product_id:        string;
    title:             string;
    description:       string;
    price:             number;
    currency:          string;
    brand:             string;
    categoria:         string;
    stock:             boolean;
    weight:            null;
    calculated_weight: null;
    dimensions:        null;
    images:            string[];
    price_details:     PriceDetails;
}

export interface PriceDetails {
    calculatedPriceGtq: number;
    priceBreakdown:     PriceBreakdown;
}

export interface PriceBreakdown {
    priceUsd: number;
    exchangeRate: number;
    baseGtq: number;
    weightLb: number;
    shippingCost: number;
    insuranceCost: number;
    cif: number;
    category: string;
    daiPercentage: number;
    dai: number;
    ivaPercentage: number;
    iva: number;
    clearanceCost: number;
    calshopServiceFee: number;
    paymentFee: number;
    totalFees: number;
    totalGtq: number;
}