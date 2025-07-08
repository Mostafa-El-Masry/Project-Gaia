function editItem(type, index, newValue) {
  const data = JSON.parse(localStorage.getItem(type)) || [];
  data[index] = newValue.trim();
  localStorage.setItem(type, JSON.stringify(data));
  loadMedicalData();
}

function deleteItem(type, index) {
  const data = JSON.parse(localStorage.getItem(type)) || [];
  data.splice(index, 1);
  localStorage.setItem(type, JSON.stringify(data));
  loadMedicalData();
}


function loadMedicalData() {
  const conditions = JSON.parse(localStorage.getItem('conditions')) || [];
  const medicines = JSON.parse(localStorage.getItem('medicines')) || [];
  const sugarLogs = JSON.parse(localStorage.getItem('sugarLogs')) || [];

  document.getElementById('conditionList').innerHTML = conditions.map(c => `<li>${c}</li>`).join('');
  document.getElementById('medicineList').innerHTML = medicines.map(m => `<li>${m}</li>`).join('');
  document.getElementById('sugarList').innerHTML = sugarLogs.map(s => `<li>${s} mg/dL</li>`).join('');
}

function addCondition() {
  const input = document.getElementById('conditionInput');
  if (!input.value) return;
  const conditions = JSON.parse(localStorage.getItem('conditions')) || [];
  conditions.push(input.value.trim());
  localStorage.setItem('conditions', JSON.stringify(conditions));
  input.value = '';
  loadMedicalData();
}

function addMedicine() {
  const input = document.getElementById('medicineInput');
  if (!input.value) return;
  const meds = JSON.parse(localStorage.getItem('medicines')) || [];
  meds.push(input.value.trim());
  localStorage.setItem('medicines', JSON.stringify(meds));
  input.value = '';
  loadMedicalData();
}

function addSugar() {
  const input = document.getElementById('sugarInput');
  if (!input.value) return;
  const sugars = JSON.parse(localStorage.getItem('sugarLogs')) || [];
  sugars.unshift(Number(input.value)); // Most recent first
  localStorage.setItem('sugarLogs', JSON.stringify(sugars));
  input.value = '';
  loadMedicalData();
}

// Initialize on component load
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.medical-tracker')) {
    loadMedicalData();
  }
});

document.getElementById('conditionList').innerHTML = conditions.map((c, i) =>
  `<li>
    <span contenteditable="true" onblur="editItem('conditions', ${i}, this.innerText)">${c}</span>
    <button onclick="deleteItem('conditions', ${i})">✕</button>
  </li>`).join('');


function drawChart() {
  const sugars = JSON.parse(localStorage.getItem('sugarLogs')) || [];
  const ctx = document.getElementById('sugarChart').getContext('2d');

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (sugars.length === 0) return;

  const max = Math.max(...sugars);
  const min = Math.min(...sugars);
  const gap = ctx.canvas.width / (sugars.length - 1 || 1);

  ctx.beginPath();
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 2;

  sugars.forEach((value, i) => {
    const x = i * gap;
    const y = ctx.canvas.height - ((value - min) / (max - min || 1)) * ctx.canvas.height;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });

  ctx.stroke();
}
drawChart();



document.addEventListener('DOMContentLoaded', () => {
  const interval = setInterval(() => {
    if (document.querySelector('.medical-tracker')) {
      loadMedicalData();
      clearInterval(interval);
    }
  }, 100); // Retry until component is loaded
});

