document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.search-bar').addEventListener('submit', function(event) {
        event.preventDefault();
        formSubmitHandler();
    });
});


let autocomplete;

function formSubmitHandler() {
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
    


    // autocomplete.addListener('place_changed', placeSelected)

}

// function placeSelected(){
//     let place = autocomplete.getPlace();

//     if (!place.geometry){
//         document.querySelector('.search').placeholder = 'enter a valid place'
//     }else{
//         let latitude = place.geometry.location.lat();
//         let longitude = place.geometry.location.lng();
//         console.log('latitude:', latitude )
//         console.log('longitude:', longitude)
//     }
// }