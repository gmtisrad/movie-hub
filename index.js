'use strict'

function renderLandingPage () {
    let landingPage = createNav() + createSearch();

    $('.js-hero').empty();
    $('.js-hero').html(landingPage);
    handleSearch();
    handleSearchClick();
    handleAboutClick();
}

function createNav () {
    let navHtml = `
    <nav class='nav-bar'>
        <span class='nav-item nav-title nav-left js-nav-title'>Movie Hub</span>
        <a href='' class='nav-item nav-right js-nav-search'>Search</a>
        <a href='' class='nav-item nav-right js-nav-About'>About</a>
    </nav>`;

    return navHtml;
}

function handleSearchClick () {
    $('.js-nav-search').on('click', function(event) {
        event.preventDefault();
        renderLandingPage();
    })
}

function handleAboutClick () {
    $('.js-nav-About').on('click', function(event) {
        event.preventDefault();
        renderAboutPage();
    })
}

function renderAboutPage () {
    let aboutHtml = `
        <section id='about'>
            <h3>Hi, I'm Gabe!</h3>
            <p>The purpose of Movie Hub to help you discover new movies, or even just find more information about a movie you may be interested in watching.</p>
            <p>Every element in this project is rendered to the screen using Javascript and JQuery. The APIs used are the <a href='https://www.themoviedb.org/'>tMDB API</a>, the <a href='https://www.nytimes.com/reviews/movies'>New York Times Movie Reviews API</a> and the <a href='https://www.youtube.com/'>Youtube Data API</a>.
            <p>The technologies I used are HTML, CSS, Javascript and JQuery.</p>
            <p>Below are a few ways you can contact me!</p>
            <section class="social-icons">
                    <a href='https://github.com/gmtisrad'><i class="fa fa-github" style='color: black'></i></a>
                    <a href='https://codepen.io/Gabe_M_Timm/'><i class="fa fa-codepen" style='color: black'></i></a>
                    <a href='https://www.linkedin.com/in/gabe-m-timm/'><i class="fa fa-linkedin" style='color: black'></i></a>
                    <a href='mailto:gabe.m.timm@gmail.com'><i class="fa fa-envelope" style='color: black'></i></a>
                </section>
        </section>`
    $('.js-hero').empty();
    $('.js-hero').html(createNav() + aboutHtml);
    handleSearchClick();
    handleAboutClick();
}

function createSearch() {
    let searchHtml = `
            <section class='content search-page'>
                <h1 class='search-header'>Movie Hub</h1>
                <form class='search-form js-search-form'>
                    <label class='hidden' for='movie-input'>Movie title here:</label>
                    <input id='movie-input' type='text' placeholder='Search for your movie!'>
                    <input type='submit' class='hidden' value='submit'>
                </form>
            </section>`;
    
    return searchHtml;
}

function handleSearch () {
    $('.search-form').on('submit', function(event) {
        event.preventDefault();
        let searchQuery = $('#movie-input').val();
        console.log(searchQuery);
        getResultsList(searchQuery);
    });
}

function handleMovieClick () {
    $('.js-movie-title').on('click', function(event) {
        event.preventDefault();
        let movieId = $(this).parent().data('id');
        getMovieData(movieId);
    })
}

function renderMoviePage (responseJson) {
    let imgEndpoint = 'http://image.tmdb.org/t/p/original/';
    let moviePageHtml = `
    <section class='content'>
        <section class='movie-page'>
            <section class='movie-information'>
                <div  class='main-movie-poster'><img src='${imgEndpoint+responseJson.poster_path}' alt='movie poster'></div>
                <p class='main-movie-title'>${responseJson.title}</p>
                <p class='main-release-date'>${responseJson.release_date}</p>
                <p class='main-description'>${responseJson.overview}</p>
            </section>
            <section class='movie-reviews'>
                <div class='review-heading'><h5>NY Times Reviews</h5></div>
                <section class='review-section'>
             </section>
            </section>
            <section class='clips'>
                <h5 class='clips-heading'>Top Clips</h5>
                <section class='clips-section'>
                </section>
            </section>
            <section class='actors'>
                <h5 class='actors-heading'>Actors</h5>
                <section class='cast-list'>
                    ${createCastList(responseJson)}
                </section>
            </section>
        </section>
    </section>`;

    $('.js-hero').empty();
    $('.js-hero').html(createNav() + moviePageHtml);
    getYoutubeClips (responseJson.title);
    getMovieReviews (responseJson.title);
    handleSearchClick();
    handleAboutClick();
}

function getYoutubeClips (movieTitle) {
    let apiKey = 'AIzaSyCz-K5-RrdLGfMlf-0Q4yhY-Bzk1CLPMfM';
    let queryString = `${movieTitle} movie clips`;
    let youtubeEndpoint = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&maxResults=10&part=snippet&q=${encodeURIComponent(queryString)}&safeSearch=none`;

    fetch(youtubeEndpoint)
    .then(response => response.json())
    .then(responseJson => renderYoutubeClips(responseJson));
}

function renderYoutubeClips (responseJson) {
    let youtubeClipsHtml = [];

    for (let i = 0; i < responseJson.pageInfo.resultsPerPage; i++) {
        let youtubeClipHtml = `<li class='clip-list-item'>
        <div class='clip'>
            <div class='clip-thumbnail'><img src='${responseJson.items[i].snippet.thumbnails.high.url}' alt='youtube thumbnail'></div>
            <div class='clip-information'>
            <a target='_blank' href='https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}'><p class='clip-name'>${responseJson.items[i].snippet.title}</p></a>
            </div>
        </div>
    </li>`;
        youtubeClipsHtml.push(youtubeClipHtml);
    }

    youtubeClipsHtml.unshift(`<ul class='clip-list'>`);
    youtubeClipsHtml.push('</ul>');
    $('.clips-section').html(youtubeClipsHtml.join(' '));
    handleSearchClick();
    handleAboutClick();
}

function getMovieReviews (movieTitle) {
    let apiKey = 'RKearf4CbZ1jHNJ6EIUyj2PAvmdQqqRa';
    let reviewEndpoint = `https://api.nytimes.com/svc/movies/v2/reviews/search.json?api-key=${apiKey}&query=${movieTitle}`;

    fetch(reviewEndpoint)
    .then(response => response.json())
    .then(responseJson => renderMovieReviews(responseJson, movieTitle));
}

function renderMovieReviews (responseJson, movieTitle) {
    let movieReviews = [];

    for (let i = 0; i < responseJson.num_results; i++) {
        if (movieTitle == responseJson.results[i].display_title){
        let movieReview = `<li class='review'>
            <a href='${responseJson.results[i].link.url}'><h4>${responseJson.results[i].headline}</h4></a>
                <h5>Author: ${responseJson.results[i].byline}</h5>
                <p>Summary: ${responseJson.results[i].summary_short}</p>
            </li>`;
            movieReviews.push(movieReview);
        }
    }

    movieReviews.unshift('<ul class=\'reviews-list\'>');
    movieReviews.push('</ul');
    if(responseJson.num_results != 0){
      $('.review-section').html(movieReviews.join(' '));
    }
    else {
      $('.review-section').html(`<h2>No reviews available for this title.</h2>`);
    }
}

function createCastList (responseJson) {
    let castList = [];
    let imgEndpoint = 'http://image.tmdb.org/t/p/w500/';

    for (let i = 0; i < responseJson.credits.cast.length; i++) {
        let castMember = `<li class='actor'>
        <div class='actor-profile'>
            <div class='actor-image'><img src='${imgEndpoint + responseJson.credits.cast[i].profile_path}' alt='actor image'></div>
            <div class='actor-info'>
                <p class='actor-data character-name'>${responseJson.credits.cast[i].character}</p>
                <p class='actor-data actor-name'>${responseJson.credits.cast[i].name}</p>
            </div>
        </div>
    </li>`;
    castList.push(castMember);
    }
    castList.unshift(`<ul class='actors-list'>`);
    castList.push(`</ul>`);
    return castList.join(' ');
}

function getMovieData(movieId) {
    let api_key = '7087ed750c60817c883cf6512c1c0f1c';
    let movieURL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=credits`;

    fetch (movieURL)
    .then(response => response.json())
    .then(responseJson => renderMoviePage(responseJson));
}

function renderResultsPage(searchQuery, responseJson) {
    let resultsHtml = `
    <section class='content results-page'>
        <section class='results js-results'>
        <h5 class='results-header'>Results for '${searchQuery}'</h5>
            ${createResultsList(responseJson)}
            <button class='return-button js-return-button'>Return to search</button>
        </section>
    </section>`
    let resultsPage = createNav() + resultsHtml;
    $('.js-hero').empty();
    $('.js-hero').html(resultsPage);
    handleMovieClick();
    handleReturnClick();
    handleSearchClick();
    handleAboutClick();
}

function handleReturnClick () {
  $('.js-return-button').on('click', event =>{
    event.preventDefault();
    renderLandingPage();
  })
}

function getResultsList(searchQuery) {
    let resultsListHtml = '';
    let api_key = '7087ed750c60817c883cf6512c1c0f1c'
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodeURIComponent(searchQuery)}`)
    .then(response => response.json())
    .then(responseJson => renderResultsPage(searchQuery, responseJson));
}

function createResultsList(responseJson) {
    let imgEndpoint = 'http://image.tmdb.org/t/p/original/';
    let resultsListHtml = [];

    for (let i = 0; i < getNumResults(responseJson.total_results); i++) {
        let resultItemHtml = `
            <li data-id=${responseJson.results[i].id} class='result-item js-result-item'>
                <img src='${imgEndpoint + responseJson.results[i].poster_path}' class='movie-poster js-movie-poster' alt='movie poster'>
                <a class='movie-title js-movie-title' href=''>${responseJson.results[i].title}</a><br/>
                <span class='release-date'>${responseJson.results[i].release_date}</span>
                <p class='description'>${responseJson.results[i].overview}</p>
            </li>`;
            resultsListHtml.push(resultItemHtml);
    }
    resultsListHtml.unshift(`<ul class='results-list'>`);
    resultsListHtml.push('</ul>')
    resultsListHtml = resultsListHtml.join(' ');
    return resultsListHtml;
}

function getNumResults(numResults) {
    if (numResults > 20) {
        return 20;
    }
    else {
        return numResults;
    }
}

$(renderLandingPage());