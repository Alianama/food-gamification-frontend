type RolePermission = {
  id: number;
  permissionId: number;
  permission: { id: number; name: string; description: string };
};

type Role = { id: number; name: string; description: string; permissions?: RolePermission[] };

type AuthData = {
  id: number;
  username: string;
  fullName?: string;
  email: string;
  role?: Role;
  accessToken?: string;
  refreshToken?: string;
};

type AuthState = {
  loading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  user: Omit<AuthData, 'accessToken' | 'refreshToken'> | null;
};

type LoginPayload = { username: string; password: string };
type LoginResponse = {
  status: string;
  message: string;
  data: AuthData;
};

type RegisterPayload = { username: string; fullName: string; email: string; password: string };
type RegisterResponse = {
  status: string;
  message: string;
  data: Omit<AuthData, 'accessToken' | 'refreshToken'>;
};

export type { AuthData, AuthState, LoginPayload, LoginResponse, RegisterPayload, RegisterResponse };
