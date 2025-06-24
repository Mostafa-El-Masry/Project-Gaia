fetch('/Components/navbar.html')
    .then(res => res.text())
    .then(html => document.getElementById('navbar-placeholder').innerHTML = html);

// nav bar toggle on mobile
function toggleMobileMenu() {
  const nav = document.getElementById('main-nav');
  if (nav.classList.contains('hidden')) {
    nav.classList.remove('hidden');
  } else {
    nav.classList.add('hidden');
  }
}
