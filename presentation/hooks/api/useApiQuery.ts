// presentation/hooks/api/useApiQuery.ts
import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { QueryService } from '@/application/services/QueryService';

export interface QueryError {
    response: {
        status: number;
        data: { message: string };
    };
}

interface UseApiQueryProps<TData, TParams = any> {
    queryKey: string;
    queryFn: (params?: TParams) => Promise<TData>;
    params?: TParams;
    dependencies?: any[];
    enabled?: boolean | (() => boolean);
    queryOptions?: Partial<UseQueryOptions<TData, QueryError>>;
}

export function useApiQuery<TData = any, TParams = any>({
    queryKey: baseKey,
    queryFn,
    params,
    dependencies = [],
    enabled = true,
    queryOptions,
}: UseApiQueryProps<TData, TParams>) {
    const client = useQueryClient();

    const [manualState, setManualState] = useState<{
        isLoading: boolean;
        error: QueryError | null;
    }>({
        isLoading: false,
        error: null,
    });

    // Generate dynamic query key
    const queryKey = useMemo(() =>
        QueryService.generateQueryKey(baseKey, params, dependencies),
        [baseKey, params, dependencies]
    );

    // Query function wrapper
    const wrappedQueryFn = useCallback(async () => {
        return await queryFn(params);
    }, [queryFn, params]);

    // Check if enabled
    const isEnabled = useMemo(() =>
        QueryService.isQueryEnabled(enabled),
        [enabled]
    );

    // React Query
    const query = useQuery<TData, QueryError>({
        queryKey,
        queryFn: wrappedQueryFn,
        enabled: isEnabled,
        refetchOnWindowFocus: false,
        retry: false,
        ...queryOptions,
    });

    // Manual fetch with different params
    const fetchManual = useCallback(async (manualParams: TParams): Promise<TData> => {
        setManualState({ isLoading: true, error: null });

        try {
            const data = await queryFn(manualParams);

            // Update cache
            client.setQueryData([baseKey], data);
            setManualState({ isLoading: false, error: null });

            return data;
        } catch (error: any) {
            setManualState({ isLoading: false, error });
            throw error;
        }
    }, [queryFn, client, baseKey]);

    // Utilities
    const refetchWithInvalidation = useCallback(() => {
        client.invalidateQueries({
            predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === baseKey
        });
        return query.refetch();
    }, [client, baseKey, query]);

    const resetData = useCallback(() => {
        client.removeQueries({ queryKey: [baseKey] });
    }, [client, baseKey]);

    return {
        // Main data
        data: query.data,
        isLoading: query.isLoading || query.isFetching || manualState.isLoading,
        isError: query.isError || manualState.error !== null,
        error: query.error ?? manualState.error,

        // Actions
        refetch: query.refetch,
        refetchWithInvalidation,
        fetchManual,
        resetData,
        updateData: (data: TData) => client.setQueryData(queryKey, data),

        queryKey,
        status: query.status,
    };
}