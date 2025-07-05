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
