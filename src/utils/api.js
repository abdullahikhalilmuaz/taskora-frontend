const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getEmail = () => {
  try {
    const u = JSON.parse(localStorage.getItem("stm_user") || "null");
    return u?.email || "";
  } catch {
    return "";
  }
};

async function request(
  path,
  { method = "GET", body, headers = {}, isForm = false } = {},
) {
  const finalHeaders = {
    "x-user-email": getEmail(),
    ...headers,
  };
  if (!isForm && body) finalHeaders["Content-Type"] = "application/json";

  const res = await fetch(API_BASE + path, {
    method,
    headers: finalHeaders,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  let data = null;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    data = await res.json();
  } else if (ct.includes("application/pdf")) {
    return { ok: res.ok, blob: await res.blob() };
  }

  if (!res.ok) {
    const err = new Error(data?.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  get: (p) => request(p),
  post: (p, body) => request(p, { method: "POST", body }),
  put: (p, body) => request(p, { method: "PUT", body }),
  del: (p) => request(p, { method: "DELETE" }),
  download: (p) => request(p),
};

export const API_URL = API_BASE;
