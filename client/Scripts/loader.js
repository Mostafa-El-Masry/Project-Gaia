document.addEventListener('DOMContentLoaded', () => {
  // setup code (runs immediately when script is loaded)
});

function loadComponent(componentName) {
  const htmlPath = `Components/${componentName}.html`;
  const jsPath = `Scripts/${componentName}.js`;

  // Load the component HTML
  fetch(htmlPath)
    .then(res => {
      if (!res.ok) throw new Error(`Cannot find ${componentName}.html`);
      return res.text();
    })
    .then(html => {
      const container = document.getElementById("page-content");
      if (!container) throw new Error("#page-content not found");
      container.innerHTML = html;

      // Then load the JS file dynamically
      const script = document.createElement('script');
      script.src = jsPath;
      script.id = 'dynamic-component-script';
      script.defer = true;
      document.body.appendChild(script);
    })
    .catch(err => {
      console.error("Component loading failed:", err);
      document.getElementById("page-content").innerHTML = `
        <div style="color:red; text-align:center;">Error loading ${componentName}</div>
      `;
    });
}
