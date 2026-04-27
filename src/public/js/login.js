const loginForm = document.querySelector("#loginForm");
const loginMessage = document.querySelector("#loginMessage");
const passwordInput = document.querySelector("#password");
const passwordToggle = document.querySelector(".password-toggle");

passwordToggle?.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  passwordToggle.textContent = isPassword ? "Hide" : "View";
  passwordToggle.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
  passwordToggle.setAttribute("aria-pressed", String(isPassword));
});

loginForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!loginForm.checkValidity()) {
    loginMessage.textContent = "Enter a valid email and password.";
    loginMessage.className = "login-message is-error";
    loginForm.reportValidity();
    return;
  }

  loginMessage.textContent = "Login form is ready to connect to your auth endpoint.";
  loginMessage.className = "login-message is-success";
});
