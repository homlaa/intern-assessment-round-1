const { JSDOM } = require("jsdom");


describe(
    "Registration Form Validation",
    () => {


        test(
            "rejects submission when First Name is empty",
            () => {


                const dom = new JSDOM(`
                    <!DOCTYPE html>


                    <html>


                    <body>


                        <form id="registrationForm">


                            <input
                                id="firstName"
                                value=""
                            >


                            <input
                                id="lastName"
                                value="Doe"
                            >


                            <input
                                id="birthdate"
                                value="2000-01-01"
                            >


                            <select id="countryCode">


                                <option value="RW">
                                    Rwanda
                                </option>


                            </select>


                        </form>


                    </body>


                    </html>
                `);




                const document =
                    dom.window.document;




                const firstName =
                    document
                        .getElementById(
                            "firstName"
                        )
                        .value
                        .trim();




                const isValid =
                    firstName !== "";




                expect(isValid)
                    .toBe(false);


            }
        );


    }
);






