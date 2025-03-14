export interface User {
  userId: number;
  username: string;
  fullName: string;
  email: string;
  roleId: number;
  roleName: string;
}
export interface LoginRequest {
  username: string;
  password: string;
}
export interface LoginResponse {
  userId: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  token: string;
  roleId: number;
  roleName: string;
}



export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  fullName: string;
  roleId: number;
}
