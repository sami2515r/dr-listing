function showFieldError(inputId, message) {
  const input = document.getElementById(inputId);

  if (!input) return;

  clearFieldError(inputId);

  input.classList.add('input-error');

  const error = document.createElement('div');
  error.className = 'field-error';
  error.id = `${inputId}Error`;
  error.innerText = message;

  input.insertAdjacentElement('afterend', error);
}

function clearFieldError(inputId) {
  const input = document.getElementById(inputId);
  const oldError = document.getElementById(`${inputId}Error`);

  if (input) {
    input.classList.remove('input-error');
  }

  if (oldError) {
    oldError.remove();
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[0-9]{10}$/.test(phone);
}