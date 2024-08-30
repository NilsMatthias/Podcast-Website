"use strict";

var userLang = navigator.language || navigator.userLanguage;

window.onload = function() {
    console.log("onLoad Function");
    fetchRecommendedPodcasts();
    const resultsDiv = document.getElementById('podcast-list');
    resultsDiv.innerHTML = '<p class="loading-message">Empfohlene Podcast werden geladen...</p>';
    getCategories();
    const searchInput = document.getElementById('search-title');
    if (searchInput) {
        searchInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                searchPodcasts();
            }
        });
    } else {
        console.error("Search input field not found");
    }
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            console.log(favorites)
            favorites.forEach(element => {
                insertFavouriteEpisodes(element);
            });

};
async function insertFavouriteEpisodes(id){
    var div = document.getElementById("fav-div");
    let url = new URL('https://api.fyyd.de/0.2/podcast/episodes');
    url.searchParams.append("podcast_id", id);
    url.searchParams.append("count", 1);
    console.log('URL:', url.href);
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data.data.episodes);

        const podcastDiv = document.createElement('div');
        const podcastImage = document.createElement('img');
        const podcastTitle = document.createElement('h4');
        const link = document.createElement("a");
        link.href = `podcastDash.html?id=${encodeURIComponent(id)}`;
        link.target = "_blank";
        podcastTitle.innerHTML = data.data.episodes[0].title;
        podcastImage.src = data.data.layoutImageURL;
        podcastDiv.appendChild(podcastImage);
        podcastDiv.appendChild(podcastTitle);
        link.appendChild(podcastDiv)
        div.appendChild(link);
        
    }
    catch (error) {
        console.error('Error fetching recommended podcasts:', error);
        document.getElementById('podcast-list').innerHTML = '<p class="loading-message">Fehler beim Laden empfohlener Podcasts. Bitte probiere es später nochmal.</p>';
    }
}


function cloneImage(event) {
    const clickedImage = event.target;
    const clonedImage = clickedImage.cloneNode(true);
    clickedImage.parentNode.appendChild(clonedImage);
}

function searchPodcasts() {
    const searchTitle = document.getElementById('search-title').value;
    const resultsDiv = document.getElementById('search');
    resultsDiv.innerHTML = '<p class="loading-message">Suche läuft...';
    fetchPodcasts(searchTitle,0);
}

async function fetchPodcasts(title, page) {
    let url = new URL('https://api.fyyd.de/0.2/search/podcast/');
    url.searchParams.append('title', title);
    url.searchParams.append('page', page);
    console.log('URL:', url.href);
    
    const resultsDiv = document.getElementById('search');

    if (page === 0) {
        resultsDiv.innerHTML = '<p class="loading-message suche">Suche läuft...</p>';
    }

    // Remove the "more" button if it exists
    const existingMoreBtn = document.getElementById('more-btn-search');
    if (existingMoreBtn) {
        existingMoreBtn.parentNode.removeChild(existingMoreBtn);
    }

    // Show loading message
    const loadingMessage = document.createElement('p');
    if(page != 0){
        loadingMessage.textContent = 'Ergebnisse werden geladen...';
    }
    
    loadingMessage.setAttribute('id', 'loading-message');
    resultsDiv.appendChild(loadingMessage);

    try {
        const response = await fetch(url);
        const data = await response.json();
        insertSearchResults(data, page);

        // Remove the loading message
        const loadingMessage = document.getElementById('loading-message');
        if (loadingMessage) {
            loadingMessage.remove();
        }

        // Add "more" button if there are more results
        if (data.data.length > 0) {
            // Create the button element with Material Icon
            const moreBtn = document.createElement('button');
            moreBtn.className = "more-button";
            moreBtn.style = "border: none; background: white;"
            moreBtn.setAttribute("id", "more-btn-search"); // ID for the button
            moreBtn.addEventListener('click', function () {
                console.log("moreBtn");
                fetchPodcasts(title, page + 1);
            });

            // Create the icon element
            const icon = document.createElement('img');
            icon.src = "images/arrow_right.png";
            icon.style = "height: 90px; margin-bottom: 125px; padding-left: 40px"
            // Append the icon to the button
            moreBtn.appendChild(icon);

            // Append the button to the container
            resultsDiv.appendChild(moreBtn);
        } else {
            resultsDiv.innerHTML = 'Keine weiteren Ergebnisse.';
        }

    } catch (error) {
        console.error('Error fetching podcasts:', error);
        resultsDiv.innerHTML = '<p class="loading-message">Fehler beim Laden von Podcasts. Bitte probiere es später nochmal.</p>';
    }

}

async function fetchRecommendedPodcasts() {
    let url = new URL('https://api.fyyd.de/0.2/podcasts/');
    url.searchParams.append('page',getRandomInt(1370));
    url.searchParams.append('count',30);
    console.log('URL:', url.href);
    try {
        const response = await fetch(url);
        const data = await response.json();
        insertRecommendedResults(data);
    } catch (error) {
        console.error('Error fetching recommended podcasts:', error);
        document.getElementById('podcast-list').innerHTML = '<p class="loading-message">Fehler beim Laden empfohlener Podcasts. Bitte probiere es später nochmal.</p>';

    }
}
function getRandomInt(max){
    return Math.floor(Math.random() * max);
}

function insertRecommendedResults(data) {
    const resultsDiv = document.getElementById('podcast-list');
    resultsDiv.innerHTML = '';
    data.data.forEach(podcast => {
        const podcastDiv = document.createElement('div');
        const titleDiv = document.createElement('h4');
        const descriptionDiv = document.createElement('p');
        const podcastImage = document.createElement('img');
        const podcastLink = document.createElement('a');

        titleDiv.textContent = podcast.title;
        podcastImage.src = podcast.layoutImageURL;
        podcastImage.className = 'img'; // Added class for image styling

        podcastLink.appendChild(podcastImage);
        podcastLink.appendChild(titleDiv);
        //podcastLink.appendChild(descriptionDiv);

        podcastLink.href = `podcastDash.html?id=${encodeURIComponent(podcast.id)}`;
        podcastLink.target = "_blank";

       
        podcastDiv.appendChild(podcastLink);

        resultsDiv.appendChild(podcastDiv);
    });
}

function insertSearchResults(data, page) {
    const resultsDiv = document.getElementById('search');

    // Wenn es sich um die erste Seite handelt, leeren Sie das Ergebnisfeld
    if (page === 0) {
        resultsDiv.innerHTML = '';
    }

    data.data.forEach(podcast => {
        const podcastDiv = document.createElement('div');
        const titleDiv = document.createElement('h4');
        const podcastImage = document.createElement('img');
        const podcastLink = document.createElement('a');

        titleDiv.textContent = podcast.title;
        podcastImage.src = podcast.layoutImageURL;
        podcastImage.className = 'img'; // Added class for image styling

        podcastLink.appendChild(podcastImage);
        podcastLink.appendChild(titleDiv);

        podcastLink.href = `podcastDash.html?id=${encodeURIComponent(podcast.id)}`;
        podcastLink.target = "_blank";

        podcastDiv.appendChild(podcastLink);

        resultsDiv.appendChild(podcastDiv);
    });
}

// function truncateText(text, wordLimit) {
//     // Überprüfen, ob der Text leer oder undefined ist
//     if (!text || text.trim().length === 0) {
//         throw new Error("Der Text darf nicht leer sein.");
//     }

//     // Überprüfen, ob wordLimit nicht angegeben ist oder kein gültiger Wert ist
//     if (typeof wordLimit !== 'number' || wordLimit <= 0) {
//         throw new Error("Das Wortlimit muss eine positive Zahl sein.");
//     }

//     const words = text.split(' ');
//     if (words.length > wordLimit) {
//         return words.slice(0, wordLimit).join(' ') + '...';
//     }
//     return text;
// }

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}



async function getCategories() {
    let url = new URL('https://api.fyyd.de/0.2/categories');
    console.log('URL:', url.href);
    try {
        const response = await fetch(url);
        const data = await response.json();
        const div = document.getElementById("categoryContainer");

        // Clear any existing content in the div
        div.innerHTML = '';
        const catBtndiv = document.createElement('div');
        data.data.forEach(element => {
            // Create button for each category
            const catBtn = document.createElement('input');
            catBtn.setAttribute("type", "button");
            catBtn.setAttribute("value", element.name_de);
            catBtn.className = 'category-button';
            

            // Add click event listener with a function reference
            catBtn.addEventListener('click', function() {
                fetchCategoryPodcasts(element.id,element.name_de,0);
            });

            catBtndiv.appendChild(catBtn);
            
        });
        div.appendChild(catBtndiv);
        
    } catch (error) {
        console.error('Error fetching categories:', error);
        document.getElementById("categoryContainer").innerHTML = '<p class="loading-message">Fehler beim Laden von Kategorien. Bitte probiere es später nochmal.</p>';
    }
}

async function fetchCategoryPodcasts(id, name, page) {
    let url = new URL('https://api.fyyd.de/0.2/category');
    url.searchParams.append('category_id', id);
    url.searchParams.append('page', page);
    console.log('URL:', url.href);

    const resultsDiv = document.getElementById("categoryResult");

    if (page === 0) {
        // Nur beim ersten Laden die Nachricht anzeigen und den Inhalt leeren
        resultsDiv.innerHTML = '<p class="loading-message">Inhalte der Kategorie ' + name + ' werden geladen...</p>';
    } else {
        // Entferne den "More"-Button und zeige die Lade-Nachricht an
        const existingMoreBtn = document.getElementById('more-btn');
        if (existingMoreBtn) {
            resultsDiv.removeChild(existingMoreBtn);
        }

        const loadingMessage = document.createElement('p');
        loadingMessage.textContent = "Weitere Podcasts werden geladen...";
        loadingMessage.setAttribute("id", "loading-message");
        resultsDiv.appendChild(loadingMessage);
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Füge die neuen Podcasts hinzu
        insertCategorySearchResults(data, page === 0);

        // Entferne die Lade-Nachricht
        const loadingMessage = document.getElementById('loading-message');
        if (loadingMessage) {
            resultsDiv.removeChild(loadingMessage);
        }
// Erstelle oder repositioniere den "More"-Button ans Ende
const moreBtn = document.createElement('button'); // Ändere 'input' zu 'button'
moreBtn.setAttribute("type", "button");  // Setze den Typ für den Button
moreBtn.setAttribute("id", "more-btn"); // Füge eine ID hinzu, um den Button später leicht zu finden
moreBtn.style = "border: none; background: white;"
moreBtn.addEventListener('click', function () {
    console.log("moreBtn");
    fetchCategoryPodcasts(id, name, page + 1);
});

const icon = document.createElement('img');
icon.src = "images/arrow_right.png";
icon.style.height = "90px";
icon.style.marginBottom = "125px";
icon.style.paddingLeft = "40px";
moreBtn.appendChild(icon); // Füge das Bild dem Button hinzu
resultsDiv.appendChild(moreBtn); // Füge den Button dem Container hinzu  // Füge den Button ans Ende des Inhalts ein

    } catch (error) {
        console.error('Error fetching category podcasts:', error);
        document.getElementById("categoryResult").innerHTML = '<p class="loading-message">Fehler beim Laden von Podcasts. Bitte probiere es später nochmal.</p>';
    }
}

function insertCategorySearchResults(data, isInitialLoad) {
    const resultsDiv = document.getElementById("categoryResult");

    if (isInitialLoad) {
        // Nur beim ersten Laden den Inhalt löschen
        resultsDiv.innerHTML = '';
    }

    data.data.podcasts.forEach(podcasts => {
        const podcastDiv = document.createElement('div');
        const titleDiv = document.createElement('h4');
        const podcastImage = document.createElement('img');
        const podcastLink = document.createElement('a');

        titleDiv.textContent = podcasts.title;
        podcastImage.src = podcasts.layoutImageURL;
        podcastImage.className = 'img'; // Added class for image styling

        podcastLink.appendChild(podcastImage);
        podcastLink.appendChild(titleDiv);

        podcastLink.href = `podcastDash.html?id=${encodeURIComponent(podcasts.id)}&title=${encodeURIComponent(podcasts.title)}&description=${encodeURIComponent(podcasts.description)}&image=${encodeURIComponent(podcasts.layoutImageURL)}`;
        podcastLink.target = "_blank";
        podcastDiv.appendChild(podcastLink);

        resultsDiv.appendChild(podcastDiv);
    });
}
