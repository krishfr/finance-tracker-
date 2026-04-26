// src/api.js

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export function setToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function clearToken() {
  localStorage.removeItem("token");
}

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  const text = await res.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Server returned HTML. Check API URL.");
  }

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

