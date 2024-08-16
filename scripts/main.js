"use strict";

var userLang = navigator.language || navigator.userLanguage;

window.onload = function() {
    console.log("onLoad Function");
    fetchRecommendedPodcasts();
    const resultsDiv = document.getElementById('podcast-list');
    resultsDiv.innerHTML = '<p class="loading-message">Loading recommended Podcasts...</p>';

    const searchInput = document.getElementById('search-title');
    if (searchInput) {
        searchInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                console.log("Enter key pressed");
                searchPodcasts();
            }
        });
    } else {
        console.error("Search input field not found");
    }

};

function cloneImage(event) {
    const clickedImage = event.target;
    const clonedImage = clickedImage.cloneNode(true);
    clickedImage.parentNode.appendChild(clonedImage);
}

function searchPodcasts() {
    const searchTitle = document.getElementById('search-title').value;
    const resultsDiv = document.getElementById('podcast-list');
    resultsDiv.innerHTML = '<p class="loading-message">Search is running...</p>';
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
        console.log(data);
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
        insertSearchResults(data);
        console.log(data);
    } catch (error) {
        console.error('Error fetching recommended podcasts:', error);
        document.getElementById('podcast-list').innerHTML = '<p class="loading-message">Error fetching recommended podcasts. Please try again later.</p>';

    }
}

function getRandomInt(max){
    return Math.floor(Math.random() * max);
}

function insertSearchResults(data) {
    const resultsDiv = document.getElementById('podcast-list');
    resultsDiv.innerHTML = '';
    data.data.forEach(podcast => {
        const podcastDiv = document.createElement('div');
        const titleDiv = document.createElement('h4');
        const descriptionDiv = document.createElement('p');
        const podcastImage = document.createElement('img');
        const podcastLink = document.createElement('a');

        titleDiv.textContent = podcast.title;
        descriptionDiv.textContent = truncateText(podcast.description, 40);
        podcastImage.src = podcast.layoutImageURL;
        podcastImage.className = 'img'; // Added class for image styling

        podcastLink.appendChild(podcastImage);
        podcastLink.appendChild(titleDiv);
        //podcastLink.appendChild(descriptionDiv);

        podcastLink.href = `podcastDash.html?id=${encodeURIComponent(podcast.id)}&title=${encodeURIComponent(podcast.title)}&description=${encodeURIComponent(podcast.description)}&image=${encodeURIComponent(podcast.layoutImageURL)}`;
       
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
