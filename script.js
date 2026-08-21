const form = document.querySelector('form')
form.addEventListener('submit', function() {
    e.preventDefault();
    
    document.querySelector('#country').addEventListener('change', function(e) {
        document.querySelector('#country')
        let country_code = dropDown.nodeValue
        async () => {
            try {
            let response = await fetch(`https://countries.dev/alpha/${country_code}`)
            if (response) {
                let data = response.json()
            } else {
                throw new Error();
            }
    }
            catch {
                console.err(Error)
            }

        }
    })

})




