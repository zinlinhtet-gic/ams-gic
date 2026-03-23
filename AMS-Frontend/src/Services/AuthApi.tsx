import { BaseApi } from "./BaseApi";

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role?: string;
}

class AuthApi extends BaseApi {
  public async me(): Promise<CurrentUser> {
    return this.get<CurrentUser>("/auth/me");
  }
}

export const authApi = new AuthApi();