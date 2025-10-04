export interface QueryConfig<TParams = any> {
    getParams?: () => TParams | null;
    dependencies?: any[];
    enabled?: boolean | (() => boolean);
}

export class QueryService {
    static generateQueryKey(
        baseName: string,
        params?: any,
        dependencies: any[] = []
    ): string[] {
        const paramsStr = params ? JSON.stringify(params) : '';
        const depsStr = dependencies.map(dep => JSON.stringify(dep));
        return [baseName, paramsStr, ...depsStr].filter(Boolean);
    }

    static isQueryEnabled(enabled: boolean | (() => boolean)): boolean {
        return typeof enabled === 'function' ? enabled() : enabled;
    }
}