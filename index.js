'use strict'

function renderLandingPage () {
    let landingPage = createNav() + createSearch() + '</div>'; //Added an extra end div tag for my background image wrapper. gotta be a better way!

    $('.content').empty();
    $('.content').html(landingPage);
    handleSearch();
    handleNavClick();
}

function createNav () {
    let navHtml = `
        <nav class="navbar navbar-expand-md navbar-dark bg-dark js-header-nav">
            <a class="navbar-brand" href="#">Movie Hub</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="">Search</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="">Contact</a>
                    </li>
                </ul>
            </div>
        </nav>
        <div class='background-image'>`;//This opening div tag is for my background image wrapper;
    return navHtml;
}

//TODO: Fix this garbage
function handleNavClick () {
    $('.js-header-nav').on('click', 'a', function(event) {
        event.preventDefault();
        let option = $(this).text();

        alert (option);
        /*
        if ('Movie Hub' == option) {
            renderLandingPage();
        }
        else if ('Search' == option) {
            renderLandingPage();
        }
        else if ('Contact' == option) {
            alert('Send me an email! (I\'ll fix this later)');
        }*/
    })
}

function createSearch() {
    let searchHtml = `
         <div class='container search-page'>
            <section class='row search-row'>
                <div class='col-sm-offset-1 col-sm-10'>
                    <h1 class='text-center'>Movie Hub</h1>
                    <div class='row'>
                        <form class='search-form js-search-form col-sm-12 text-center'>
                            <div class='input-group input-group-lg mt-3'>
                                <label class='hidden' for='movie-input'>Movie title here:</label>
                                <input id='movie-input' class='form-control' type='text' placeholder='Search for a movie!'>
                                <div class='input-group-append'>
                                    <button type='submit' class='btn btn-danger btn-group-secondary' value='submit'>Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>`;
    
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
            </section><nav class='nav-bar'>
            <div
            <a href='' class=''>Movie Hub</a>
            <a href='' class=''>Search</a>
            <a href='' class=''>Contact</a>
        </nav>
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
            <div class='clip-thumbnail'><a target='_blank' href='https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}'><img src='${responseJson.items[i].snippet.thumbnails.high.url}' alt='youtube thumbnail'></a></div>
            <div class='clip-information'>
                <p class='clip-name'>${responseJson.items[i].snippet.title}</p>
            </div>
        </div>
    </li>`;
        youtubeClipsHtml.push(youtubeClipHtml);
    }

    youtubeClipsHtml.unshift(`<ul class='clip-list'>`);
    youtubeClipsHtml.push('</ul>');
    $('.clips-section').html(youtubeClipsHtml.join(' '));
}

function getMovieReviews (movieTitle) {
    let apiKey = '578e72e052004a08b514bb7f6963a8fc';
    let reviewEndpoint = `https://api.nytimes.com/svc/movies/v2/reviews/search.json?api-key=${apiKey}&query=${movieTitle}`;

    fetch(reviewEndpoint)
    .then(response => response.json())
    .then(responseJson => renderMovieReviews(responseJson));
}

function renderMovieReviews (responseJson) {
    let movieReviews = [];

    for (let i = 0; i < responseJson.num_results; i++) {
        let movieReview = `<li class='review'>
        <h4>${responseJson.results[i].headline}</h4>
        <h5>Author: ${responseJson.results[i].byline}</h5>
        <p>Summary: ${responseJson.results[i].summary_short}</p>
    </li>`;
        movieReviews.push(movieReview);
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
        <section class='container' id='results-page'>
            <section id='results-row' class='results js-results row'>
                <div class='text-left mt-3 mb-3 col-12'>
                    <h2 class='results-header'>Results for '${searchQuery}'</h1>
                    ${createResultsList(responseJson)}
                    <button type='button' class='btn btn-info btn-block mb-3 return-button js-return-button'>Return to search</button>
                </div>
            </section>
    </section>`
    let resultsPage = createNav() + resultsHtml;
    $('.content').empty();
    $('.content').html(resultsPage);
    handleMovieClick();
    handleReturnClick();
    $('.carousel').carousel();
    $('.carousel-control-prev').click(function() {
        event.preventDefault();
        $('.carousel').carousel('prev');
    });
      
    $('.carousel-control-next').click(function() {
        event.preventDefault();
        $('.carousel').carousel('next');
    });
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
        let activeCarousel = (i) => {if(i == 0) {return 'active';}};
        let resultItemHtml = `<div data-id=${responseJson.results[i].id} class="carousel-item w-100 ${activeCarousel(i)}">
                                <img class="d-block img_responsive movie-poster js-movie-poster" src="${imgEndpoint + responseJson.results[i].poster_path}" alt="movie poster">
                                <div id='carousel-information' class="carousel-caption">
                                    <h5>${responseJson.results[i].title}</h5>
                                    <p>${responseJson.results[i].overview.substring(0, 275)+'...'}</p>
                                </div>
                            </div>`;
            resultsListHtml.push(resultItemHtml);
    }
    resultsListHtml.unshift(`<div id='results-carousel' class="carousel slide">
                                <div class="carousel-inner w-100">`);
    resultsListHtml.push(`</div>
                            <a id='left-control' class="carousel-control-prev" href="" role="button" data-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="sr-only">Previous</span>
                            </a>
                            <a id='right-control' class="carousel-control-next" href="" role="button" data-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="sr-only">Next</span>
                            </a>
                        </div>`);
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