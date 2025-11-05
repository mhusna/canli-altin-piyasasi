document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("goToUpdateBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    window.location.href = "../updatePrices/updatePrices.html";
  });
});