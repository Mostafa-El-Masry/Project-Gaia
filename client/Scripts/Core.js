// Fetch and display user memory in the #memory-section
fetch("/Memory/user.json")
  .then((response) => response.json())
  .then((data) => {
    const memorySection = document.getElementById("memory-section");
    if (!memorySection) return;

    // Helper to render arrays (inline for small/simple arrays)
    function renderArray(arr, inline = false) {
      if (inline || arr.every((item) => typeof item !== "object")) {
        return arr.join(", ");
      }
      return `<ul style="margin-left:1em; margin-top:0.3em;">${arr
        .map((item) => `<li>${item}</li>`)
        .join("")}</ul>`;
    }

    // Helper to decide if an array should be inline (for smallest/simple arrays)
    function isInlineArray(key, arr) {
      // Show inline for traits, languages, soft skills, days, programming, and any array of primitives
      const inlineKeys = [
        "traits",
        "languages",
        "soft skills",
        "days",
        "programming",
      ];
      return (
        inlineKeys.includes(key) ||
        arr.every((item) => typeof item !== "object")
      );
    }

    // Helper to render objects (recursive, expandable)
    function renderObject(obj, path = "") {
      return `<ul style="margin-left:1em; margin-top:0.3em;">
        ${Object.entries(obj)
          .map(([key, value]) => {
            const id = `memexp-${btoa(path + key).replace(/=/g, "")}`;
            if (Array.isArray(value)) {
              if (isInlineArray(key, value)) {
                return `<li><strong>${key}:</strong> ${renderArray(
                  value,
                  true
                )}</li>`;
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
            } else if (typeof value === "object" && value !== null) {
              return `
              <li>
                <span class="memexp-arrow" data-target="${id}" style="cursor:pointer;">&#9654;</span>
                <strong>${key}</strong>
                <div id="${id}" class="memexp-collapsed" style="display:none;">
                  ${renderObject(value, path + key + ".")}
                </div>
              </li>
            `;
            } else {
              return `<li><strong>${key}:</strong> ${value}</li>`;
            }
          })
          .join("")}
      </ul>`;
    }

    // Helper to build expandable section for any top-level key
    function buildExpandableSection(key, value) {
      const id = `memexp-${btoa(key).replace(/=/g, "")}`;
      return `
        <div>
          <span class="memexp-arrow memexp-top" data-target="${id}" style="cursor:pointer;">&#9654;</span>
          <strong>${key}</strong>
          <div id="${id}" class="memexp-collapsed" style="display:none;">
            ${
              typeof value === "object" && value !== null
                ? renderObject(value, key + ".")
                : value
            }
          </div>
        </div>
      `;
    }

    // Build HTML for all top-level fields
    let html = "";
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "object" && value !== null) {
        html += buildExpandableSection(key, value);
      } else if (Array.isArray(value)) {
        html += `<div><strong>${key}:</strong> ${renderArray(
          value,
          true
        )}</div>`;
      } else {
        html += `<div><strong>${key}:</strong> ${value}</div>`;
      }
    }

    memorySection.innerHTML = html;

    // All top-level arrows expand/collapse their children
    memorySection
      .querySelectorAll(".memexp-arrow.memexp-top")
      .forEach((topArrow) => {
        topArrow.addEventListener("click", function () {
          const targetId = this.getAttribute("data-target");
          const target = document.getElementById(targetId);
          if (target) {
            const isCollapsed = target.style.display === "none";
            target.style.display = isCollapsed ? "" : "none";
            this.innerHTML = isCollapsed ? "&#9660;" : "&#9654;"; // ▼ or ▶

            // Expand/collapse all nested .memexp-collapsed inside this section
            target.querySelectorAll(".memexp-collapsed").forEach((div) => {
              div.style.display = isCollapsed ? "" : "none";
            });
            // Set all arrows accordingly inside this section
            target.querySelectorAll(".memexp-arrow").forEach((arrow2) => {
              arrow2.innerHTML = isCollapsed ? "&#9660;" : "&#9654;";
            });
          }
        });
      });

    // Still allow nested arrows to expand/collapse individually
    memorySection
      .querySelectorAll(".memexp-arrow:not(.memexp-top)")
      .forEach((arrow) => {
        arrow.addEventListener("click", function (e) {
          e.stopPropagation();
          const targetId = this.getAttribute("data-target");
          const target = document.getElementById(targetId);
          if (target) {
            const isCollapsed = target.style.display === "none";
            target.style.display = isCollapsed ? "" : "none";
            this.innerHTML = isCollapsed ? "&#9660;" : "&#9654;";
          }
        });
      });
  })
  .catch((err) => {
    const memorySection = document.getElementById("memory-section");
    if (memorySection) {
      memorySection.textContent = "Failed to load memory.";
    }
  });

// Fetch and display user thoughts in the #thoughts-section
fetch("/Memory/user.json")
  .then((response) => response.json())
  .then((data) => {
    const thoughtsSection = document.getElementById("thoughts-section");
    if (!thoughtsSection) return;

    // Build your messages array
    const messages = [];

    // Number of goals
    const goals = data.personality?.goals;
    if (Array.isArray(goals) && goals.length > 0) {
      messages.push(`You have ${goals.length} goals.`);
    }

    // Random habit
    const habits = data.habits;
    if (habits) {
      const allHabits = Object.values(habits).flat();
      if (allHabits.length > 0) {
        const randomHabit =
          allHabits[Math.floor(Math.random() * allHabits.length)];
        messages.push(`Don't forget to ${randomHabit}.`);
        if (allHabits.some((h) => h.toLowerCase().includes("jog"))) {
          messages.push(`You jog in the morning — stay consistent.`);
        }
      }
    }

    // Wedding goal
    if (
      goals &&
      goals.some(
        (g) =>
          g.toLowerCase().includes("wedding") ||
          g.toLowerCase().includes("married")
      )
    ) {
      messages.push("Your wedding is approaching. Deep breaths.");
    }

    // Fallback message
    if (messages.length === 0) {
      messages.push("GAIA is thinking...");
    }

    // Animation and cycling logic
    let idx = 0;
    function showNextThought() {
      thoughtsSection.style.transition = "opacity 0.5s";
      thoughtsSection.style.opacity = 0;
      setTimeout(() => {
        thoughtsSection.textContent = messages[idx];
        idx = (idx + 1) % messages.length;
        thoughtsSection.style.opacity = 1;
      }, 500); // 0.5s fade out before changing
    }
    // Initial state
    thoughtsSection.style.opacity = 1;
    showNextThought();
    setInterval(showNextThought, 5500); // 5.5s per message (0.5s fade out + 5s display)
  })
  .catch(() => {
    const thoughtsSection = document.getElementById("thoughts-section");
    if (thoughtsSection) {
      thoughtsSection.textContent = "Unable to load thoughts.";
    }
  });

// Fetch and display user goals in the #visions-section, and allow adding new ones
fetch("/Memory/user.json")
  .then((response) => response.json())
  .then((data) => {
    const visionsSection = document.getElementById("visions-section");
    if (!visionsSection) return;

    // Get initial goals array
    let goals = Array.isArray(data.personality?.goals)
      ? [...data.personality.goals]
      : [];

    // Build the UI: heading, count, + button (no circle), and list (input hidden by default)
    visionsSection.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5em;">
        <div>
          <span style="font-weight:bold;">Active Visions</span>
          <span id="visions-count" style="color:#7dd3fc; margin-left:1em;">${
            goals.length
          } goals set</span>
        </div>
        <button id="show-vision-input" title="Add Vision"
          style="background:none; border:none; font-size:2.5em; font-weight:bold; color:#38bdf8; cursor:pointer; transition:transform 0.2s;">
          +
        </button>
      </div>
      <div id="vision-input-row" style="display:none; opacity:0; transition:opacity 0.4s; margin-bottom:0.5em; width:100%;">
        <input id="vision-input" type="text" placeholder="Add a new vision..."
          style="flex:1; width:100%; min-width:0; padding:0.5em 1em; border-radius:0.4em; border:1px solid #444; background:#23283a; color:#e0e6f0; margin-right:0.5em; box-sizing:border-box;" />
        <button id="submit-vision-btn"
          style="width:120px; padding:0.5em 0.8em; border-radius:0.4em; background:#38bdf8; color:#fff; border:none; cursor:pointer;">Submit</button>
      </div>
      <ul id="visions-list" style="margin-left:1em;">
        ${goals.map((goal) => `<li>${goal}</li>`).join("")}
      </ul>
    `;

    const showInputBtn = document.getElementById("show-vision-input");
    const inputRow = document.getElementById("vision-input-row");
    const input = document.getElementById("vision-input");
    const submitBtn = document.getElementById("submit-vision-btn");
    const list = document.getElementById("visions-list");
    const count = document.getElementById("visions-count");

    // Show/hide input row with animation and delay when + is clicked
    showInputBtn.addEventListener("click", () => {
      if (inputRow.style.display === "flex") {
        inputRow.style.opacity = "0";
        setTimeout(() => {
          inputRow.style.display = "none";
        }, 400); // match transition duration
      } else {
        inputRow.style.display = "flex";
        setTimeout(() => {
          inputRow.style.opacity = "1";
        }, 10); // allow display:flex to apply before animating opacity
        input.focus();
      }
    });

    // Add vision logic
    function addVision() {
      const value = input.value.trim();
      if (value) {
        // Add to UI immediately
        const li = document.createElement("li");
        li.textContent = value;
        list.appendChild(li);
        goals.push(value);
        count.textContent = `${goals.length} goals set`;
        input.value = "";
        inputRow.style.opacity = "0";
        setTimeout(() => {
          inputRow.style.display = "none";
        }, 400);

        // Save to backend for persistence
        fetch("/update-memory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newGoal: value }),
        })
          .then((res) => res.json())
          .then((result) => {
            // Optionally update UI with result.goals if needed
          })
          .catch(() => {
            // Optionally show error or fallback
          });
      }
    }

    submitBtn.addEventListener("click", addVision);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") addVision();
      if (e.key === "Escape") {
        inputRow.style.opacity = "0";
        setTimeout(() => {
          inputRow.style.display = "none";
        }, 400);
      }
    });
  })
  .catch(() => {
    const visionsSection = document.getElementById("visions-section");
    if (visionsSection) {
      visionsSection.textContent = "Unable to load visions.";
    }
  });

function updateProgress(percent) {
  const progressBar = document.getElementById("gaia-progress");
  const progressText = document.getElementById("progress-value");

  progressBar.style.width = percent + "%";
  progressText.textContent = percent + "%";
}

// Example: updateProgress(5); to reflect 5%
