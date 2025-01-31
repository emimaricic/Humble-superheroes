export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface User {
  id: string;
  created_at: Date;
  updated_at: Date;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  bio: string | null;
  phoneNumber: string | null;
  role: UserRole;
  superheroes?: Superhero[];
}

export interface Superhero {
  id: number;
  name: string;
  superpower: string;
  humilityScore: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: User;
}

export interface Session {
  id: string;
  userId: string;
  userAgent: string | null;
  expiredAt: Date | null;
  isActive: boolean;
  createdAt: Date;
  user?: User;
  refreshTokens?: RefreshToken[];
}

export interface RefreshToken {
  id: string;
  sessionId: string;
  value: string;
  isInvalided: boolean;
  session?: Session;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// Request Types
export interface CreateSuperheroDto {
  name: string;
  superpower: string;
  humilityScore: number;
}

export interface UpdateSuperheroDto extends Partial<CreateSuperheroDto> {
  id: number;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Table Types for Superhero List
export type SuperheroTableItem = Pick<
  Superhero,
  "id" | "name" | "superpower" | "humilityScore" | "createdAt"
> & {
  userName: string | null;
};

// Form Types
export interface SuperheroFormData {
  name: string;
  superpower: string;
  humilityScore: number;
}

// Filter Types
export interface SuperheroFilters {
  search?: string;
  minHumilityScore?: number;
  maxHumilityScore?: number;
  userId?: string;
}
