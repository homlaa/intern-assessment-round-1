function validateRegistration(data) {
  const errors = {};

  if (!data || !String(data.firstName || '').trim()) {
    errors.firstName = 'First name is required.';
  }

  if (!data || !String(data.lastName || '').trim()) {
    errors.lastName = 'Last name is required.';
  }

  if (!data || !String(data.birthDate || '').trim()) {
    errors.birthDate = 'Birthdate is required.';
  }

  if (!data || !String(data.countryCode || '').trim()) {
    errors.countryCode = 'Country code is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

module.exports = {
  validateRegistration,
};
