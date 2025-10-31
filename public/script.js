// Dashboard statistics loader
document.addEventListener('DOMContentLoaded', function() {
    // This would typically fetch data from your API
    // For now, we'll use placeholder data
    loadDashboardStats();
});

function loadDashboardStats() {
    // Simulate API call
    setTimeout(() => {
        document.getElementById('total-products').textContent = '12';
        document.getElementById('total-categories').textContent = '3';
        document.getElementById('total-suppliers').textContent = '5';
        document.getElementById('total-inventory').textContent = '8';
    }, 500);
}

// Form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            input.style.borderColor = '#ced4da';
        }
    });
    
    return isValid;
}

// Add form validation to all forms
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    });
});