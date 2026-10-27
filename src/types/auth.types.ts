export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  AGENT = "AGENT",
  DEVELOPER = "DEVELOPER",
  MORTGAGE = "MORTGAGE",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  avatar?: string;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
