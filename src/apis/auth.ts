import { http } from "./common";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export const authApi = {
  login: (data: LoginRequest) =>
    http.post<LoginResponse, LoginRequest>("/auth/login", data),
  logout: () => http.post("/auth/logout"),
  refresh: (refreshToken: string) =>
    http.post<LoginResponse>("/auth/refresh", { refreshToken }),
};

