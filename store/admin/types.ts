export interface AdminRole {
  id: number;
  name: string;
  description: string;
}

export interface AdminUserCharacter {
  level: number;
  healthPoint: number;
  xpPoint: number;
  xpToNextLevel: number;
  statusName: string;
}

export interface AdminUser {
  id: number;
  username: string;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  role: AdminRole;
  character?: AdminUserCharacter;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  username: string;
  fullName: string;
  level: number;
  xpPoint: number;
  healthPoint: number;
  statusName: string;
}

export interface AdminState {
  // User list
  users: AdminUser[];
  pagination: Pagination | null;
  usersLoading: boolean;
  usersError: string | null;

  // Selected user detail
  selectedUser: AdminUser | null;
  selectedUserLoading: boolean;
  selectedUserError: string | null;

  // Create / Update / Delete
  mutationLoading: boolean;
  mutationError: string | null;
  mutationSuccess: boolean;

  // Leaderboard
  leaderboard: LeaderboardEntry[];
  leaderboardLoading: boolean;
  leaderboardError: string | null;
}

export interface CreateUserPayload {
  username: string;
  fullName: string;
  email: string;
  password: string;
}

export interface UpdateUserPayload {
  fullName: string;
  username: string;
  email: string;
  roleId: number;
  password?: string;
}
