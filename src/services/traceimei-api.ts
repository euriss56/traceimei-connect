const BASE_URL = import.meta.env.VITE_FLASK_API_URL 
  ?? "https://traceimei.onrender.com";

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("flask_jwt_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> ?? {}),
  };
  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? `Erreur API : ${response.status}`);
  return data as T;
}

export const traceIMEIApi = {
  verifyIMEI: (imei: string) =>
    apiFetch<any>("/api/imei/verify", {
      method: "POST",
      body: JSON.stringify({ imei }),
    }),
  getMLScore: (imei: string) =>
    apiFetch<any>("/api/ml/predict", {
      method: "POST",
      body: JSON.stringify({ imei }),
    }),
  getStats: () => apiFetch<any>("/api/stats/overview"),
  getRecentReports: (limit = 10) => apiFetch<any>(`/api/stats/recent?limit=${limit}`),
  healthCheck: () => apiFetch<any>("/"),
  isAuthenticated: () => !!localStorage.getItem("flask_jwt_token"),
};
