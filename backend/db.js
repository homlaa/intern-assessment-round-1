const Database = require('better-sqlite3');
const db = new Database('attendees.db');

db.exec(`
CREATE TABLE IF NOT EXISTS CountryDetails (
  countryCode TEXT PRIMARY KEY,
  currencyCode TEXT,
  population INTEGER,
  capital TEXT,
  phoneCode TEXT
);

CREATE TABLE IF NOT EXISTS PersonalInformation (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  birthdate TEXT NOT NULL,
  countryCode TEXT NOT NULL,
  FOREIGN KEY (countryCode) REFERENCES CountryDetails(countryCode)
);
`);

module.exports = db;