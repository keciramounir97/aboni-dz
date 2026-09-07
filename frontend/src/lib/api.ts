import axios, { AxiosError } from 'axios';
import type { ApiResponse } from './types';

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export function getAuthToken() {
  return authToken;
}

export async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const { data } = await promise;
  if (!data.success) {
    throw new Error(data.message || 'Request failed');
  }
  return data.data;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const ax = error as AxiosError<ApiResponse<unknown>>;
    return (
      ax.response?.data?.message ||
      (typeof ax.response?.data === 'object' &&
      ax.response?.data !== null &&
      'message' in ax.response.data
        ? String((ax.response.data as { message?: string }).message)
        : undefined) ||
      ax.message ||
      'Something went wrong'
    );
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
}

export async function uploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post<ApiResponse<{ url: string; filename: string }>>('/uploads', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  if (!data.success) throw new Error(data.message || 'Upload failed');
  return data.data.url;
}
