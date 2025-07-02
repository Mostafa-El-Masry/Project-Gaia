document.addEventListener('DOMContentLoaded', () => {
  // Load the welcome screen initially into #page-content
  fetch('Components/welcome.html')
    .then(response => response.text())
    .then(html => {
      const pageContent = document.getElementById('page-content');
      if (pageContent) {
        pageContent.innerHTML = html;

        // Attach event listener for the Enter button (wait for DOM to update)
        setTimeout(() => {
          const enterBtn = document.getElementById('enter-gaia-btn');
          if (enterBtn) {
            enterBtn.addEventListener('click', (e) => {
              e.preventDefault();
              // Load Core.html into #page-content
              loadComponent('Core', 'page-content');
            });
          }
        }, 0);
      }
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

