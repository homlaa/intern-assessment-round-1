const form = document.getElementById("registrationForm");

const firstNameInput =
    document.getElementById("firstName");

const lastNameInput =
    document.getElementById("lastName");

const birthdateInput =
    document.getElementById("birthdate");

const countryCodeSelect =
    document.getElementById("countryCode");

const clearButton =
    document.getElementById("clearButton");

const testInvalidButton =
    document.getElementById("testInvalidButton");


let selectedCountryData = null;

function validateForm() {

    let isValid = true;

    document.getElementById(
        "firstNameError"
    ).textContent = "";

    document.getElementById(
        "lastNameError"
    ).textContent = "";

    document.getElementById(
        "birthdateError"
    ).textContent = "";

    document.getElementById(
        "countryCodeError"
    ).textContent = "";


    if (firstNameInput.value.trim() === "") {

        document.getElementById(
            "firstNameError"
        ).textContent =
            "First Name is required.";

        isValid = false;
    }


    if (lastNameInput.value.trim() === "") {

        document.getElementById(
            "lastNameError"
        ).textContent =
            "Last Name is required.";

        isValid = false;
    }


    if (birthdateInput.value === "") {

        document.getElementById(
            "birthdateError"
        ).textContent =
            "Birthdate is required.";

        isValid = false;
    }


    if (countryCodeSelect.value === "") {

        document.getElementById(
            "countryCodeError"
        ).textContent =
            "Please select a country.";

        isValid = false;
    }


    return isValid;
}


async function fetchCountryData(countryCode) {

    try {

        const response = await fetch(
            `https://countries.dev/alpha/${countryCode}`
        );


        if (!response.ok) {

            throw new Error(
                `HTTP Status: ${response.status}`
            );
        }


        const country = await response.json();


        const currencyCode =
            country.currencies &&
            country.currencies.length > 0
                ? country.currencies[0].code
                : "Not available";


        const phoneCode =
            country.callingCodes &&
            country.callingCodes.length > 0
                ? country.callingCodes[0]
                : "Not available";


        document.getElementById(
            "currency"
        ).textContent = currencyCode;


        document.getElementById(
            "population"
        ).textContent =
            country.population.toLocaleString();


        document.getElementById(
            "capital"
        ).textContent =
            country.capital || "Not available";


        document.getElementById(
            "phoneCode"
        ).textContent =
            `+${phoneCode}`;


        selectedCountryData = {

            currencyCode: currencyCode,

            population: country.population,

            capitalCity:
                country.capital || "Not available",

            phoneCode: phoneCode
        };


    } catch (error) {

        console.error(
            "Country API error:",
            error
        );


        document.getElementById(
            "currency"
        ).textContent = "-";

        document.getElementById(
            "population"
        ).textContent = "-";

        document.getElementById(
            "capital"
        ).textContent = "-";

        document.getElementById(
            "phoneCode"
        ).textContent = "-";


        selectedCountryData = null;
    }
}


countryCodeSelect.addEventListener(
    "change",
    async function () {

        const countryCode =
            countryCodeSelect.value;


        if (countryCode !== "") {

            await fetchCountryData(
                countryCode
            );
        }
    }
);


form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const isValid =
            validateForm();


        if (!isValid) {
            return;
        }


        if (!selectedCountryData) {

            document.getElementById(
                "message"
            ).textContent =
                "Country information could not be loaded.";

            return;
        }


        const registrationData = {

            firstName:
                firstNameInput.value.trim(),

            lastName:
                lastNameInput.value.trim(),

            birthdate:
                birthdateInput.value,

            countryCode:
                countryCodeSelect.value,

            currencyCode:
                selectedCountryData.currencyCode,

            population:
                selectedCountryData.population,

            capitalCity:
                selectedCountryData.capitalCity,

            phoneCode:
                selectedCountryData.phoneCode
        };


        try {

            const response =
                await fetch(
                    "/api/attendees",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                registrationData
                            )
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Failed to save attendee."
                );
            }


            document.getElementById(
                "message"
            ).textContent =
                "Registration saved successfully!";


            console.log(
                "JOIN result:",
                result.attendee
            );


        } catch (error) {

            document.getElementById(
                "message"
            ).textContent =
                `Error: ${error.message}`;
        }

    }
);


clearButton.addEventListener(
    "click",
    function () {

        form.reset();

        selectedCountryData = null;


        document.getElementById(
            "currency"
        ).textContent = "-";

        document.getElementById(
            "population"
        ).textContent = "-";

        document.getElementById(
            "capital"
        ).textContent = "-";

        document.getElementById(
            "phoneCode"
        ).textContent = "-";


        document.getElementById(
            "message"
        ).textContent = "";


        document.getElementById(
            "errorStatus"
        ).textContent = "";


        document.querySelectorAll(
            ".error"
        ).forEach(function (element) {

            element.textContent = "";
        });
    }
);


testInvalidButton.addEventListener(
    "click",
    async function () {

        try {
            const successResponse =
                await fetch(
                    "https://countries.dev/alpha/RW"
                );


            console.log(
                "Successful request status:",
                successResponse.status
            );

            const invalidResponse =
                await fetch(
                    "https://countries.dev/alpha/INVALID"
                );


            if (!invalidResponse.ok) {

                document.getElementById(
                    "errorStatus"
                ).textContent =
                    `Request failed with HTTP status: ${invalidResponse.status}`;

                throw new Error(
                    `HTTP Status: ${invalidResponse.status}`
                );
            }


        } catch (error) {

            console.error(
                "Troubleshooting error:",
                error.message
            );
        }

    }
);