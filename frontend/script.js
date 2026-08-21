function validateForm(data) {
  const errors = [];
  if (!data.firstName || !data.firstName.trim()) errors.push('First Name is required.');
  if (!data.lastName || !data.lastName.trim()) errors.push('Last Name is required.');
  if (!data.birthdate) errors.push('Birthdate is required.');
  if (!data.countryCode) errors.push('Country Code is required.');
  return errors;
}

if (typeof document !== 'undefined') {
  const form = document.getElementById('regForm');
  const errorsDiv = document.getElementById('errors');
  const countryInfoDiv = document.getElementById('countryInfo');
  const errorInfoDiv = document.getElementById('errorInfo');

  async function fetchCountry(code) {
    try {
      const res = await fetch(`https://countries.dev/alpha/${code}`);
      if (!res.ok) {
        throw new Error(`HTTP_${res.status}`);
      }
      const data = await res.json();
      const currencyCode = data.currencies && data.currencies[0] ? data.currencies[0].code : 'N/A';
      countryInfoDiv.textContent =
        `Currency: ${currencyCode}, Population: ${data.population}, Capital: ${data.capital}`;
      errorInfoDiv.textContent = '';
    } catch (err) {
      const status = err.message.startsWith('HTTP_') ? err.message.split('_')[1] : 'unknown';
      errorInfoDiv.textContent = `Failed to fetch country info. Status: ${status}`;
      countryInfoDiv.textContent = '';
    }
  }

  document.getElementById('countryCode').addEventListener('change', (e) => {
    if (e.target.value) fetchCountry(e.target.value);
  });

  document.getElementById('clearBtn').addEventListener('click', () => {
    form.reset();
    errorsDiv.textContent = '';
    countryInfoDiv.textContent = '';
    errorInfoDiv.textContent = '';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      birthdate: document.getElementById('birthdate').value,
      countryCode: document.getElementById('countryCode').value,
    };
    const errors = validateForm(data);
    errorsDiv.textContent = errors.join(' ');
    if (errors.length) return;

    const res = await fetch('http://localhost:3000/api/attendees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    console.log('Saved:', result);
  });
}

if (typeof module !== 'undefined') module.exports = { validateForm };
