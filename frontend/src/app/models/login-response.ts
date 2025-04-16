export interface LoginResponse {
    error: boolean;
    status: number;
    body: {
      token: string;
    };
  }
  