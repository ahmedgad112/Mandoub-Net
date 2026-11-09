const TOKEN_KEY = "mandoob:admin:token";
const USER_KEY = "mandoob:admin:user";

export type ApiUser = {
  id: string;
  username: string;
  name: string;
  role: "admin" | "editor";
  active: boolean;
  createdAt: string;
};

function apiBase() {
  const env = import.meta.env.VITE_API_BASE as string | undefined;
  return (env && env.replace(/\/$/, "")) || "/api";
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuth(token: string | null, user: ApiUser | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export function getCachedUser(): ApiUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as ApiUser) : null;
  } catch {
    return null;
  }
}

export function clearAuth() {
  setAuth(null, null);
  sessionStorage.removeItem("mandoob:admin:session");
  sessionStorage.removeItem("mandoob:admin:user");
}

type ApiError = Error & { status?: number };

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers || {});
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${apiBase()}${path}`, { ...init, headers });
  let data: { ok?: boolean; error?: string } & Record<string, unknown> = {};
  try {
    data = await res.json();
  } catch {
    /* empty */
  }

  if (!res.ok || data.ok === false) {
    const err = new Error(data.error || `فشل الطلب (${res.status})`) as ApiError;
    err.status = res.status;
    if (res.status === 401) clearAuth();
    throw err;
  }
  return data as T;
}

export const api = {
  health: () => request<{ ok: boolean }>("/health"),
  getSettings: () => request<{ ok: boolean; settings: Record<string, unknown> }>("/settings"),
  saveSettings: (settings: unknown) =>
    request<{ ok: boolean; settings: Record<string, unknown> }>("/settings", {
      method: "PUT",
      body: JSON.stringify({ settings }),
    }),
  resetSettings: () =>
    request<{ ok: boolean; settings: Record<string, unknown> }>("/settings/reset", {
      method: "POST",
      body: JSON.stringify({}),
    }),
  login: (username: string, password: string) =>
    request<{ ok: boolean; token: string; user: ApiUser }>("/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  logout: () =>
    request<{ ok: boolean }>("/logout", {
      method: "POST",
      body: JSON.stringify({}),
    }).catch(() => ({ ok: true as const })),
  me: () => request<{ ok: boolean; user: ApiUser }>("/me"),
  listUsers: () => request<{ ok: boolean; users: ApiUser[] }>("/users"),
  createUser: (input: { username: string; name: string; role: "admin" | "editor"; password: string }) =>
    request<{ ok: boolean; user: ApiUser }>("/users", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateUser: (
    id: string,
    patch: Partial<{ username: string; name: string; role: "admin" | "editor"; active: boolean; password: string }>
  ) =>
    request<{ ok: boolean; user: ApiUser }>(`/users/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    }),
  deleteUser: (id: string) =>
    request<{ ok: boolean }>(`/users/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
};
