/**
 * AccountPro - Account Management Platform
 * Form Validation JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initMultiStepForm();
});

/**
 * Initialize Multi-step Form
 * Manages the multi-step form navigation, validation, and submission
 */
function initMultiStepForm() {
    // Get form elements
    const form = document.getElementById('account-submission-form');
    if (!form) return;

    const formSteps = form.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextButtons = form.querySelectorAll('.next-step');
    const prevButtons = form.querySelectorAll('.prev-step');
    
    // Step tracking
    const stepCompletion = {
        1: false,
        2: false,
        3: false
    };

    // Add event listeners for next/prev buttons
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = parseInt(button.closest('.form-step').dataset.step);
            if (validateStep(currentStep)) {
                goToStep(currentStep + 1);
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = parseInt(button.closest('.form-step').dataset.step);
            goToStep(currentStep - 1);
        });
    });

    // Add form submission handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentStep = parseInt(document.querySelector('.form-step.active').dataset.step);
        
        if (validateStep(currentStep)) {
            submitForm();
        }
    });

    // Add real-time validation for inputs
    const formInputs = form.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateInput(input);
        });

        // For select elements
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', () => {
                validateInput(input);
            });
        }
    });

    /**
     * Navigate to a specific step
     * @param {number} stepNumber - The step number to navigate to
     */
    function goToStep(stepNumber) {
        // Hide all steps
        formSteps.forEach(step => {
            step.classList.remove('active');
        });

        // Show the target step
        const targetStep = form.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (targetStep) {
            targetStep.classList.add('active');
            // Smooth scroll to the top of the form
            window.scrollTo({
                top: form.offsetTop - 100,
                behavior: 'smooth'
            });
        }

        // Update progress bar
        updateProgressBar(stepNumber);
    }

    /**
     * Update the progress bar based on current step
     * @param {number} currentStep - The current step number
     */
    function updateProgressBar(currentStep) {
        progressSteps.forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            step.classList.remove('active', 'completed');
            
            if (stepNum === currentStep) {
                step.classList.add('active');
            } else if (stepNum < currentStep) {
                step.classList.add('completed');
            }
        });
    }

    /**
     * Validate a specific form step
     * @param {number} stepNumber - The step number to validate
     * @returns {boolean} - Whether the step is valid
     */
    function validateStep(stepNumber) {
        const stepElement = form.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (!stepElement) return false;

        const requiredInputs = stepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredInputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        // Special validation for checkboxes in step 2
        if (stepNumber === 2) {
            isValid = isValid && validateCheckboxGroups();
        }

        // Update step completion status
        stepCompletion[stepNumber] = isValid;
        
        return isValid;
    }

    /**
     * Validate checkbox groups (at least one checkbox in each group must be checked)
     * @returns {boolean} - Whether the checkbox groups are valid
     */
    function validateCheckboxGroups() {
        // Content Management checkboxes
        const contentChecks = document.querySelectorAll('#content-creation, #content-curation, #content-scheduling, #content-analytics');
        const contentManagementValid = Array.from(contentChecks).some(check => check.checked);
        
        // Engagement Preferences checkboxes
        const engagementChecks = document.querySelectorAll('#respond-comments, #respond-messages, #proactive-engagement, #community-building');
        const engagementValid = Array.from(engagementChecks).some(check => check.checked);
        
        // Display error messages for these groups if needed
        const contentGroup = document.querySelector('label.form-label:contains("Content Management")').closest('.form-group');
        const engagementGroup = document.querySelector('label.form-label:contains("Engagement Preferences")').closest('.form-group');
        
        if (!contentManagementValid) {
            showError(contentGroup, 'Please select at least one content management option');
        } else {
            clearError(contentGroup);
        }
        
        if (!engagementValid) {
            showError(engagementGroup, 'Please select at least one engagement preference');
        } else {
            clearError(engagementGroup);
        }
        
        return contentManagementValid && engagementValid;
    }

    /**
     * Validate an individual input
     * @param {HTMLElement} input - The input element to validate
     * @returns {boolean} - Whether the input is valid
     */
    function validateInput(input) {
        if (!input.required && input.value === '') {
            clearError(input);
            return true;
        }

        // Different validation based on input type or id
        let isValid = true;
        let errorMessage = '';

        switch (input.type) {
            case 'url':
                isValid = validateUrl(input.value);
                errorMessage = 'Please enter a valid URL (e.g., https://example.com)';
                break;
            case 'email':
                isValid = validateEmail(input.value);
                errorMessage = 'Please enter a valid email address';
                break;
            case 'radio':
                // For radio buttons, check if any in the group is checked
                const radioGroup = document.getElementsByName(input.name);
                isValid = Array.from(radioGroup).some(radio => radio.checked);
                errorMessage = 'Please select an option';
                break;
            case 'select-one':
                isValid = input.value !== '' && input.value !== null;
                errorMessage = 'Please make a selection';
                break;
            default:
                isValid = input.value.trim() !== '';
                errorMessage = input.dataset.errorMessage || 'This field is required';
        }

        // Show or clear error based on validation
        if (!isValid) {
            showError(input, errorMessage);
            return false;
        } else {
            clearError(input);
            return true;
        }
    }

    /**
     * Validate a URL
     * @param {string} url - The URL to validate
     * @returns {boolean} - Whether the URL is valid
     */
    function validateUrl(url) {
        if (!url) return false;
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    }

    /**
     * Validate an email address
     * @param {string} email - The email to validate
     * @returns {boolean} - Whether the email is valid
     */
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    /**
     * Show an error message for an input
     * @param {HTMLElement} input - The input element
     * @param {string} message - The error message
     */
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;
        
        // Add error class to input
        input.classList.add('is-invalid');
        
        // Find or create the error message element
        let feedbackElement = formGroup.querySelector('.invalid-feedback');
        if (!feedbackElement) {
            feedbackElement = document.createElement('div');
            feedbackElement.className = 'invalid-feedback';
            formGroup.appendChild(feedbackElement);
        }
        
        feedbackElement.textContent = message;
        feedbackElement.style.display = 'block';
    }

    /**
     * Clear error message for an input
     * @param {HTMLElement} input - The input element
     */
    function clearError(input) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;
        
        // Remove error class from input
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        
        // Hide error message
        const feedbackElement = formGroup.querySelector('.invalid-feedback');
        if (feedbackElement) {
            feedbackElement.style.display = 'none';
        }
    }

    /**
     * Handle form submission
     */
    function submitForm() {
        // Show loading indicator
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner"></span> Processing...';
        
        // Simulate form submission with a delay
        setTimeout(() => {
            // In a real application, you would send data to the server here
            const formData = new FormData(form);
            console.log('Form submitted with data:', Object.fromEntries(formData));
            
            // Show success message and redirect to confirmation page or dashboard
            showSubmissionSuccess();
            
            // Reset button state (would not be needed if redirecting)
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }, 2000);
    }

    /**
     * Show success message after form submission
     */
    function showSubmissionSuccess() {
        // Hide the form
        form.style.display = 'none';
        
        // Create and show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'submission-success animate-fade-in';
        successMessage.innerHTML = `
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Account Submitted Successfully!</h3>
            <p>Thank you for submitting your account. Our team will review your information and contact you shortly.</p>
            <div class="success-actions">
                <a href="index.html" class="btn btn-outline">Return to Home</a>
                <a href="dashboard.html" class="btn btn-primary">Go to Dashboard</a>
            </div>
        `;
        
        // Insert the success message
        form.parentNode.insertBefore(successMessage, form);
        
        // Scroll to success message
        window.scrollTo({
            top: successMessage.offsetTop - 100,
            behavior: 'smooth'
        });
    }

    // Fix for querySelector with text content
    // This is not standard but useful for our checkbox group validation
    if (!document.querySelector('label.form-label:contains("Content Management")')) {
        // Polyfill for :contains selector
        jQuery.expr[':'].contains = function(a, i, m) {
            return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
        };
    }
}

