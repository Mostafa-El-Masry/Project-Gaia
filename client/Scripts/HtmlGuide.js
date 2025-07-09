document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".doc-title").forEach((title) => {
    title.addEventListener("click", function () {
      const parent = this.parentElement;
      const content = parent.querySelector(".doc-content");
      const isHidden = content.hasAttribute("hidden");

      if (isHidden) {
        content.removeAttribute("hidden");
        parent.classList.add("open");
        this.classList.add("active");
      } else {
        content.setAttribute("hidden", "");
        parent.classList.remove("open");
        this.classList.remove("active");
      }
    });
  });
});
