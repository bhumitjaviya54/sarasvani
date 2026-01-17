// Theme toggle functionality
const themeToggleBtn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

document.documentElement.setAttribute('data-theme', currentTheme);
themeToggleBtn.checked = currentTheme === 'dark';

themeToggleBtn.addEventListener('change', () => {
    const newTheme = themeToggleBtn.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Sample data
let patients = [
    { name: 'Dhanush', age: 28, condition: 'Stuttering', progress: 75 },
    { name: 'Priya Sharma', age: 30, condition: 'Speech Delay', progress: 80 },
    { name: 'Aarav Patel', age: 35, condition: 'Fluency Disorder', progress: 60 }
];

let sessions = [
    { date: '2024-09-28', patient: 'Dhanush', duration: '45 minutes', progress: 'Improved fluency' },
    { date: '2024-09-27', patient: 'Priya Sharma', duration: '30 minutes', progress: 'Steady improvement' },
    { date: '2024-09-26', patient: 'Aarav Patel', duration: '60 minutes', progress: 'Significant progress' }
];

let reports = [
    { patient: 'Dhanush', date: '2024-09-25', sessionsCovered: 'Sessions 1-10' },
    { patient: 'Priya Sharma', date: '2024-09-24', sessionsCovered: 'Sessions 1-8' },
    { patient: 'Aarav Patel', date: '2024-09-23', sessionsCovered: 'Sessions 1-12' }
];

// Populate tables
function populateTables() {
    const patientTable = document.getElementById('patientTable');
    const sessionTable = document.getElementById('sessionTable');
    const reportTable = document.getElementById('reportTable');

    // Patient Table      <button class="btn" onclick="showChart('${patient.name}')">Chart</button>
    patientTable.innerHTML = patients.map(patient => `
        <tr>
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.condition}</td>
            <td>
                <div class="progress-bar">
                    <div class="progress" style="width: ${patient.progress}%"></div>
                </div>
                ${patient.progress}%
            </td>
            <td>
                <button class="btn" onclick="editPatient('${patient.name}')">Edit</button>
                <button class="btn" onclick="generateReport('${patient.name}')">Report</button>
             
            </td>
        </tr>
    `).join('');

    // Session Table
    sessionTable.innerHTML = sessions.map(session => `
        <tr>
            <td>${session.date}</td>
            <td>${session.patient}</td>
            <td>${session.duration}</td>
            <td>${session.progress}</td>
            <td>
                <button class="btn" onclick="viewSessionDetails('${session.date}', '${session.patient}')">Details</button>
            </td>
        </tr>
    `).join('');

    // Report Table
    reportTable.innerHTML = reports.map(report => `
        <tr>
            <td>${report.patient}</td>
            <td>${report.date}</td>
            <td>${report.sessionsCovered}</td>
            <td>
                <button class="btn" onclick="viewReport('${report.patient}')">View</button>
                <button class="btn" onclick="downloadReport('${report.patient}')">Download</button>
            </td>
        </tr>
    `).join('');
}

// Add New Patient
function openAddPatientModal() {
    // Reset form fields
    document.getElementById('newName').value = '';
    document.getElementById('newAge').value = '';
    document.getElementById('newCondition').value = '';
    document.getElementById('newProgress').value = '';

    document.getElementById('addPatientModal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function addNewPatient() {
    const name = document.getElementById('newName').value.trim();
    const age = parseInt(document.getElementById('newAge').value);
    const condition = document.getElementById('newCondition').value.trim();
    const progress = parseInt(document.getElementById('newProgress').value);

    // Comprehensive input validation
    const errors = [];

    if (!name) errors.push('Patient Name is required');
    if (isNaN(age) || age < 0 || age > 120) errors.push('Invalid Age (0-120)');
    if (!condition) errors.push('Condition is required');
    if (isNaN(progress) || progress < 0 || progress > 100) errors.push('Progress must be between 0-100%');

    // Check for duplicate patient
    const existingPatient = patients.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (existingPatient) errors.push('A patient with this name already exists');

    // Display errors or add patient
    if (errors.length > 0) {
        alert('Please correct the following errors:\n' + errors.join('\n'));
        return;
    }

    // Add new patient
    patients.push({ name, age, condition, progress });
    populateTables();
    closeAddPatientModal();
}

function closeAddPatientModal() {
    document.getElementById('addPatientModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

// Edit Patient
function editPatient(patientName) {
    const patient = patients.find(p => p.name === patientName);
    if (!patient) return;

    document.getElementById('editName').value = patient.name;
    document.getElementById('editAge').value = patient.age;
    document.getElementById('editCondition').value = patient.condition;
    document.getElementById('editProgress').value = patient.progress;

    document.getElementById('editModal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

// Save Patient
function savePatient() {
    const name = document.getElementById('editName').value;
    const age = parseInt(document.getElementById('editAge').value);
    const condition = document.getElementById('editCondition').value;
    const progress = parseInt(document.getElementById('editProgress').value);

    const patientIndex = patients.findIndex(p => p.name === name);
    if (patientIndex !== -1) {
        patients[patientIndex] = { name, age, condition, progress };
        populateTables();
        closeModal();
    }
}

// Close Modal
function closeModal() {
    document.getElementById('editModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

// Generate Report
function generateReport(patientName) {
    const patient = patients.find(p => p.name === patientName);
    if (!patient) return;

    const reportContent = `
Patient Report: ${patient.name}
------------------------------
Age: ${patient.age}
Condition: ${patient.condition}
Progress: ${patient.progress}%

Recommendations:
1. Continue current treatment plan
2. Monitor progress closely
3. Consider advanced therapy techniques
    `;

    // Download report
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${patient.name}_Report.txt`;
    link.click();
}

// Generate New Report
function generateNewReport() {
    alert('Generating a comprehensive report. Please select a patient.');
}

// View Session Details
function viewSessionDetails(date, patientName) {
    const session = sessions.find(s => s.date === date && s.patient === patientName);
    if (session) {
        alert(`
Session Details
---------------
Date: ${session.date}
Patient: ${session.patient}
Duration: ${session.duration}
Progress: ${session.progress}
        `);
    }
}

// View Report
function viewReport(patientName) {
    const report = reports.find(r => r.patient === patientName);
    if (report) {
        alert(`
Report Details
---------------
Patient: ${report.patient}
Date: ${report.date}
Sessions Covered: ${report.sessionsCovered}
        `);
    }
}

// Download Report
function downloadReport(patientName) {
    const report = reports.find(r => r.patient === patientName);
    if (report) {
        const reportContent = `
Patient Report: ${report.patient}
Date: ${report.date}
Sessions Covered: ${report.sessionsCovered}
        `;

        const blob = new Blob([reportContent], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${patientName}_Report.txt`;
        link.click();
    }
}

// Chart Initialization
let patientChart;
function showChart(patientName) {
    const ctx = document.getElementById('patientChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (patientChart) {
        patientChart.destroy();
    }

    // Sample progress data with more detailed tracking
    const progressData = {
        'Dhanush': [65, 70, 75, 80, 85, 90, 95],
        'Priya Sharma': [55, 60, 70, 75, 80, 85, 90],
        'Aarav Patel': [40, 45, 50, 55, 60, 65, 70]
    };

    // Use default data for new patients
    const chartData = progressData[patientName] || 
        [40, 45, 50, 55, 60, 65, 70];

    patientChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
            datasets: [{
                label: `${patientName} Progress`,
                data: chartData,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                borderWidth: 2,
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Progress (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time Period'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Patient Progress Over Time',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    populateTables();
    // Show initial chart for first patient
    if (patients.length > 0) {
        showChart(patients[0].name);
    }
});


