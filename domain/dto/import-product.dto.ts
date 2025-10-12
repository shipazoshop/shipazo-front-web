export interface ImportFromUrlDto {
    url: string;
};

export interface IPriceDetails {
    base_price_usd: string;
    exchange_rate: string;
    base_price_gtq: string;
    taxes: { duty_rate: string };
    operational_costs: IOperationalCost;
    final_price: string;
};

export interface IOperationalCost {

    flete: string;
    dai: string;
    iva: string;
    servicio_calshop: string;
    comision_parcela: string;
    valor_cif: string;

}

export interface IImportedProductData {
    title: string;
    description: string;
    price: string;
    currency: string;
    brand: string;
    stock: boolean;
    weight: string;
    dimensions: string;
    images: string[];
    price_details: IPriceDetails;
};

export interface IImportProductResponse {
    success: boolean;
    url: string;
    product_id: string;
    productData: IImportedProductData;
};
