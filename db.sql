CREATE TABLE IF NOT EXISTS CountryDetails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  country_code TEXT NOT NULL UNIQUE,
  currency_code TEXT NOT NULL,
  population INTEGER NOT NULL,
  capital_city TEXT NOT NULL,
  phone_code TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS PersonalInformation (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  country_code TEXT NOT NULL,
  FOREIGN KEY (country_code) REFERENCES CountryDetails(country_code)
);

SELECT pi.first_name,
       pi.last_name,
       cd.phone_code
FROM PersonalInformation pi
JOIN CountryDetails cd
  ON pi.country_code = cd.country_code;
