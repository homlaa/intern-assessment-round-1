const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { validateRegistration } = require('./formValidation');

const app = express();
const port = 3000;
const db = new sqlite3.Database('./attendees.db');

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const countryCodes = ['RW', 'KE', 'UG', 'DE', 'US', 'FR'];

function initDb() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS CountryDetails (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        country_code TEXT NOT NULL UNIQUE,
        currency_code TEXT NOT NULL,
        population INTEGER NOT NULL,
        capital_city TEXT NOT NULL,
        phone_code TEXT NOT NULL
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS PersonalInformation (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        birth_date TEXT NOT NULL,
        country_code TEXT NOT NULL,
        FOREIGN KEY (country_code) REFERENCES CountryDetails(country_code)
      )
    `);
  });
}

async function fetchCountryDetails(countryCode) {
  const response = await fetch(`https://countries.dev/alpha/${countryCode}`);

  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();

  return {
    countryCode: data.alpha2Code || countryCode,
    currencyCode: data.currencies?.[0]?.code || 'N/A',
    population: data.population ?? 0,
    capitalCity: data.capital || 'N/A',
    phoneCode: data.callingCodes?.[0] || 'N/A',
  };
}

function saveCountryIfNeeded(details) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR IGNORE INTO CountryDetails (country_code, currency_code, population, capital_city, phone_code)
       VALUES (?, ?, ?, ?, ?)`,
      [details.countryCode, details.currencyCode, details.population, details.capitalCity, details.phoneCode],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      }
    );
  });
}

function saveAttendee(payload) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO PersonalInformation (first_name, last_name, birth_date, country_code)
       VALUES (?, ?, ?, ?)`,
      [payload.firstName, payload.lastName, payload.birthDate, payload.countryCode],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ id: this.lastID });
      }
    );
  });
}

app.get('/api/country-options', (req, res) => {
  res.json({ countryCodes });
});

app.get('/api/countries/:countryCode', async (req, res) => {
  try {
    const details = await fetchCountryDetails(req.params.countryCode);
    res.json(details);
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message,
      status: error.status || 500,
    });
  }
});

app.post('/api/attendees', async (req, res) => {
  try {
    const payload = req.body || {};
    const validation = validateRegistration(payload);

    if (!validation.isValid) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.errors,
      });
    }

    const countryDetails = await fetchCountryDetails(payload.countryCode);
    await saveCountryIfNeeded(countryDetails);

    const attendee = await saveAttendee({
      firstName: payload.firstName,
      lastName: payload.lastName,
      birthDate: payload.birthDate,
      countryCode: payload.countryCode,
    });

    db.get(
      `SELECT pi.first_name, pi.last_name, cd.phone_code
       FROM PersonalInformation pi
       JOIN CountryDetails cd ON pi.country_code = cd.country_code
       WHERE pi.id = ?`,
      [attendee.id],
      (err, row) => {
        if (err) {
          return res.status(500).json({ message: 'Query failed', error: err.message });
        }

        return res.status(201).json({
          message: 'User registered successfully',
          attendee,
          joinResult: row || null,
          countryDetails,
        });
      }
    );
  } catch (error) {
    const status = Number(error.status) || 500;
    res.status(status).json({
      message: error.message,
      status,
    });
  }
});

app.listen(port, () => {
  initDb();
  console.log(`Server is running on port ${port}`);
});

module.exports = { app, fetchCountryDetails, validateRegistration };
