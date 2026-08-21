const express = require("express");
const path = require("path");
const pool = require("./db");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/attendees", async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            birthdate,
            countryCode,
            currencyCode,
            population,
            capitalCity,
            phoneCode
        } = req.body;

        if (
            !firstName ||
            !lastName ||
            !birthdate ||
            !countryCode
        ) {
            return res.status(400).json({
                message: "All required fields must be provided."
            });
        }

        // Save country details
        await pool.query(
            `
            INSERT INTO CountryDetails
                (country_code, currency_code, population, capital_city, phone_code)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (country_code)
            DO UPDATE SET
                currency_code = EXCLUDED.currency_code,
                population = EXCLUDED.population,
                capital_city = EXCLUDED.capital_city,
                phone_code = EXCLUDED.phone_code
            `,
            [
                countryCode,
                currencyCode,
                population,
                capitalCity,
                phoneCode
            ]
        );

        // Save personal information
        await pool.query(
            `
            INSERT INTO PersonalInformation
                (first_name, last_name, birthdate, country_code)
            VALUES ($1, $2, $3, $4)
            `,
            [
                firstName,
                lastName,
                birthdate,
                countryCode
            ]
        );

        // Required JOIN query
        const result = await pool.query(
            `
            SELECT
                CONCAT(p.first_name, ' ', p.last_name) AS full_name,
                c.phone_code
            FROM PersonalInformation p
            JOIN CountryDetails c
                ON p.country_code = c.country_code
            WHERE p.first_name = $1
              AND p.last_name = $2
            ORDER BY p.id DESC
            LIMIT 1
            `,
            [firstName, lastName]
        );

        res.status(201).json({
            message: "Attendee registered successfully.",
            attendee: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
