let accessToken: string | null = null;
let refreshPromise: Promise<void> | null = null;
let onUnauthorized: (() => void) | null = null;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

async function readResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const detail = data?.detail;
    let message = 'Не удалось выполнить запрос';
    if (typeof detail === 'string') {
      message = detail;
    } else if (Array.isArray(detail)) {
      message = detail.map((error: { field: string; message: string }) => `${error.field}: ${error.message}`).join('; ');
    }
    throw new ApiError(response.status, message);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

export function refreshAccess(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
      .then(response => readResponse<{ access_token: string }>(response))
      .then(data => setAccessToken(data.access_token))
      .finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

export async function apiRequest<T>(path: string, options: RequestInit = {}, authenticated = true): Promise<T> {
  function send() {
    const headers = new Headers(options.headers);
    if (options.body) headers.set('Content-Type', 'application/json');
    if (authenticated && accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
    return fetch(`/api${path}`, { ...options, headers, credentials: 'include' });
  }

  let response = await send();
  if (authenticated && response.status === 401) {
    try {
      await refreshAccess();
      response = await send();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setAccessToken(null);
        onUnauthorized?.();
      }
      throw error;
    }
    if (response.status === 401) {
      setAccessToken(null);
      onUnauthorized?.();
    }
  }
  return readResponse<T>(response);
}
