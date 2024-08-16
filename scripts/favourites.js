function addFavourite() {
    console.log("favourite");
    const podcastId = getQueryParams().id; // Beispiel: podcastId aus den Query-Parametern holen
    
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (!favorites.includes(podcastId)) {
        favorites.push(podcastId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert("Podcast wurde zu den Favoriten hinzugefügt!");
    } else {
        removeFavourite(podcastId)
    }
}

function removeFavourite(podcastId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(id => id !== podcastId);
    localStorage.setItem('favorites', JSON.stringify(favorites));

    alert("Podcast wurde aus den Favoriten entfernt!");
}