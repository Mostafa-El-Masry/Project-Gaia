// Navbar.js

// Function to load the navbar HTML into the page
function loadNavbar() {
  fetch('/Components/Navbar.html')
    .then(res => {
      if (!res.ok) throw new Error("Navbar fetch failed.");
      return res.text();
    })
    .then(html => {
      document.getElementById('navbar-placeholder').innerHTML = html;
      setupNavbarEvents(); // Attach events after navbar is loaded
    })
    .catch(err => {
      console.error("Navbar load error:", err);
    });
}

// Extracted component loader
async function loadComponent(component) {
  const file = `Components/${component}.html`;

  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`Failed to load ${file}`);

    const html = await res.text();
    const content = document.getElementById('page-content');

    if (content) {
      content.innerHTML = html;
      content.scrollIntoView({ behavior: "smooth" });

      // Dynamically load JS file if it exists
      const scriptPath = `/Scripts/${component}.js`;
      fetch(scriptPath, { method: 'HEAD' })
        .then(resp => {
          if (resp.ok) {
            let oldScript = document.getElementById('dynamic-component-script');
            if (oldScript) oldScript.remove();

            const script = document.createElement('script');
            script.src = scriptPath + '?v=' + Date.now(); // cache-busting
            script.id = 'dynamic-component-script';
            script.defer = true;
            document.body.appendChild(script);
          }
        });
    } else {
      console.warn('No #page-content element found.');
    }
  } catch (err) {
    console.error("Component load error:", err);
    document.getElementById('page-content').innerHTML = `
      <div class="text-red-600 text-center py-4">Error loading ${component}.html</div>
    `;
  }
}

// Function to handle component loading from navbar links
function setupNavbarEvents() {
  const links = document.querySelectorAll('[data-component]');

  links.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const component = this.getAttribute("data-component");
      loadComponent(component);
    });
  });
}

// Call the loader on DOM ready
document.addEventListener('DOMContentLoaded', loadNavbar);


