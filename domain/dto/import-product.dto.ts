export interface ImportFromUrlDto {
    url: string;
};

export interface IImportProductResponse {
    success: boolean;
    url: string;
    product_id: string;
    productData: IProductData;
}

export interface IProductData {
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
}

export interface IPriceDetails {
    base_price_usd: string;
    taxes: ITaxes;
    operational_costs: IOperationalCosts;
    final_price: string;
}

export interface IOperationalCosts {
    flete: string;
    dai: string;
    iva: string;
    servicio_calshop: string;
    comision_parcela: string;
    valor_cif: string;
}

export interface ITaxes {
    duty_rate: string;
}