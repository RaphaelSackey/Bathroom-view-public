
document.addEventListener('DOMContentLoaded', function() {
    signInOut();
    document.querySelector('.search-bar').addEventListener('submit', function(event) {
        event.preventDefault();
        formSubmitHandler();
    });
});


let autocomplete;

function formSubmitHandler() {
    if (!autocomplete) {
        console.error('Autocomplete is not initialized.');
        return;
    }
    
    // Show loader
    document.getElementById('loader').style.display = 'block';

    let place = autocomplete.getPlace();

    if (!place.geometry){
        document.querySelector('.search').placeholder = 'enter a valid place'
        // Hide loader if search fails
        document.getElementById('loader').style.display = 'none';
    }else{
        let latitude = place.geometry.location.lat();
        let longitude = place.geometry.location.lng();
        fetchBathroomData(latitude,longitude)

    }
    

}


function Autocomplete(){
    autocomplete = new google.maps.places.Autocomplete(
        document.querySelector('.search')
    );

}

async function fetchBathroomData(latitude, longitude) {
    try {
        const response = await fetch('http://127.0.0.1:5001/bathroomData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latitude, longitude }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // console.log(data);
        localStorage.setItem('apiResponse', JSON.stringify(data)); // Example: Save the response
        window.location.href = 'results.html';
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Hide loader after search completes
        document.getElementById('loader').style.display = 'none';
    }
}

async function checkLoggedIn(event){
    event.preventDefault()
    try{
        const response = await fetch(' http://127.0.0.1:5001/validSession', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
            
        })

        if ( !response.ok){
            throw new Error('Network response was not ok');
        }

        const data = await response.json()
        console.log(data.message)
        if (data.message == 'valid'){
            window.location = './profile.html'
        }
        else if(data.message == 'invalid'){
            alert('Sign in to view profile')
        }
    }catch (error) {
        console.error('Error:', error);
    }
}


async function signInOut(){
    console.log('im working')
    try{
        const response = await fetch(' http://127.0.0.1:5001/validSession', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
            
        })

        if ( !response.ok){
            throw new Error('Network response was not ok');
        }

        const data = await response.json()
        const sign_in = document.querySelector('.sign-in-test')
        if (data.message == 'valid'){
            sign_in.innerText = ""
            sign_in.innerText = "Sign Out"
        }
        else if(data.message == 'invalid'){
            sign_in.innerText = ""
            sign_in.innerText = "Sign In"
        }
    }catch (error) {
        console.error('Error:', error);
    }
}
