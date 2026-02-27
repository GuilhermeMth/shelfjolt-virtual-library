const API_URL = import.meta.env.VITE_API_URL!;

export async function api<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string,
): Promise<{ data: T }> {
  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.body instanceof FormData) {
    headers.delete("Content-Type");
  } else if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

    const text = await res.text();

    if (!res.ok) {
      throw new Error(text || `Erro ${res.status}`);
    }

    return {
      data: text ? JSON.parse(text) : (null as any),
    };
  } catch (error) {
    console.error("[API ERROR]", error);
    throw error;
  }
}
