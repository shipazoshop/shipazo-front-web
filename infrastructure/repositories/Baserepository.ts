import { apiGet, ApiGetParams } from "../api/client";


export abstract class BaseRepository {
    protected async get<T>(params: Omit<ApiGetParams, 'authToken'>): Promise<T> {
        return await apiGet<T>(params);
    }

    protected handleError(error: any): never {
        if (error.response?.status === 401) {
            // TODO: customizar errores
        }
        throw error;
    }
}