document.addEventListener('DOMContentLoaded', () => {


    const item = localStorage.getItem('location');
    let divs = `<div> ${item} </div>`
    let holder = document.querySelector('.results')
    holder.innerHTML = divs

})