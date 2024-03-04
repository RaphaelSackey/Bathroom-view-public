document.addEventListener('DOMContentLoaded', function() {
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
    let place = autocomplete.getPlace();

    if (!place.geometry){
        document.querySelector('.search').placeholder = 'enter a valid place'
    }else{
        let latitude = place.geometry.location.lat();
        let longitude = place.geometry.location.lng();
        localStorage.setItem('latitude',latitude)
        localStorage.setItem('longitude',longitude)
        window.location.href = 'results.html'
    }
    

}


function Autocomplete(){
    autocomplete = new google.maps.places.Autocomplete(
        document.querySelector('.search')
    );

}

