 async function getResults(){
    const results = JSON.parse(localStorage.getItem('apiResponse'));
    
    // Update the page content with bathroom data
    let holder = document.querySelector('.results');
    if (results.length > 0) {
        console.log(results)
        results.forEach((item) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'bathroom-card'
            
            const top_section = document.createElement('div')
            top_section.className = 'top_section'
            const bottom_section = document.createElement('div')
            bottom_section.className = 'bottom_section'

            const name = document.createElement('h2')
            name.className = 'bathroom-name'
            name.innerText = item.name
            top_section.appendChild(name)
            
            const street = document.createElement('span')
            street.className = 'bathroom-street'
            street.innerText = item.street
            top_section.appendChild(street)
            

            const left_bottom = document.createElement('div')
            left_bottom.className = 'left_bottom'
            const img = document.createElement('img')
            img.className = 'bathroom-card-image'
            if(!item.image){
                img.src = '../temp-images/bathroom-img.jpg';
            }else{
                img.src = item.image
            }
            
            left_bottom.appendChild(img);


            const right_bottom = document.createElement('div')
            right_bottom.className = 'right_bottom'

            const accessible = document.createElement('div')
            
            const accessible_image = document.createElement('img')
            accessible_image.className = 'info_image'
            accessible_image.src = '../temp-images/wheelchair.png'
            
            accessible.className = 'accessible'
            if (item.accessible){
                accessible.appendChild(accessible_image)
                right_bottom.appendChild(accessible)
            }
            
            

            
            const unisex = document.createElement('div')
            const unisex_image = document.createElement('img')
            unisex_image.className = 'info_image'
            unisex_image.src = '../temp-images/unisex.png'
            unisex.className = 'unisex'
            if (item.unisex){
                unisex.appendChild(unisex_image)
                right_bottom.appendChild(unisex)
            }
            
            
            const distance = document.createElement('h5')
            distance.className = 'distance'
            distance.innerText = item.distance
            right_bottom.appendChild(distance)


            bottom_section.appendChild(left_bottom)
            bottom_section.appendChild(right_bottom)

            const comment_button = document.createElement('button')
            comment_button.className = 'comment_button'
            comment_button.innerText = 'View Comments'
            comment_button.id = item.id
            comment_button.onclick = display_comments

            itemDiv.appendChild(top_section)
            itemDiv.appendChild(bottom_section)
            itemDiv.append(comment_button)


            holder.appendChild(itemDiv)

        
        });
    } else {
        const noneFound = document.createElement('div')
        noneFound.innerText = 'No results found'
        holder.appendChild(noneFound);
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



async function display_comments(event){
    const id = event.target.id
    console.log(`clicked ${id}`)
    try{
        const response = await fetch('http://127.0.0.1:5001/getComments',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({bathroomId: id}),
            credentials: 'include'
        })

        if(!response){
            throw new Error('Network response was not ok');
        }

        const data = await response.json()
        if(data.message === 'success'){
            console.log(data.data)
            const comment_div = document.getElementById('commentSection')
            const comment_container = document.querySelector('.comments') 
            const writeCommentButton = document.getElementById('writeComment')
            comment_div.classList.add('comment-section-show')
            writeCommentButton.setAttribute('data-restaurant-id', id);
            
            if(data.data.length > 0){
                data.data.forEach(item => {
                    const commentCard = document.createElement('div')
                    commentCard.className = 'comment_card'
                    
                    const name = document.createElement('span')
                    name.className = 'name'
                    name.innerText = `${item[1]} said: `
    
                    const comment = document.createElement('span')
                    comment.className = 'user_comment'
                    comment.innerText = item[0]
    
                    commentCard.appendChild(name)
                    commentCard.appendChild(comment)
    
                    comment_container.appendChild(commentCard)
    
                })
            }else{
                const noComments = document.createElement('div')
                noComments.className = 'noComments'
                noComments.innerText = 'This bathroom has no comments'

                comment_container.appendChild(noComments)

            }
          
            
        }else{
            alert('something went wrong')
        }
        
    }catch (error) {
        console.error('Error:', error);
    }
    
    
    
}

function closeComment (){
    const comment_container = document.querySelector('.comments')
    comment_container.replaceChildren();
    const comment_div = document.getElementById('commentSection')
    comment_div.classList.remove('comment-section-show')
}


async function showWriteComment(restaurantId){
    try{
        const response = await fetch(' http://127.0.0.1:5001/validSession', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
            
        })

        if ( !response){
            throw new Error('Network response was not ok');
        }

        const data = await response.json()
        console.log(data.message)
        if (data.message == 'valid'){
            const form = document.querySelector('.addComment')
            console.log(restaurantId)
            form.style.display = 'block'
            closeComment ()
            
            let hiddenInput = form.querySelector('input[type="hidden"]');
            hiddenInput.value = restaurantId
        }
        else if(data.message == 'invalid'){
            
            alert('You need to sign in to write a comment')
        }
    }catch (error) {
        console.error('Error:', error);
    }
}


document.querySelector('.addComment').addEventListener('submit', async(e) =>{

    e.preventDefault()
    const comment = e.target.elements['commentText'].value
    const restaurantId = e.target.elements['restaurantId'].value
    const response = await addRestaurantComment(restaurantId, comment)
    // console.log(comment)
    // console.log(restaurantId)
    if (response === 'success'){
        alert('comment submitted')
        e.target.elements['commentText'].value = ''
        closeWriteComment()
    }
    else{
        alert('something went wrong')
    }
    
    
})


async function addRestaurantComment(restaurantId, comment){
    try{
        const response = await fetch ('http://127.0.0.1:5001/addComment', 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({restaurantId: restaurantId, comment: comment }),
            credentials: 'include'
        }
        )
    
        if ( !response){
            throw new Error('Network response was not ok');
        }
    
        const data = await response.json()
        if (data['message'] === 'success'){
            return 'success'
        }else{
            return 'fail'
        }
    }catch(error) {
        console.error('Error:', error);
    }
   

}

function closeWriteComment(){
    const form = document.querySelector('.addComment')
    form.style.display = 'none'
}