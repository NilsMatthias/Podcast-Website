"use strict";
var userLang = navigator.language || navigator.userLanguage; 
window.onload = function() {
    console.log("onLoad Function");
    fetchRecommendedPodcasts;
  };
function cloneImage(event) {
    const clickedImage = event.target;
    const clonedImage = clickedImage.cloneNode(true);

    clickedImage.parentNode.appendChild(clonedImage);
}

function searchPodcasts() {

    const searchTitle = document.getElementById('search-title').value;

    document.getElementById('status-message').textContent = "";

    const resultsDiv = document.getElementById('podcast-list');
    resultsDiv.innerHTML = '<p>Suche läuft...</p>';

    fetchPodcasts(searchTitle);
}

async function fetchPodcasts(title) {
    let url = new URL('https://api.fyyd.de/0.2/search/podcast/');
    url.searchParams.append('title', title);

    console.log('URL:', url.href);

    try {
        const response = await fetch(url);

        document.getElementById('status-message').textContent = response.status + ': ' + response.statusText;

        const data = await response.json();

        insertSearchResults(data);
        console.log(data);
    }
    catch(error) {
        // Handle the error
    }

}

function insertSearchResults(data) {
    const resultsDiv = document.getElementById('podcast-list');
    resultsDiv.innerHTML = '';

    //data.data.forEach(podcast => {
    for (let podcast of data.data) {
        const podcastDiv = document.createElement('div');
        const titleDiv = document.createElement('h2');
        const descriptionDiv = document.createElement('p');
        const podcastImage = document.createElement('img');
        const podcastLink = document.createElement('a');
        titleDiv.textContent = podcast.title;
        descriptionDiv.textContent = podcast.description;
        podcastImage.src = podcast.layoutImageURL;
        podcastDiv.appendChild(titleDiv);
        podcastDiv.appendChild(podcastImage);
        podcastDiv.appendChild(descriptionDiv);

        if (podcast.htmlURL) {
            podcastLink.href = podcast.htmlURL;
            podcastLink.textContent = "Zum Podcast";
            podcastDiv.appendChild(podcastLink);
        }

        resultsDiv.appendChild(podcastDiv);
    };
}