const form = document.getElementById('registrationForm');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const birthDateInput = document.getElementById('birthDate');
const countryCodeInput = document.getElementById('countryCode');
const clearButton = document.getElementById('clearButton');
const statusMessage = document.getElementById('statusMessage');

const currencyCode = document.getElementById('currencyCode');
const population = document.getElementById('population');
const capitalCity = document.getElementById('capitalCity');
const httpStatus = document.getElementById('httpStatus');

const errorMap = {
  firstName: document.getElementById('firstNameError'),
  lastName: document.getElementById('lastNameError'),
  birthDate: document.getElementById('birthDateError'),
  countryCode: document.getElementById('countryCodeError'),
};

function clearFieldErrors() {
  Object.values(errorMap).forEach((element) => {
    element.textContent = '';
  });
}

function showError(fieldName, message) {
  const field = errorMap[fieldName];
  if (field) {
    field.textContent = message;
  }
}

function validateForm() {
  clearFieldErrors();
  const data = {
    firstName: firstNameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    birthDate: birthDateInput.value,
    countryCode: countryCodeInput.value,
  };

  let isValid = true;

  if (!data.firstName) {
    showError('firstName', 'First name is required.');
    isValid = false;
  }

  if (!data.lastName) {
    showError('lastName', 'Last name is required.');
    isValid = false;
  }

  if (!data.birthDate) {
    showError('birthDate', 'Birthdate is required.');
    isValid = false;
  }

  if (!data.countryCode) {
    showError('countryCode', 'Country code is required.');
    isValid = false;
  }

  return { isValid, data };
}

function setStatus(message, variant) {
  statusMessage.textContent = message;
  statusMessage.className = `status ${variant}`;
  statusMessage.style.display = 'block';
}

async function fetchCountryInfo(countryCode) {
  const response = await fetch(`https://countries.dev/alpha/${countryCode}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();
  currencyCode.textContent = data.currencies?.[0]?.code || 'N/A';
  population.textContent = data.population ?? 'N/A';
  capitalCity.textContent = data.capital || 'N/A';
  httpStatus.textContent = String(response.status);
  return { response, data };
}

async function fetchInvalidCountryStatus() {
  const response = await fetch('https://countries.dev/alpha/INVALID');
  httpStatus.textContent = String(response.status);
  return response;
}

countryCodeInput.addEventListener('change', async () => {
  const selectedCountryCode = countryCodeInput.value;
  if (!selectedCountryCode) {
    return;
  }

  try {
    const countryInfo = await fetchCountryInfo(selectedCountryCode);
    const invalidResponse = await fetchInvalidCountryStatus();

    if (!invalidResponse.ok) {
      setStatus(`Lookup complete. Invalid check returned HTTP ${invalidResponse.status}.`, 'success');
    }

    console.log('Valid country info:', countryInfo);
    console.log('Invalid country status:', invalidResponse.status);
  } catch (error) {
    setStatus(error.message || 'Could not load country details.', 'error');
    console.error(error);
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const { isValid, data } = validateForm();

  if (!isValid) {
    setStatus('Please fix the highlighted validation errors.', 'error');
    return;
  }

  try {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      birthDate: data.birthDate,
      countryCode: data.countryCode,
    };

    const registerResponse = await fetch('/api/attendees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await registerResponse.json();

    if (!registerResponse.ok) {
      throw new Error(result.message || 'Registration failed');
    }

    setStatus('Registration saved successfully.', 'success');
    console.log('Saved:', result);
  } catch (error) {
    setStatus(error.message || 'Unable to save registration.', 'error');
    console.error(error);
  }
});

clearButton.addEventListener('click', () => {
  form.reset();
  clearFieldErrors();
  statusMessage.style.display = 'none';
  currencyCode.textContent = '-';
  population.textContent = '-';
  capitalCity.textContent = '-';
  httpStatus.textContent = '-';
});
