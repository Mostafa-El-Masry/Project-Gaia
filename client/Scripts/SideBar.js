document.addEventListener("DOMContentLoaded", () => {
  fetch("/Components/Sidebar.html")
    .then((res) => res.text())
    .then((html) => {
      const sidebarDiv = document.createElement("div");
      sidebarDiv.innerHTML = html;
      document.body.appendChild(sidebarDiv.firstElementChild);

      // Sidebar toggle logic after sidebar is loaded
      const sidebar = document.getElementById("sidebar");
      const toggleBtn = document.getElementById("sidebar-toggle");

      if (toggleBtn && sidebar) {
        toggleBtn.addEventListener("click", () => {
          sidebar.classList.toggle("-translate-x-full");
        });

        document.addEventListener("keydown", (e) => {
          if (
            (e.key === "g" || e.key === "G") &&
            document.activeElement.tagName !== "INPUT" &&
            document.activeElement.tagName !== "TEXTAREA"
          ) {
            sidebar.classList.toggle("-translate-x-full");
          }
        });
      }
    });
});

// Sidebar component JS (optional)
console.log("Sidebar loaded!");
