import API from "./axios-client";
import { TokenManager } from "./token-manager";
import { User } from "./types";

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

type forgotPasswordType = { email: string };
type resetPasswordType = { password: string; verificationCode: string };

type LoginType = {
  email: string;
  password: string;
};

type registerType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type verifyEmailType = { code: string };
type verifyMFAType = { code: string; secretKey: string };
type mfaLoginType = { code: string; email: string };

type SessionType = {
  id: string;
  userId: string;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
};

type UserSessionType = {
  user?: User;
  sessionId?: string;
};

type SessionResponseType = {
  message: string;
  sessions: SessionType[];
};

export type mfaType = {
  message: string;
  secret: string;
  qrImageUrl: string;
};

export type MagicLinkType = {
  email: string;
};

export const loginMutationFn = async (data: LoginType) => {
  const response = await API.post("/auth/signin", data);

  // Handle successful login
  if (response.data.access_token && response.data.refresh_token) {
    // Set tokens in memory and cookies
    await TokenManager.setTokens(
      response.data.access_token,
      response.data.refresh_token,
    );
  }

  return response.data;
};

export const registerMutationFn = async (data: registerType) =>
  await API.post(`/auth/signup`, data);

export const verifyEmailMutationFn = async (data: verifyEmailType) =>
  await API.post(`/auth/verify-email`, data);

export const forgotPasswordMutationFn = async (data: forgotPasswordType) =>
  await API.post(`/auth/forgot-password`, data);

export const resetPasswordMutationFn = async (data: resetPasswordType) =>
  await API.post(`/auth/reset-password`, data);

export const verifyMFALoginMutationFn = async (data: mfaLoginType) => {
  const response = await API.post(`/mfa/verify-login`, data);
  // Handle successful login
  if (response.data.access_token && response.data.refresh_token) {
    // Set tokens in memory and cookies
    await TokenManager.setTokens(
      response.data.access_token,
      response.data.refresh_token,
    );
  }

  return response.data;
};

export const logoutMutationFn = async () => {
  const response = await API.post("/auth/logout");

  if (response.data.message === "Logged out successfully")
    await TokenManager.clearTokens();

  return response.data;
};

export const mfaSetupQueryFn = async () => {
  const response = await API.get<mfaType>(`/mfa/setup`);
  return response.data;
};

export const verifyMFAMutationFn = async (data: verifyMFAType) =>
  await API.post(`/mfa/verify-setup`, data);

export const revokeMFAMutationFn = async () => await API.put(`/mfa/revoke`, {});

export const getUserSessionQueryFn = async () =>
  await API.get<UserSessionType>(`/session/`);

export const sessionsQueryFn = async () => {
  const response = await API.get<SessionResponseType>(`/session/all`);
  return response.data;
};

export const sessionDelMutationFn = async (id: string) =>
  await API.delete(`/session/${id}`);

export const magicLinkMutationFn = async (data: MagicLinkType) =>
  await API.post("/auth/magic-link", data);

export const verifyMagicLinkMutationFn = async ({
  token,
}: {
  token: string;
}) => {
  const response = await API.post(`/auth/verify-magic-link?token=${token}`);
  // Handle successful login
  if (response.data.access_token && response.data.refresh_token) {
    // Set tokens in memory and cookies
    await TokenManager.setTokens(
      response.data.access_token,
      response.data.refresh_token,
    );
  }

  return response.data;
};
