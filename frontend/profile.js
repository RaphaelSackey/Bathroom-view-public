// Sample data for favorite and recent bathrooms
const favoriteBathrooms = [];
const recentBathrooms = [];

async function getUserRecentBathrooms(){
    try{
        const response = await fetch(' http://127.0.0.1:5001/getRecentViewed', {
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
        if (data.message == 'success'){
            const recentBathrooms = data.data
            generateRecentBathrooms(data)
        }
        else if(data.message !== 'success'){
            
            alert('something went wrong')
        }
    }catch (error) {
        console.error('Error:', error);
    }
}


async function getUserVisitedBathrooms(){
    try{
        const response = await fetch(' http://127.0.0.1:5001/getVisited', {
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
        if (data.message == 'success'){
            const recentBathrooms = data.data
            generateVisitedBathrooms(recentBathrooms)
        }
        else if(data.message !== 'success'){
            
            alert('something went wrong')
        }
    }catch (error) {
        console.error('Error:', error);
    }
}


function generateVisitedBathrooms(data) {
    console.log(data)
    const visitedBathroomsContainer = document.getElementById("visited-bathrooms");
    visitedBathroomsContainer.innerHTML = ""; // Clear existing content
    data.forEach(item => {
        const bathroomElement = document.createElement("div");
        bathroomElement.className = 'bathroomElementWrapper'
        bathroomElement.setAttribute('data-restaurant-address', item[2])
        bathroomElement.onclick = Navigate

        const bathroomName = document.createElement("h2")
        bathroomName.className = 'bathroomName'
        bathroomName.innerText= item[1]
        
        const bathroomAddress = document.createElement("h5")
        bathroomAddress.className = 'bathroomAddress'
        bathroomAddress.innerText= item[2]

        const imgWrapper = document.createElement("div")
        imgWrapper.className = 'imgWrapper'

        if (item[4] == 1){
            const accessible = document.createElement("img")
            accessible.className = 'accessible'
            accessible.src = '../temp-images/wheelchair.png'

            imgWrapper.appendChild(accessible)
        }

        if (item[3] == 1){
            const unisex = document.createElement("img")
            unisex.className = 'unisex'
            unisex.src = '../temp-images/unisex.png'

            imgWrapper.appendChild(unisex)
        }

        bathroomElement.appendChild(bathroomName )
        bathroomElement.appendChild(bathroomAddress)
        bathroomElement.appendChild(imgWrapper)

        visitedBathroomsContainer.appendChild(bathroomElement)
})
}

//greet user 
function greet(data){
    const welcome = document.createElement("h4")
    welcome.className = 'welcome'
    welcome.innerText = 'Welcome'

    const userName = document.createElement("h1")
    userName.innerText = data.data[0][5]
    userName.className = 'userName'
    const greetDiv = document.querySelector('.welcome-wrapper')

    greetDiv.appendChild(welcome)
    greetDiv.appendChild(userName)
}

// Function to dynamically generate HTML for recent bathrooms
function generateRecentBathrooms(data) {
    greet(data)
    console.log(data)
    const recentBathroomsContainer = document.getElementById("recent-bathrooms");
    recentBathroomsContainer.innerHTML = ""; // Clear existing content
    data.data.forEach(item => {
        const bathroomElement = document.createElement("div");
        bathroomElement.className = 'bathroomElementWrapper'
        bathroomElement.setAttribute('data-restaurant-address', item[2])
        bathroomElement.onclick = Navigate

        const bathroomName = document.createElement("h2")
        bathroomName.className = 'bathroomName'
        bathroomName.innerText= item[1]
        
        const bathroomAddress = document.createElement("h5")
        bathroomAddress.className = 'bathroomAddress'
        bathroomAddress.innerText= item[2]

        const imgWrapper = document.createElement("div")
        imgWrapper.className = 'imgWrapper'

        if (item[4] == 1){
            const accessible = document.createElement("img")
            accessible.className = 'accessible'
            accessible.src = '../temp-images/wheelchair.png'

            imgWrapper.appendChild(accessible)
        }

        if (item[3] == 1){
            const unisex = document.createElement("img")
            unisex.className = 'unisex'
            unisex.src = '../temp-images/unisex.png'

            imgWrapper.appendChild(unisex)
        }

        bathroomElement.appendChild(bathroomName )
        bathroomElement.appendChild(bathroomAddress)
        bathroomElement.appendChild(imgWrapper)
        
        recentBathroomsContainer.appendChild(bathroomElement);
    });
}

function Navigate(event){

    const address = event.currentTarget.getAttribute('data-restaurant-address');
    const encodedAddress = encodeURIComponent(address);
    const body = document.querySelector('body')
    body.style.margin = 0
    const loading = document.querySelector('.loading')
    loading.style.display = 'flex'
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const currentLat = position.coords.latitude;
            const currentLng = position.coords.longitude;

            const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${currentLat},${currentLng}&destination=${encodedAddress}`;
            
            window.open(googleMapsUrl, '_blank');
            loading.style.display = 'none'
            body.style.margin = '8px'
            
        }, function(error) {
            console.error("Error getting the user's location: ", error);
            alert('Error getting current location. Ensure location services are enabled.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
        loading.style.display = 'none'
        body.style.padding = '1rem'
    }
    const bathroomClicked = event.currentTarget.getAttribute('data-bathroom-data')
    addToVisited(JSON.parse(bathroomClicked), address);
    
}
// Call functions to generate HTML for favorite and recent bathrooms when the page loads
window.onload = async function () {
    await getUserVisitedBathrooms()
    await getUserRecentBathrooms()
};
