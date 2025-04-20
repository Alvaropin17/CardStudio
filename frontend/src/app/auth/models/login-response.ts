export interface LoginResponse {
  error: boolean;
  status: number;
  body: {
    id: number;
    name: string;
  };
}

  