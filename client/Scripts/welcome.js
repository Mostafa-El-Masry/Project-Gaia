document.addEventListener('DOMContentLoaded', function () {
  // Delegate event to the actual button after welcome is loaded
  document.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'enter-gaia-btn') {
      // Hide or clear the welcome screen
      const pageContent = document.getElementById('page-content');
      if (pageContent) {
        pageContent.style.display = 'none'; // Or use: pageContent.innerHTML = '';
      }

      // Helper to load a component into a container
      function loadComponent(htmlPath, containerId) {
        fetch(htmlPath)
          .then(response => response.text())
          .then(html => {
            const container = document.getElementById(containerId);
            if (container) {
              container.innerHTML = html;
            }
          });
      }

      // Load Sidebar.html into #sidebar-container
      loadComponent('Components/Sidebar.html', 'sidebar-container');
      // Load Core.html into #core-container
      loadComponent('Components/Core.html', 'core-container');
    }
  });
});