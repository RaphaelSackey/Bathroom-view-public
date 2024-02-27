document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.search-bar').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior
        const value = document.querySelector('.search').value
        myCustomFunction(value); // Call your custom function
    });
});

function myCustomFunction(event) {
    console.log(event)
    localStorage.setItem('location',event)
    window.location.href = 'results.html'

}

