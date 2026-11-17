const API_BASE = "https://ewu-campus-maintenance-api.onrender.com/api";

async function apiRequest(endpoint, options = {}) {
  const token = sessionStorage.getItem("campuscare_token");
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));
  if (response.status === 401) {
    sessionStorage.clear();
    window.location.href = "index.html";
    throw new Error(data.message || "Session expired. Please sign in again.");
  }
  if (!response.ok) throw new Error(data.message || "Something went wrong.");
  return data;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}
