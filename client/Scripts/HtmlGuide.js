document.addEventListener("DOMContentLoaded", () => {
  alert(
    "Welcome to the HTML Guide! Click on any topic to expand or collapse its content."
  );
  console.log("aaa");
  document.querySelectorAll(".doc-topic").forEach((topic) => {
    const title = topic.querySelector(".doc-title");
    const content = topic.querySelector(".doc-content");
    // Hide all contents by default
    content.style.display = "none";

    topic.addEventListener("click", function (e) {
      // Prevent toggling when clicking inside the content
      if (e.target !== title && !title.contains(e.target)) return;
      const isHidden = content.style.display === "none";
      title.classList.toggle("active", isHidden);
      content.style.display = isHidden ? "" : "none";
    });
  });
});
