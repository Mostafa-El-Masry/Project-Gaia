// Fetch and display user memory in the #memory-section
fetch('/Memory/user.json')
  .then(response => response.json())
  .then(data => {
    const memorySection = document.getElementById('memory-section');
    if (!memorySection) return;

    // Helper to render arrays (inline for small/simple arrays)
    function renderArray(arr, inline = false) {
      if (inline || arr.every(item => typeof item !== 'object')) {
        return arr.join(', ');
      }
      return `<ul style="margin-left:1em; margin-top:0.3em;">${arr.map(item => `<li>${item}</li>`).join('')}</ul>`;
    }

    // Helper to decide if an array should be inline (for smallest/simple arrays)
    function isInlineArray(key, arr) {
      // Show inline for traits, languages, soft skills, days, programming, and any array of primitives
      const inlineKeys = ['traits', 'languages', 'soft skills', 'days', 'programming'];
      return inlineKeys.includes(key) || arr.every(item => typeof item !== 'object');
    }

    // Helper to render objects (recursive, expandable)
    function renderObject(obj, path = '') {
      return `<ul style="margin-left:1em; margin-top:0.3em;">
        ${Object.entries(obj).map(([key, value]) => {
          const id = `memexp-${btoa(path + key).replace(/=/g, '')}`;
          if (Array.isArray(value)) {
            if (isInlineArray(key, value)) {
              return `<li><strong>${key}:</strong> ${renderArray(value, true)}</li>`;
            }
            return `
              <li>
                <span class="memexp-arrow" data-target="${id}" style="cursor:pointer;">&#9654;</span>
                <strong>${key}</strong>
                <div id="${id}" class="memexp-collapsed" style="display:none;">
                  ${renderArray(value)}
                </div>
              </li>
            `;
          } else if (typeof value === 'object' && value !== null) {
            return `
              <li>
                <span class="memexp-arrow" data-target="${id}" style="cursor:pointer;">&#9654;</span>
                <strong>${key}</strong>
                <div id="${id}" class="memexp-collapsed" style="display:none;">
                  ${renderObject(value, path + key + '.')}
                </div>
              </li>
            `;
          } else {
            return `<li><strong>${key}:</strong> ${value}</li>`;
          }
        }).join('')}
      </ul>`;
    }

    // Helper to build expandable section for any top-level key
    function buildExpandableSection(key, value) {
      const id = `memexp-${btoa(key).replace(/=/g, '')}`;
      return `
        <div>
          <span class="memexp-arrow memexp-top" data-target="${id}" style="cursor:pointer;">&#9654;</span>
          <strong>${key}</strong>
          <div id="${id}" class="memexp-collapsed" style="display:none;">
            ${typeof value === 'object' && value !== null ? renderObject(value, key + '.') : value}
          </div>
        </div>
      `;
    }

    // Build HTML for all top-level fields
    let html = '';
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'object' && value !== null) {
        html += buildExpandableSection(key, value);
      } else if (Array.isArray(value)) {
        html += `<div><strong>${key}:</strong> ${renderArray(value, true)}</div>`;
      } else {
        html += `<div><strong>${key}:</strong> ${value}</div>`;
      }
    }

    memorySection.innerHTML = html;

    // All top-level arrows expand/collapse their children
    memorySection.querySelectorAll('.memexp-arrow.memexp-top').forEach(topArrow => {
      topArrow.addEventListener('click', function () {
        const targetId = this.getAttribute('data-target');
        const target = document.getElementById(targetId);
        if (target) {
          const isCollapsed = target.style.display === 'none';
          target.style.display = isCollapsed ? '' : 'none';
          this.innerHTML = isCollapsed ? '&#9660;' : '&#9654;'; // ▼ or ▶

          // Expand/collapse all nested .memexp-collapsed inside this section
          target.querySelectorAll('.memexp-collapsed').forEach(div => {
            div.style.display = isCollapsed ? '' : 'none';
          });
          // Set all arrows accordingly inside this section
          target.querySelectorAll('.memexp-arrow').forEach(arrow2 => {
            arrow2.innerHTML = isCollapsed ? '&#9660;' : '&#9654;';
          });
        }
      });
    });

    // Still allow nested arrows to expand/collapse individually
    memorySection.querySelectorAll('.memexp-arrow:not(.memexp-top)').forEach(arrow => {
      arrow.addEventListener('click', function (e) {
        e.stopPropagation();
        const targetId = this.getAttribute('data-target');
        const target = document.getElementById(targetId);
        if (target) {
          const isCollapsed = target.style.display === 'none';
          target.style.display = isCollapsed ? '' : 'none';
          this.innerHTML = isCollapsed ? '&#9660;' : '&#9654;';
        }
      });
    });
  })
  .catch(err => {
    const memorySection = document.getElementById('memory-section');
    if (memorySection) {
      memorySection.textContent = 'Failed to load memory.';
    }
  });