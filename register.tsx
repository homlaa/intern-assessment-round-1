
//function to register user data firstName, lastName, countryCode(as a dropdown), birthDate(date picker)


const [firstName, setFirsName] = useState("")
const [lastName, setLastName] = useState("")
const [countryCode, setCountryCode] = useState("")
const [birthDate, setBirthDate] = useState("")


//country code dropdown values 
const countryCodes = ["RW", "KE", "UG", "AU"];

//when user selects a country code from the dropdown, set the country code state
function handleCountryCodeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setCountryCode(event.target.value);
}

//function to register user data
async function register(data: {firstName: string, lastName: string, countryCode: string, birthDate: string}) {
    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error('Error registering user:', error);
    }
}

//button to save data and register 
async function saveData() {
    if(validateData()){
        await register({firstName,lastName,countryCode,birthDate})
    }else{
        alert("Please fill all the fields")
    }
}

//function to clear data
 async function clearData() {
    setFirsName("")
    setLastName("")
    setCountryCode("")
    setBirthDate("")
}
 

//function to validate data
function validateData() {
    if(firstName === "" || lastName === "" || countryCode === "" || birthDate === ""){
        return false
    }
    return true
}
//function to call register function and save data
async function callRegister() {
    await saveData()
}
