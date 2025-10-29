export type Permission = {
  id: number;
  roleId: number;
  permissionId: number;
  createdAt: string;
  updatedAt: string;
  permission: {
    id: number;
    name: string;
    description: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export type Role = {
  id: number;
  name: string;
  description: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  permissions: Permission[];
};

export type UserData = {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: Role;
  accessToken: string;
  refreshToken: string;
};

export type LoginResponse = {
  status: 'success' | 'error';
  message: string;
  data?: UserData | null;
};

export type AuthState = {
  user: UserData | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
};