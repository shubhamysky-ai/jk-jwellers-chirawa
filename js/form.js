/* 
   JK Jewellers Chirawa - Inquiry Form Script
   Author: Senior UI/UX Designer & Frontend Developer
   Vanilla JS Form Validations & Lead Routing (WhatsApp API)
*/

document.addEventListener('DOMContentLoaded', () => {
    initInquiryForm();
});

function initInquiryForm() {
    const form = document.getElementById('inquiryForm');
    const modal = document.getElementById('successModalOverlay');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const whatsappModalBtn = document.getElementById('whatsappModalBtn');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent standard page reload

        // Reset errors
        const errorElements = form.querySelectorAll('.form-error');
        errorElements.forEach(el => el.style.display = 'none');

        // Capture fields
        const nameField = document.getElementById('name');
        const phoneField = document.getElementById('phone');
        const emailField = document.getElementById('email');
        const cityField = document.getElementById('city');
        const interestField = document.getElementById('interest');
        const budgetField = document.getElementById('budget');
        const messageField = document.getElementById('message');

        let isValid = true;

        // 1. Name Validation
        if (nameField.value.trim().length < 3) {
            showError(nameField, 'Please enter a valid name (at least 3 characters).');
            isValid = false;
        }

        // 2. Phone Validation (10 digits)
        const phonePattern = /^[6-9]\d{9}$/; // India phone format
        if (!phonePattern.test(phoneField.value.trim())) {
            showError(phoneField, 'Please enter a valid 10-digit mobile number.');
            isValid = false;
        }

        // 3. Email Validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailField.value.trim() !== '' && !emailPattern.test(emailField.value.trim())) {
            showError(emailField, 'Please enter a valid email address.');
            isValid = false;
        }

        // 4. City Validation
        if (cityField.value.trim().length < 2) {
            showError(cityField, 'Please enter your city.');
            isValid = false;
        }

        // 5. Message Validation
        if (messageField.value.trim() === '') {
            showError(messageField, 'Please write your message or design requirement.');
            isValid = false;
        }

        // If validation is successful
        if (isValid) {
            // Formulate WhatsApp message text
            const name = nameField.value.trim();
            const phone = phoneField.value.trim();
            const email = emailField.value.trim() || 'Not provided';
            const city = cityField.value.trim();
            const interest = interestField.value;
            const budget = budgetField.value;
            const msg = messageField.value.trim();

            const textMessage = `*New Inquiry - JK Jewellers Chirawa*\n` +
                                `-----------------------------------\n` +
                                `*Name:* ${name}\n` +
                                `*Phone:* ${phone}\n` +
                                `*Email:* ${email}\n` +
                                `*City:* ${city}\n` +
                                `*Interested In:* ${interest}\n` +
                                `*Budget:* ${budget}\n` +
                                `*Message:* ${msg}`;

            // Encode for URI
            const encodedText = encodeURIComponent(textMessage);
            const whatsappUrl = `https://wa.me/919784715709?text=${encodedText}`;

            // Configure whatsapp button on modal
            if (whatsappModalBtn) {
                whatsappModalBtn.onclick = () => {
                    window.open(whatsappUrl, '_blank');
                    closeModal();
                };
            }

            // Open Success Modal Popup
            if (modal) {
                modal.classList.add('active');
                document.body.classList.add('no-scroll');
            }

            // Reset form
            form.reset();
        }
    });

    // Modal control functions
    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

function showError(inputElement, errorMessage) {
    const formGroup = inputElement.closest('.form-group');
    if (formGroup) {
        const errorDiv = formGroup.querySelector('.form-error');
        if (errorDiv) {
            errorDiv.textContent = errorMessage;
            errorDiv.style.display = 'block';
        }
    }
}
