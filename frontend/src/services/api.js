const BASE = '/api';

async function request(endpoint, params = {}) {
  const url = new URL(endpoint, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') url.searchParams.set(k, v);
  });

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
}

export async function getHealth() {
  return request(`${BASE}/health`);
}

export async function getPrecipitaciones(filters = {}) {
  return request(`${BASE}/precipitaciones`, filters);
}

export async function getPrecipitacion(id) {
  return request(`${BASE}/precipitaciones/${encodeURIComponent(id)}`);
}

export async function getEstadisticas() {
  return request(`${BASE}/estadisticas`);
}

export async function getDepartamentos() {
  return request(`${BASE}/departamentos`);
}
