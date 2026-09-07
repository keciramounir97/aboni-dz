export function ok<T>(data: T, message?: string) {
  return { success: true, data, ...(message ? { message } : {}) };
}

export function fail(message: string, data: unknown = null) {
  return { success: false, data, message };
}
