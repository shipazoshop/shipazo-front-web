import { UseMutationOptions } from '@tanstack/react-query';

export type MutationMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface MutationConfig<TData, TError, TVariables> {
    onSuccess?: (data: TData) => void;
    onError?: (error: TError) => void;
    onSettled?: () => void;
    invalidateQueries?: string[];
    updateCache?: {
        queryKey: string;
        updater: (oldData: any, newData: TData) => any;
    };
}

export class MutationService {
    static createMutationOptions<TData, TError, TVariables>(
        config: MutationConfig<TData, TError, TVariables>
    ): Partial<UseMutationOptions<TData, TError, TVariables>> {
        return {
            onSuccess: config.onSuccess,
            onError: config.onError,
            onSettled: config.onSettled,
            retry: false,
            gcTime: 1000 * 60 * 5, // 5 minutos
        };
    }

    static generateMutationKey(name: string, params?: any): string[] {
        const paramsStr = params ? JSON.stringify(params) : '';
        return [name, paramsStr].filter(Boolean);
    }
}