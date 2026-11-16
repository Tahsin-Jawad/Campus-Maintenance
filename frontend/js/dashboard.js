const token = sessionStorage.getItem("campuscare_token");
let currentUser;
try { currentUser = JSON.parse(sessionStorage.getItem("campuscare_user") || "null"); } catch { currentUser = null; }
if (!token || !currentUser) window.location.href = "index.html";

const role = currentUser?.role;
const recordsContainer = document.getElementById("recordsContainer");
let allComplaints = [];
let staffMembers = [];

function statusClass(status) {
  return `status-${String(status || "").toLowerCase().replaceAll(" ", "-")}`;
}
function statusPill(status) {
  return `<span class="status-pill ${statusClass(status)}">${escapeHTML(status)}</span>`;
}
function setStats(items) {
  const total = items.length;
  const pending = items.filter(x => x.status_name === "Pending").length;
  const resolved = items.filter(x => x.status_name === "Resolved").length;
  const stats = [
    ["Total reports", total, "All recorded requests", "▤"],
    ["Pending", pending, "Awaiting action", "◷"],
    ["Resolved", resolved, "Successfully completed", "✓"]
  ];
  document.getElementById("statsGrid").innerHTML = stats.map(s => `<div class="stat-card"><div class="stat-top"><span>${s[0]}</span><span class="stat-icon">${s[3]}</span></div><div class="stat-value">${s[1]}</div><div class="stat-note">${s[2]}</div></div>`).join("");
}
function dateText(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? escapeHTML(value) : date.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}
function tableMarkup(headers, rows) {
  if (!rows.length) return `<div class="empty-state">No records found yet.</div>`;
  return `<table class="records-table"><thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table>`;
}

async function loadStudent() {
  document.getElementById("studentFormSection").classList.remove("hidden");
  document.getElementById("navWorkLabel").textContent = "My complaints";
  document.getElementById("workTitle").textContent = "My complaints";
  document.getElementById("workDescription").textContent = "Review the reports you have submitted and track their progress.";
  const data = await apiRequest("/complaints/my");
  allComplaints = data.complaints || [];
  setStats(allComplaints);
  const rows = allComplaints.map(c => `<tr><td><strong>#${c.complaint_id} · ${escapeHTML(c.title)}</strong><br><small>${escapeHTML(c.category_name)}</small></td><td>${escapeHTML(c.building_name)} ${c.room_number ? `· ${escapeHTML(c.room_number)}` : ""}</td><td>${statusPill(c.status_name)}</td><td>${dateText(c.created_at)}</td><td><button class="table-action" data-history="${c.complaint_id}">History</button>${c.status_name === "Resolved" ? ` <button class="table-action" data-feedback="${c.complaint_id}">Feedback</button>` : ""}</td></tr>`);
  recordsContainer.innerHTML = tableMarkup(["COMPLAINT", "LOCATION", "STATUS", "SUBMITTED", "ACTIONS"], rows);
}

async function loadAdmin() {
  document.getElementById("studentFormSection").classList.add("hidden");
  document.getElementById("navWorkLabel").textContent = "All complaints";
  document.getElementById("workTitle").textContent = "All complaints";
  document.getElementById("workDescription").textContent = "Review requests, assign staff, and manage complaint status.";
  const [complaintData, staffData] = await Promise.all([
    apiRequest("/admin/complaints"), apiRequest("/admin/staff")
  ]);
  allComplaints = complaintData.complaints || [];
  staffMembers = staffData.staff || [];
  setStats(allComplaints);
  const rows = allComplaints.map(c => `<tr><td><strong>#${c.complaint_id} · ${escapeHTML(c.title)}</strong><br><small>${escapeHTML(c.submitted_by)} · ${escapeHTML(c.email)}</small></td><td>${escapeHTML(c.building_name)} ${c.room_number ? `· ${escapeHTML(c.room_number)}` : ""}</td><td>${escapeHTML(c.category_name)}</td><td>${statusPill(c.status_name)}</td><td class="action-cell"><select class="table-select" id="staff-${c.complaint_id}"><option value="">Assign staff</option>${staffMembers.map(s => `<option value="${s.user_id}">${escapeHTML(s.name)} (#${s.user_id})</option>`).join("")}</select><button class="table-action" data-assign="${c.complaint_id}">Assign</button><br><select class="table-select" id="status-${c.complaint_id}"><option value="">Change status</option>${["Pending","Assigned","In Progress","Resolved","Rejected"].map(s => `<option>${s}</option>`).join("")}</select><button class="table-action" data-status="${c.complaint_id}">Update</button></td></tr>`);
  recordsContainer.innerHTML = tableMarkup(["COMPLAINT / SUBMITTED BY", "LOCATION", "CATEGORY", "STATUS", "ADMIN ACTIONS"], rows);
}

async function loadStaff() {
  document.getElementById("studentFormSection").classList.add("hidden");
  document.getElementById("navWorkLabel").textContent = "Assigned work";
  document.getElementById("workTitle").textContent = "Assigned complaints";
  document.getElementById("workDescription").textContent = "Update the progress of facility issues assigned to you.";
  const data = await apiRequest("/staff/complaints");
  allComplaints = data.complaints || [];
  setStats(allComplaints);
  const rows = allComplaints.map(c => `<tr><td><strong>#${c.complaint_id} · ${escapeHTML(c.title)}</strong><br><small>${escapeHTML(c.description)}</small></td><td>${escapeHTML(c.building_name)} ${c.room_number ? `· ${escapeHTML(c.room_number)}` : ""}</td><td>${escapeHTML(c.category_name)}</td><td>${statusPill(c.status_name)}</td><td class="action-cell"><select class="table-select" id="staff-status-${c.complaint_id}"><option value="">Update status</option><option>In Progress</option><option>Resolved</option></select><button class="table-action" data-staff-status="${c.complaint_id}">Save</button></td></tr>`);
  recordsContainer.innerHTML = tableMarkup(["COMPLAINT", "LOCATION", "CATEGORY", "STATUS", "UPDATE"], rows);
}

async function loadWorkspace() {
  recordsContainer.innerHTML = `<div class="loading-state">Loading workspace...</div>`;
  try {
    if (role === "Admin") await loadAdmin();
    else if (role === "Maintenance Staff") await loadStaff();
    else await loadStudent();
  } catch (error) {
    recordsContainer.innerHTML = `<div class="empty-state">${escapeHTML(error.message)}</div>`;
    showToast(error.message);
  }
}

document.getElementById("userName").textContent = currentUser?.name || "User";
document.getElementById("userRole").textContent = role || "User";
document.getElementById("userAvatar").textContent = (currentUser?.name || "U").charAt(0).toUpperCase();
document.getElementById("welcomeTitle").textContent = `${role || "User"} dashboard`;
document.getElementById("bannerTitle").textContent = `Welcome back, ${(currentUser?.name || "there").split(" ")[0]}`;
if (role === "Admin") document.getElementById("bannerText").textContent = "Oversee campus facility reports and coordinate the maintenance team.";
else if (role === "Maintenance Staff") document.getElementById("bannerText").textContent = "Your assigned tasks are here. Keep the campus running smoothly.";

const complaintForm = document.getElementById("complaintForm");
complaintForm.addEventListener("submit", async event => {
  event.preventDefault();
  const button = complaintForm.querySelector("button[type='submit']");
  button.disabled = true;
  try {
    const data = await apiRequest("/complaints", {
      method: "POST",
      body: JSON.stringify({
        title: document.getElementById("complaintTitle").value.trim(),
        location_id: Number(document.getElementById("complaintLocation").value),
        category_id: Number(document.getElementById("complaintCategory").value),
        description: document.getElementById("complaintDescription").value.trim()
      })
    });
    complaintForm.reset();
    showToast(data.message || "Complaint submitted successfully!");
    await loadWorkspace();
  } catch (error) { showToast(error.message); }
  finally { button.disabled = false; }
});

recordsContainer.addEventListener("click", async event => {
  const button = event.target.closest("button");
  if (!button) return;
  try {
    if (button.dataset.history) {
      const data = await apiRequest(`/complaints/${button.dataset.history}/history`);
      const historyText = (data.history || []).map(h => `${h.status_name} — ${h.remarks} (${dateText(h.updated_at)})`).join("\n");
      alert(historyText || "No history available.");
    }
    if (button.dataset.feedback) {
      const rating = prompt("Rate the maintenance service from 1 to 5:");
      if (rating === null) return;
      const comments = prompt("Any comments? (Optional)") || "";
      const data = await apiRequest(`/feedback/${button.dataset.feedback}`, { method: "POST", body: JSON.stringify({ rating: Number(rating), comments }) });
      showToast(data.message || "Feedback submitted!");
    }
    if (button.dataset.assign) {
      const staff_id = Number(document.getElementById(`staff-${button.dataset.assign}`).value);
      if (!staff_id) return showToast("Select a staff member first.");
      const data = await apiRequest(`/admin/complaints/${button.dataset.assign}/assign`, { method: "POST", body: JSON.stringify({ staff_id }) });
      showToast(data.message || "Staff assigned!");
      await loadWorkspace();
    }
    if (button.dataset.status) {
      const status_name = document.getElementById(`status-${button.dataset.status}`).value;
      if (!status_name) return showToast("Select a status first.");
      const data = await apiRequest(`/admin/complaints/${button.dataset.status}/status`, { method: "PATCH", body: JSON.stringify({ status_name }) });
      showToast(data.message || "Status updated!");
      await loadWorkspace();
    }
    if (button.dataset.staffStatus) {
      const status_name = document.getElementById(`staff-status-${button.dataset.staffStatus}`).value;
      if (!status_name) return showToast("Select a status first.");
      const data = await apiRequest(`/staff/complaints/${button.dataset.staffStatus}/status`, { method: "PATCH", body: JSON.stringify({ status_name }) });
      showToast(data.message || "Status updated!");
      await loadWorkspace();
    }
  } catch (error) { showToast(error.message); }
});

document.getElementById("refreshBtn").addEventListener("click", loadWorkspace);
document.getElementById("logoutBtn").addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "index.html";
});
loadWorkspace();
