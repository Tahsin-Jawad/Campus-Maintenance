const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const authMessage = document.getElementById("authMessage");

function setAuthMode(mode) {
  const isLogin = mode === "login";
  loginForm.classList.toggle("hidden", !isLogin);
  registerForm.classList.toggle("hidden", isLogin);
  loginTab.classList.toggle("active", isLogin);
  registerTab.classList.toggle("active", !isLogin);
  document.getElementById("formHeading").textContent = isLogin ? "Sign in to your account" : "Create your account";
  document.getElementById("formSubheading").textContent = isLogin ? "Enter your details to access your dashboard." : "Register as an EWU student or faculty member.";
  authMessage.textContent = "";
  authMessage.className = "message";
}

loginTab.addEventListener("click", () => setAuthMode("login"));
registerTab.addEventListener("click", () => setAuthMode("register"));

loginForm.addEventListener("submit", async event => {
  event.preventDefault();
  const button = loginForm.querySelector("button[type='submit']");
  button.disabled = true;
  button.textContent = "Signing in...";
  authMessage.textContent = "";
  try {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: document.getElementById("loginEmail").value.trim(),
        password: document.getElementById("loginPassword").value
      })
    });
    sessionStorage.setItem("campuscare_token", data.token);
    sessionStorage.setItem("campuscare_user", JSON.stringify(data.user));
    window.location.href = "dashboard.html";
  } catch (error) {
    authMessage.textContent = error.message;
  } finally {
    button.disabled = false;
    button.innerHTML = 'Sign in <span>→</span>';
  }
});

registerForm.addEventListener("submit", async event => {
  event.preventDefault();
  const button = registerForm.querySelector("button[type='submit']");
  button.disabled = true;
  button.textContent = "Creating account...";
  authMessage.textContent = "";
  try {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: document.getElementById("registerName").value.trim(),
        email: document.getElementById("registerEmail").value.trim(),
        phone: document.getElementById("registerPhone").value.trim(),
        role: document.getElementById("registerRole").value,
        password: document.getElementById("registerPassword").value
      })
    });
    authMessage.textContent = `${data.message} You can now sign in.`;
    authMessage.className = "message success";
    registerForm.reset();
    setAuthMode("login");
    authMessage.textContent = "Registration successful! Please sign in.";
    authMessage.className = "message success";
  } catch (error) {
    authMessage.textContent = error.message;
    authMessage.className = "message";
  } finally {
    button.disabled = false;
    button.innerHTML = 'Create account <span>→</span>';
  }
});
