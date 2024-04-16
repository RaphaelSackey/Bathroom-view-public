// Sample data for favorite and recent bathrooms
const favoriteBathrooms = [
    { id: 1, name: "Favorite Bathroom 1" },
    { id: 2, name: "Favorite Bathroom 2" },
    { id: 3, name: "Favorite Bathroom 3" }
];

const recentBathrooms = [
    { id: 4, name: "Recent Bathroom 1" },
    { id: 5, name: "Recent Bathroom 2" },
    { id: 6, name: "Recent Bathroom 3" }
];


function generateFavoriteBathrooms() {
    const favoriteBathroomsContainer = document.getElementById("favorite-bathrooms");
    favoriteBathroomsContainer.innerHTML = ""; // Clear existing content
    favoriteBathrooms.forEach(bathroom => {
        const bathroomElement = document.createElement("div");
        bathroomElement.textContent = bathroom.name;
        favoriteBathroomsContainer.appendChild(bathroomElement);
    });
}

// Function to dynamically generate HTML for recent bathrooms
function generateRecentBathrooms() {
    const recentBathroomsContainer = document.getElementById("recent-bathrooms");
    recentBathroomsContainer.innerHTML = ""; // Clear existing content
    recentBathrooms.forEach(bathroom => {
        const bathroomElement = document.createElement("div");
        bathroomElement.textContent = bathroom.name;
        recentBathroomsContainer.appendChild(bathroomElement);
    });
}

// Call functions to generate HTML for favorite and recent bathrooms when the page loads
window.onload = function () {
    generateFavoriteBathrooms();
    generateRecentBathrooms();
};
