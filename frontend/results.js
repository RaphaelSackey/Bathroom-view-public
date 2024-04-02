 async function getResults(){
    const results = JSON.parse(localStorage.getItem('apiResponse'));
    
    // Update the page content with bathroom data
    let holder = document.querySelector('.results');
    if (results) {
        let content = '';
        results.forEach((element, index) => {
            content += ` Name: ${element.name}<br> Accessible: ${element.accessible}<br> Distance: ${element.distance}<br> Unisex: ${element.unisex}<br> Directions: ${element.directions}</div>`;
            content += `<div>${'-'.repeat(270)}</div>`;
        });
        holder.innerHTML = content;
    } else {
        holder.innerHTML = '<div>No results found</div>';
    }

    // Initialize the map and attempt to place the user's location marker and bathroom markers
    await initMap(results);
};

async function initMap(results) {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    
    // Initialize the map
    map = new Map(document.getElementById("map"), {
        zoom: 6, // Default zoom
        center: { lat: -34.397, lng: 150.644 }, // Temporary center position
        mapId: "DEMO_MAP_ID",
    });
    infoWindow = new google.maps.InfoWindow();

    // Attempt to get the user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const userPos = { lat: position.coords.latitude, lng: position.coords.longitude };
                map.setCenter(userPos);
                map.setZoom(16); // Closer view
                
                // Place a marker for the user's location
                const iconImage = document.createElement("img")
                iconImage.src = "../temp-images/user.png"
                new AdvancedMarkerElement({
                    map: map,
                    position: userPos,
                    title: "Your Location",
                    content: iconImage
                    
                });

                // If bathroom data is available, place those markers
                if (results) {
                    placeBathroomMarkers(results, AdvancedMarkerElement);
                }
            },
            () => {
                handleLocationError(true, infoWindow, map.getCenter());
                if (results) {
                    placeBathroomMarkers(results, AdvancedMarkerElement); // Attempt to place bathroom markers even if location fails
                }
            }
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
        if (results) {
            placeBathroomMarkers(results, AdvancedMarkerElement); // Attempt to place bathroom markers regardless
        }
    }
}

async function placeBathroomMarkers(results, MarkerConstructor) {
    results.forEach((bathroom) => {
        const position = { lat: bathroom.latitude, lng: bathroom.longitude };
        // Ensure that latitude and longitude are numbers
        const iconImage = document.createElement("img")
        iconImage.src = "../temp-images/toilet.png"

        new MarkerConstructor({
            map: map,
            position: position,
            title: bathroom.name,
            content: iconImage,
        });
    });
}
