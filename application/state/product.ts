import { create, StateCreator } from "zustand";
import { IImportProductResponse } from "@/domain/dto/import-product.dto";
import { devtools } from "zustand/middleware";


interface IProductState {
    product: IImportProductResponse | null;
    setProduct: (product: IImportProductResponse) => void;
    clearProduct: () => void;
}

const storeProduct: StateCreator<IProductState> = (set) => ({
    product: null,
    setProduct: (product) => set({ product }),
    clearProduct: () => set({ product: null }),
});


export const useProductStore = create<IProductState>()(
    devtools(storeProduct)
);




