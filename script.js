document.addEventListener('DOMContentLoaded', () => {
    const countrySelect = document.querySelector('#country')

    countrySelect.addEventListener('change', async (event) => {
        const countryCode = event.target.value

        try {
            const response = await fetch(`https://countries.dev/alpha/${countryCode}`)

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`)
            }

            const country = await response.json()
            
            console.log('Country data:', country)
        } catch (error) {
            console.error('Unable to load country data:', error)
        }
    })
})




