document.addEventListener('DOMContentLoaded', () => {
  // Hide everything except the welcome overlay
  const navbar = document.getElementById('navbar');
  const mainContent = document.getElementById('main-content');
  const footer = document.querySelector('footer');
  const sidebar = document.getElementById('sidebar-container');
  const Core = document.getElementById('core-container');
  
  if (navbar) navbar.style.display = 'none';
  if (mainContent) mainContent.style.display = 'none';
  if (footer) footer.style.display = 'none';

  // Load the welcome screen into the overlay
  fetch('Components/welcome.html')
  .then(response => {
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    return response.text();
  })
    .then(html => {
      const overlay = document.getElementById('welcome-overlay');
      if (overlay) {
        overlay.innerHTML = html;
        overlay.style.display = 'block';

        // Optional: Make overlay cover everything
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(16,17,20,0.98)';
        overlay.style.zIndex = 9999;
      }

      setTimeout(() => {
        const enterBtn = document.getElementById('enter-gaia-btn');
        if (enterBtn) {
          enterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Hide the overlay and show the app
            loadComponent('Navbar', 'navbar');
            if (overlay) overlay.style.display = 'none';
            if (navbar) navbar.style.display = '';
            if (mainContent) mainContent.style.display = '';
            if (footer) footer.style.display = '';
            if (sidebar) sidebar.style.display = '';
            if (Core) Core.style.display = '';
            // Optionally, load Core.html into #page-content
            loadComponent('Core', 'page-content');
          });
        }
      }, 0);
    });
});

// Generic function to load a component into a specific container
function loadComponent(componentName, containerId) {
  const htmlPath = `Components/${componentName}.html`;
  const jsPath = `Scripts/${componentName}.js`;

  fetch(htmlPath)
    .then(res => {
      if (!res.ok) throw new Error(`Cannot find ${componentName}.html`);
      return res.text();
    })
    .then(html => {
      const container = document.getElementById(containerId);
      if (!container) throw new Error(`#${containerId} not found`);
      container.innerHTML = html;

      // Then load the JS file dynamically (if exists)
      fetch(jsPath)
        .then(jsRes => {
          if (jsRes.ok) {
            const script = document.createElement('script');
            script.src = jsPath;
            script.id = `dynamic-script-${componentName}`;
            script.defer = true;
            document.body.appendChild(script);
          }
        });
    })
    .catch(err => {
      console.error("Component loading failed:", err);
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = `
          <div style="color:red; text-align:center;">Error loading ${componentName}</div>
        `;
      }
    });
}

