import { BaseApi } from "../BaseApi";

export interface TenantResolveResponse {
  id: number;
  name: string;
  subdomain: string;
  active: boolean;
}

class TenantApi extends BaseApi {
  public async resolve(): Promise<TenantResolveResponse> {
    return this.get<TenantResolveResponse>("/tenant/resolve");
  }
}

export const tenantApi = new TenantApi();