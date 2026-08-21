const express = require("express");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const datab = new Database("attendees.db");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


db.exec(`
  CREATE TABLE IF NOT EXISTS CountryDetails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    country_code TEXT UNIQUE NOT NULL,
    phone_code TEXT
  );

  CREATE TABLE IF NOT EXISTS PersonalInformation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    birthdate TEXT NOT NULL,
    country_code TEXT NOT NULL,
    FOREIGN KEY (country_code) REFERENCES CountryDetails(country_code)
  );
`);

app.post("/api/attendees", (req, res) => {
  const { firstName, lastName, birthdate, countryCode, phoneCode } = req.body;

  if (!firstName || !lastName || !birthdate || !countryCode) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    db.prepare(`
      INSERT INTO CountryDetails (country_code, phone_code)
      VALUES (?, ?)
      ON CONFLICT(country_code) DO UPDATE SET
        phoneCode = excluded.phoneCode
    `).run(countryCode, phoneCode);

    
    const info = db.prepare(`
      INSERT INTO PersonalInformation (first_name, last_name, birthdate, country_code)
      VALUES (?, ?, ?, ?)
    `).run(firstName, lastName, birthdate, countryCode);

    
    const result = db.prepare(`
      SELECT p.first_name, p.last_name, c.phone_code
      FROM PersonalInformation p
      JOIN CountryDetails c ON p.country_code = c.country_code
      WHERE p.id = ?
    `).get(info.lastInsertRowid);

    res.json({ message: "Attendee saved.", data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));





``
