// login.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const inputUser = document.getElementById("usuario");
  const inputCode = document.getElementById("codigo");
  const errorDiv = document.getElementById("loginError");

  // ----- CONFIG -----
  const VALID_CODES = ["200028"]; // <- reemplaza con tu código(s) reales
  const MAX_ATTEMPTS = 5;
  const LOCK_MINUTES = 5;

  const ATTEMPTS_KEY = "velum_attempts";
  const LOCK_KEY = "velum_lock_until";

  // ----- helpers -----
  function showError(msg) {
    errorDiv.textContent = msg;
    errorDiv.style.display = "block";
    errorDiv.classList.add("shake");
    setTimeout(() => errorDiv.classList.remove("shake"), 600);
  }

  function hideError() {
    errorDiv.style.display = "none";
    errorDiv.textContent = "";
  }

  function getAttempts() {
    return parseInt(localStorage.getItem(ATTEMPTS_KEY)) || 0;
  }

  function setAttempts(n) {
    localStorage.setItem(ATTEMPTS_KEY, String(n));
  }

  function getLockUntil() {
    const v = parseInt(localStorage.getItem(LOCK_KEY) || "0", 10);
    return isNaN(v) ? 0 : v;
  }

  function setLockUntil(timestamp) {
    localStorage.setItem(LOCK_KEY, String(timestamp));
  }

  function clearLockAndAttempts() {
    localStorage.removeItem(ATTEMPTS_KEY);
    localStorage.removeItem(LOCK_KEY);
  }

  // check lock
  const now = Date.now();
  const lockUntil = getLockUntil();
  if (lockUntil && now < lockUntil) {
    const remaining = Math.ceil((lockUntil - now) / 1000);
    showError(`Bloqueado: intenta de nuevo en ${remaining} segundos.`);
    // prevent form (but still allow user to see inputs)
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    hideError();

    const userVal = inputUser.value.trim();
    const codeVal = inputCode.value.trim();

    // lock check
    const now2 = Date.now();
    const lockUntil2 = getLockUntil();
    if (lockUntil2 && now2 < lockUntil2) {
      const secs = Math.ceil((lockUntil2 - now2) / 1000);
      showError(`Has sido bloqueado por intentos repetidos. Espera ${secs} s.`);
      return;
    }

    if (!userVal) {
      showError("Ingresa tu nombre de usuario.");
      return;
    }
    if (!codeVal) {
      showError("Ingresa el código de acceso.");
      return;
    }

    // check code
    const ok = VALID_CODES.includes(codeVal);

    if (ok) {
      // login correcto: limpiar contadores y redirigir
      clearLockAndAttempts();
      sessionStorage.setItem("velum_user", userVal); // guarda usuario durante la sesión
      // redirigir
      window.location.href = "inicio.html";
    } else {
      // fallo
      let attempts = getAttempts() + 1;
      setAttempts(attempts);

      if (attempts >= MAX_ATTEMPTS) {
        // bloquear por X minutos
        const unlockTs = Date.now() + LOCK_MINUTES * 60 * 1000;
        setLockUntil(unlockTs);
        showError(`Código incorrecto. Has sido bloqueado por ${LOCK_MINUTES} minutos.`);
      } else {
        showError(`Código incorrecto. Intentos: ${attempts}/${MAX_ATTEMPTS}`);
      }
      // opcional: limpiar campo código
      inputCode.value = "";
      inputCode.focus();
    }
  });
});