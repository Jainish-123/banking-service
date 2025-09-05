export interface SignUpDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: { id: number; name: string; email: string; role: "USER" | "ADMIN" };
}
