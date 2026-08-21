const test = require('node:test');
const assert = require('node:assert/strict');
const { validateRegistration } = require('./formValidation');

test('rejects empty first name', () => {
  const result = validateRegistration({
    firstName: '',
    lastName: 'Sibomana',
    birthDate: '2000-01-01',
    countryCode: 'RW',
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.firstName, 'First name is required.');
});
