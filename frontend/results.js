
document.addEventListener('DOMContentLoaded', () => {
    const results = JSON.parse(localStorage.getItem('apiResponse'));
    
    let holder = document.querySelector('.results');
    console.log(results)

    if (results) {
        let content = '';
        
        results.forEach(element => {
            content += `<div>name:${element.name}<br> accessible: ${element.accessible} <br> distance: ${element.distance}<br> unisex: ${element.unisex}<br> direction: ${element.directions}</div> `;
            content += `<div>${'-'.repeat(270)}</div>`
        });
        
        holder.innerHTML = content;
    } else {
        holder.innerHTML = '<div>No results found</div>';
    }
});
