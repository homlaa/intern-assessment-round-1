const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/attendees', async (req, res) => {
  const { firstName, lastName, birthdate, countryCode } = req.body;
  if (!firstName || !lastName || !birthdate || !countryCode) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const apiRes = await fetch(`https://countries.dev/alpha/${countryCode}`);
    if (!apiRes.ok) throw new Error(`Country lookup failed: ${apiRes.status}`);
    const country = await apiRes.json();

    const currencyCode = country.currencies && country.currencies[0] ? country.currencies[0].code : null;
    const phoneCode = country.callingCodes && country.callingCodes[0] ? `+${country.callingCodes[0]}` : null;

    db.prepare(`
      INSERT INTO CountryDetails (countryCode, currencyCode, population, capital, phoneCode)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(countryCode) DO UPDATE SET
        currencyCode=excluded.currencyCode, population=excluded.population, capital=excluded.capital, phoneCode=excluded.phoneCode
    `).run(countryCode, currencyCode, country.population, country.capital, phoneCode);

    const info = db.prepare(`
      INSERT INTO PersonalInformation (firstName, lastName, birthdate, countryCode)
      VALUES (?, ?, ?, ?)
    `).run(firstName, lastName, birthdate, countryCode);

    res.status(201).json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/attendees/join', (req, res) => {
  const rows = db.prepare(`
    SELECT p.firstName, p.lastName, c.phoneCode
    FROM PersonalInformation p
    JOIN CountryDetails c ON p.countryCode = c.countryCode
  `).all();
  res.json(rows);
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));
