export interface PermissionItem {
  permission: {
    name: string;
    description: string;
  };
}

export interface ProfileApiResponse {
  status: string;
  message: string;
  data: ProfileData;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: PermissionItem[];
}

export interface ProfileData {
  id: number;
  username: string;
  fullName: string;
  email: string;
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
  role: Role;
}

export interface ProfileState {
  loading: boolean;
  data: ProfileData | null;
  error: string | null;
}
