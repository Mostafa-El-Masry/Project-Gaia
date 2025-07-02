document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  // Only show if not already dismissed this session
  if (!sessionStorage.getItem('welcomeShown')) {
    // Create the welcome container
    const container = document.createElement('div');
    container.className = 'welcome-container fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50';
    container.innerHTML = `
      <div class="bg-white rounded-xl shadow-xl p-8 text-center max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4">Welcome to GAIA</h2>
        <p class="mb-6 text-gray-600">Your personal AI companion</p>
        <button class="enter-btn bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">Enter</button>
      </div>
    `;

    // Add to main content (as overlay)
    mainContent.appendChild(container);

    // Hide on click and set session flag
    const button = container.querySelector('.enter-btn');
    if (button) {
      button.addEventListener('click', () => {
        container.remove();
        sessionStorage.setItem('welcomeShown', 'true');
      });
    }
  }
});