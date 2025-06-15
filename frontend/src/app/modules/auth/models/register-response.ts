export interface RegisterResponse {
  error: boolean;
  status: number;
  body: {
    id: number;
    name: string;
    email: string;
  };
}

  