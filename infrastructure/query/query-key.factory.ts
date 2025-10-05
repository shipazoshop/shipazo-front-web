import { ApiService } from "../config/api.config";

export class QueryKeyFactory {
  static create(service: ApiService, endpoint: string, params?: any): string[] {
    const key: string[] = [service as string, endpoint];
    
    if (params) {
      key.push(JSON.stringify(params));
    }
    
    return key;
  }

  static forList(service: ApiService, resource: string, filters?: any): string[] {
    return this.create(service, `${resource}-list`, filters);
  }

  static forDetail(service: ApiService, resource: string, id: string | number): string[] {
    return this.create(service, `${resource}-detail`, { id });
  }

  static forInfinite(service: ApiService, resource: string, filters?: any): string[] {
    return this.create(service, `${resource}-infinite`, filters);
  }
}