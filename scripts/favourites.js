function addFavourite() {
    console.log("favourite");
    const podcastId = getQueryParams().id; // Beispiel: podcastId aus den Query-Parametern holen
    
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (!favorites.includes(podcastId)) {
        favorites.push(podcastId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert("Podcast wurde zu den Favoriten hinzugefügt!");
    } else {
        alert("Podcast ist bereits in den Favoriten.");
    }
}