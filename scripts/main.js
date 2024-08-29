"use strict";

var userLang = navigator.language || navigator.userLanguage;

window.onload = function() {
    console.log("onLoad Function");
    fetchRecommendedPodcasts();
    const resultsDiv = document.getElementById('podcast-list');
    resultsDiv.innerHTML = 'Empfohlene Podcast werden geladen...';
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
        podcastTitle.innerHTML = truncateText(data.data.episodes[0].title,10);
        podcastImage.src = data.data.layoutImageURL;
        podcastDiv.appendChild(podcastImage);
        podcastDiv.appendChild(podcastTitle);
        link.appendChild(podcastDiv)
        div.appendChild(link);
        
    }
    catch (error) {
        console.error('Error fetching recommended podcasts:', error);
        document.getElementById('podcast-list').innerHTML = '<p class="loading-message">Error fetching recommended podcasts. Please try again later.</p>';
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
    resultsDiv.innerHTML = 'Search is running...';
    fetchPodcasts(searchTitle);
}

async function fetchPodcasts(title) {
    let url = new URL('https://api.fyyd.de/0.2/search/podcast/');
    url.searchParams.append('title', title);
    console.log('URL:', url.href);
    try {
        const response = await fetch(url);
        const data = await response.json();
        insertSearchResults(data);
    } catch (error) {
        console.error('Error fetching podcasts:', error);
        document.getElementById('podcast-list').innerHTML = '<p class="loading-message">Error fetching podcasts. Please try again later.</p>';

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
        document.getElementById('podcast-list').innerHTML = '<p class="loading-message">Error fetching recommended podcasts. Please try again later.</p>';

    }
}
async function fetchSearchPodcasts() {
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
        document.getElementById('search').innerHTML = '<p class="loading-message">Error fetching recommended podcasts. Please try again later.</p>';

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

        titleDiv.textContent = truncateText(podcast.title,10);
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

function insertSearchResults(data) {
    const resultsDiv = document.getElementById('search');
    resultsDiv.innerHTML = '';
    data.data.forEach(podcast => {
        const podcastDiv = document.createElement('div');
        const titleDiv = document.createElement('h4');
        const descriptionDiv = document.createElement('p');
        const podcastImage = document.createElement('img');
        const podcastLink = document.createElement('a');

        titleDiv.textContent = truncateText(podcast.title,10);
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

function truncateText(text, wordLimit) {
    const words = text.split(' ');
    if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
}

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
                fetchCategoryPodcasts(element.id,element.name_de);
            });

            catBtndiv.appendChild(catBtn);
        });
        div.appendChild(catBtndiv);
    } catch (error) {
        console.error('Error fetching categories:', error);
        document.getElementById("categoryContainer").innerHTML = '<p>Error fetching podcasts. Please try again later.</p>';
    }
}

async function fetchCategoryPodcasts(id,name) {
    let url = new URL('https://api.fyyd.de/0.2/category');
    url.searchParams.append('category_id',id);
    console.log('URL:', url.href);
    const resultsDiv = document.getElementById("categoryResult");
    resultsDiv.innerHTML = "Inhalte der Kategorie " + name + " werden geladen";
    try {
        const response = await fetch(url);
        const data = await response.json();
        insertCategorySearchResults(data);
        
    } catch (error) {
        console.error('Error fetching category podcasts:', error);
        document.getElementById("categoryResult").innerHTML = '<p class="loading-message">Error fetching category podcasts. Please try again later.</p>';

    }
}

function insertCategorySearchResults(data) {
    const resultsDiv = document.getElementById("categoryResult");
    resultsDiv.innerHTML = '';
    data.data.podcasts.forEach(podcasts => {
        const podcastDiv = document.createElement('div');
        const titleDiv = document.createElement('h4');
        //const descriptionDiv = document.createElement('p');
        const podcastImage = document.createElement('img');
        const podcastLink = document.createElement('a');

        titleDiv.textContent = truncateText(podcasts.title,10);
        //descriptionDiv.textContent = truncateText(podcasts.description, 40);
        podcastImage.src = podcasts.layoutImageURL;
        podcastImage.className = 'img'; // Added class for image styling

        podcastLink.appendChild(podcastImage);
        podcastLink.appendChild(titleDiv);
        //podcastLink.appendChild(descriptionDiv);

        podcastLink.href = `podcastDash.html?id=${encodeURIComponent(podcasts.id)}&title=${encodeURIComponent(podcasts.title)}&description=${encodeURIComponent(podcasts.description)}&image=${encodeURIComponent(podcasts.layoutImageURL)}`;
        podcastLink.target = "_blank";
        podcastDiv.appendChild(podcastLink);

        resultsDiv.appendChild(podcastDiv);
    });
}
