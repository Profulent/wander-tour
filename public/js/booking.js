// Form handling
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('bookingForm');
  const successMessage = document.getElementById('successMessage');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Collect form data
      const formData = new FormData(form);
      const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        nationality: formData.get('nationality'),
        departureDate: formData.get('departureDate'),
        travelers: formData.get('travelers'),
        accommodationType: formData.get('accommodationType'),
        travelStyle: formData.getAll('travelStyle'),
        interests: formData.getAll('interests'),
        budget: formData.get('budget'),
        pace: formData.get('pace'),
        specialRequests: formData.get('specialRequests'),
        newsletter: formData.get('newsletter') === 'on',
        bookingDate: new Date().toISOString()
      };

      // Log booking data (in real app, would send to server)
      console.log('Booking submitted:', data);

      // Save to localStorage for demo
      localStorage.setItem('bookingData', JSON.stringify(data));

      // Show success message
      form.style.display = 'none';
      successMessage.classList.add('show');

      // Smooth scroll to success message
      setTimeout(() => {
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    });
  }

  // Add staggered animation to form sections
  const sections = document.querySelectorAll('.form-section');
  sections.forEach((section, index) => {
    section.style.animation = `slideUp 0.6s ease-out ${0.2 + index * 0.1}s both`;
  });

  // Add focus animations to form inputs
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', function () {
      this.parentElement.style.animation = 'pulse 0.3s ease-out';
    });
  });

  // Interest card hover effect
  const interestCards = document.querySelectorAll('.interest-card');
  interestCards.forEach(card => {
    card.addEventListener('change', function () {
      if (this.querySelector('input').checked) {
        this.style.animation = 'pulse 0.3s ease-out';
      }
    });
  });

  // Form validation feedback
  const form_element = document.querySelector('form');
  if (form_element) {
    form_element.addEventListener('invalid', function (e) {
      if (e.target.type === 'radio' || e.target.type === 'checkbox') return;

      e.target.style.borderColor = '#c9533b';
      e.target.style.boxShadow = '0 0 0 3px rgba(201, 83, 59, 0.1)';
    }, true);

    form_element.addEventListener('input', function (e) {
      if (e.target.validity.valid) {
        e.target.style.borderColor = '#e0d5ca';
        e.target.style.boxShadow = 'none';
      }
    });
  }
});

// Add pulse animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(style);
