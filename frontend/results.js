document.addEventListener('DOMContentLoaded', () => {


    const longitude = localStorage.getItem('longitude');
    const latitude = localStorage.getItem('latitude')
    
    let divs = `<div> ${longitude} --- ${latitude} </div>`
    let holder = document.querySelector('.results')
    holder.innerHTML = divs

})