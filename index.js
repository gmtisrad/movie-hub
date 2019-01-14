'use strict'

/**
 * Function - renderLandingPage
 * Description - Calls the createNav and createSearch functions and combines the results into
 * the landing page's html. That html is then rendered into the 'content' element. The
 * necessary event listeners are then called.
 */
function renderLandingPage () {
    let landingPage = createNav() + createSearch();

    $('.content').empty();
    $('.content').html(landingPage);
    handleSearch();
    handleSearchClick();
    handleAboutClick();
}

/**
 * Function - createNav 
 * Description - The navbar's html is created in this function.
 * Return navHtml - The html string for the navbar.
 */
function createNav () {
    let navHtml = `
        <nav class="navbar navbar-expand-md navbar-dark bg-dark js-header-nav">
            <span>Movie Hub</span>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                <ul class="navbar-nav js-navbar-nav ml-auto">
                    <li class="nav-item">
                        <a class="nav-link search-nav" href="">Search</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link about-nav" href="">About</a>
                    </li>
                </ul>
            </div>
        </nav>`;
    return navHtml;
}

/**
 * Function - handleSearchClick
 * Description - This is an event handler placed on the navbar to determine what happens when a certain element is clicked.
 */
//TODO: Fix this garbage
function handleSearchClick () {
    $('.search-nav').on('click', function(event) {
        event.preventDefault();
        renderLandingPage();
    });
}

/**
 * Function - handleAboutClick
 * Description - This is an event handler placed on the navbar to determine what happens when a certain element is clicked.
 */
function handleAboutClick () {
    $('.about-nav').on('click', function(event) {
        event.preventDefault();
        renderAboutPage();
    })
}

/**
 * Function - renderAboutPage
 * Description - Renders the page that gives information about me and the project.
 */
function renderAboutPage () {
    let aboutHtml = `
    <div class='about-div'>
        <section id='about' class='container'>
            <h3 class='text-center'>Hi, I'm Gabe!</h3>
            <p class='text-center'>I made this project as a part of my API capstone project in my full stack web development program. It's purpose is to help you discover new movies, or even just find more information about a movie you may be interested in watching.</p>
            <p class='text-center'>Every element in this project is rendered to the screen using Javascript and JQuery. The APIs used are the <a href='https://www.themoviedb.org/'>tMDB API</a>, the <a href='https://www.nytimes.com/reviews/movies'>New York Times Movie Reviews API</a> and the <a href='https://www.youtube.com/'>Youtube Data API</a>.
            <p class='text-center'>The technologies I used are HTML, CSS, Bootstrap, Javascript and JQuery.</p>
            <p class='text-center'>Below are a few ways you can contact me!</p>
            <section class="social-icons text-center">
                    <a href='https://github.com/gmtisrad'><i class="fa fa-github" style='color: black'></i></a>
                    <a href='https://codepen.io/Gabe_M_Timm/'><i class="fa fa-codepen" style='color: black'></i></a>
                    <a href='https://www.linkedin.com/in/gabe-m-timm/'><i class="fa fa-linkedin" style='color: black'></i></a>
                    <a href='mailto:gabe.m.timm@gmail.com'><i class="fa fa-envelope" style='color: black'></i></a>
                </section>
        </section>
    </div> `
    $('.content').empty();
    $('.content').html(createNav() + aboutHtml);
    handleSearchClick();
    handleAboutClick();
}

/**
 * Function - createSearch
 * Description - The search portion of the landing page's html is created in this function.
 * Return searchHtml - The html string for the search form.
 */
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
                                <input id='movie-input' class='form-control' type='text' placeholder='Movie Search!'>
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

/**
 * Function - handleSearch
 * Description - This is an Event Listener for the search input form on the landing page. The value of
 * the input field is taken and used to query the tMDB API through the getResultsList function.
 */
function handleSearch () {
    $('.search-form').on('submit', function(event) {
        event.preventDefault();
        let searchQuery = $('#movie-input').val();
        console.log(searchQuery);
        getResultsList(searchQuery);
    });
}

/**
 * Function handleMovieClick
 * Description - This is an event listener for the movie title in the carousel. The function
 * getMovieData is called using the movieID value retrieved fromt the tMDB search query.
 */
function handleMovieClick () {
    $('.js-movie-title').on('click', function(event) {
        event.preventDefault();
        let movieId = $(this).closest('.carousel-item').attr('data-id');
        getMovieData(movieId);
    })
}

/**
 * Function - renderMoviePage
 * Param responseJson - The response JSON object retrieved from the tMDB API.
 * Description - The movie page is rendered using the movie specific API call. This function
 * uses the functions getYoutubeClips and getMovieReviews to populate the 'review-section' and 
 * 'cast-list' elements. 
 */
function renderMoviePage (responseJson) {
    let imgEndpoint = 'http://image.tmdb.org/t/p/original/';
    let moviePageHtml = `
        <section class='container' id='movie-page'>
            <div class='row'>
                <section id='movie-information' class='col-12 col-md-6 p-2'>
                    <div class='row'>
                        <div  class='main-movie-poster col'><img class='img-fluid' src='${imgEndpoint+responseJson.poster_path}' alt='movie poster'></div>
                        <section class='col'>
                            <h3 class='main-movie-title'>${responseJson.title}</h3>
                            <p class='main-release-date'>${responseJson.release_date}</p>
                            <p class='main-description'>${responseJson.overview}</p>
                        </section>
                    </div>
                </section>
            <section id='movie-reviews' class='col-12 col-md-6'>
                <h3 class='text-center border-bottom border-dark'>NY Times Reviews</h3>
                <section class='review-section'>
             </section>
            </section>
            <div class='row'>
                <section class='clips col-12 col-md-8'>
                    <h3 class='clips-heading text-center border-bottom border-dark'>Top Clips</h3>
                    <section class='clips-section container'>
                    </section>
                </section>
                <section class='actors col-12 col-md-4'>
                    <h3 class='text-center border-bottom border-dark'>Actors</h3>
                    <section class='cast-list container'>
                        ${createCastList(responseJson)}
                    </section>
                </section>
                </div>
            </div>
        </section>`;

    $('.content').empty();
    $('.content').html(createNav() + moviePageHtml);
    getYoutubeClips (responseJson.title);
    getMovieReviews (responseJson.title);
    handleSearchClick();
    handleAboutClick();
}

/**
 * Function - getYoutubeClips 
 * Param movieTitle - The movie title used to query the Youtube Data API. Retrieved from the tMDB API.
 * Description - The movie title is used to query the Youtube Data API. The response JSON object is then
 * used to call the renderYoutubeClipss function.
 */
function getYoutubeClips (movieTitle) {
    let apiKey = 'AIzaSyCz-K5-RrdLGfMlf-0Q4yhY-Bzk1CLPMfM';
    let queryString = `${movieTitle} movie clips`;
    let youtubeEndpoint = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&maxResults=10&part=snippet&q=${encodeURIComponent(queryString)}&safeSearch=none`;

    fetch(youtubeEndpoint)
    .then(response => response.json())
    .then(responseJson => renderYoutubeClips(responseJson));
}

/**
 * Function - renderYoutubeClips
 * Param responseJson - The response JSON object retrieved from the youtube data API
 * Description - The response JSON object is used to generate the html for the youtube clips section.
 * The html is then rendered into the 'clips-section' element.
 */
function renderYoutubeClips (responseJson) {
    let youtubeClipsHtml = [];

    //Clips are both created and rendered here. Could be seperated.
    for (let i = 0; i < responseJson.pageInfo.resultsPerPage; i++) {
        let youtubeClipHtml = `
        <div class='clip row border-bottom border-dark'>
            <div class='col-4'><img class='img-fluid img-thumbnail' src='${responseJson.items[i].snippet.thumbnails.high.url}' alt='youtube thumbnail'></div>
            <div class='clip-information col-8'>
                <a target='_blank' href='https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}'><p class='clip-name'>${responseJson.items[i].snippet.title}</p></a>
            </div>
        </div>`;
        youtubeClipsHtml.push(youtubeClipHtml);
    }

    $('.clips-section').html(youtubeClipsHtml.join(' '));
}

/**
 * Function - getMovieReviews
 * Param movieTitle - The movie title retrieved by the tMDB API.
 * Description - The NY Times movie review API is queried using the movie title retrieved by the tMDB API.
 * The renderMovieReviews function is then called using the response JSON object. 
 */
function getMovieReviews (movieTitle) {
    let apiKey = '578e72e052004a08b514bb7f6963a8fc';
    let reviewEndpoint = `https://api.nytimes.com/svc/movies/v2/reviews/search.json?api-key=${apiKey}&query=${movieTitle}`;

    fetch(reviewEndpoint)
    .then(response => response.json())
    .then(responseJson => renderMovieReviews(responseJson));
}


/**
 * Function - renderMovieReviews
 * Param responseJson - The response JSON object containing the NY Times movie review data
 * Description - The movie review data is converted into html and pushed into an array.
 * The array is then joined and rendered into the 'review-section' element.
 */
function renderMovieReviews (responseJson) {
    let movieReviews = [];
    //The movie review section's html is both created and rendered here. Could be seperated.
    for (let i = 0; i < responseJson.num_results; i++) {
        let movieReview = `<li class='review border-bottom border-dark'>
        <h4><a href='${responseJson.results[i].link.url}'>${responseJson.results[i].headline}</a></h4>
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

/**
 * Function - createCastList
 * Param responseJson - The response JSON object containing the cast JSON data
 * Description - Each cast member is used to create a bootstrap column in html, then pushed into an array.
 * The array is then joined and returned.
 * Returns castList - The cast list html string.
 */
function createCastList (responseJson) {
    let castList = [];
    let imgEndpoint = 'http://image.tmdb.org/t/p/w500/';

    for (let i = 0; i < responseJson.credits.cast.length; i++) {
        let castMember = `
        <div class='actor-profile col-6 col-md-4'>
            <div class='actor-image'><img class='img-fluid' src='${imgEndpoint + responseJson.credits.cast[i].profile_path}' alt='actor image'></div>
            <div class='actor-info'>
                <p class='actor-data border-bottom border-info'>${responseJson.credits.cast[i].character}</p>
                <p class='actor-data actor-name'>${responseJson.credits.cast[i].name}</p>
            </div>
        </div>`;
    castList.push(castMember);
    }
    castList.unshift(`<div class='row'>`);
    castList.push(`</div>`)
    return castList.join('');
}


/**
 * Function - getMovieData 
 * Param movieId - The ID of the movie retrieved by tMDB API.
 * Description - The movieId parameter is used to query the tMDB api. The response JSON object is then used to
 * render the movie page.
 */
function getMovieData(movieId) {
    let api_key = '7087ed750c60817c883cf6512c1c0f1c';
    let movieURL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=credits`;

    fetch (movieURL)
    .then(response => response.json())
    .then(responseJson => renderMoviePage(responseJson));
}


/**
 * Function - renderResultsPage
 * Param searchQuery - The query string taken by the search input field on the landing page
 * Param responseJson - The JSON response object of the results returned by the tMDB API
 * Description - This function uses the response JSON object to create the results page. It then 
 * renders it to the content <div> using jquery.
 */
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
    handleMovieClick();//Event listener called
    handleReturnClick();//Event listener called
    $('.carousel').carousel();//The results carousel is initialized
    $('.carousel-control-prev').click(function() {//Gives functionality to the carousel navigation buttons
        event.preventDefault();
        $('.carousel').carousel('prev');
    });
      
    $('.carousel-control-next').click(function() {//Gives functionality to the carousel navigation buttons
        event.preventDefault();
        $('.carousel').carousel('next');
    });
    handleSearchClick();//Event listener called
    handleAboutClick();//Event listener called
}

/**
 * Function - handleReturnClick
 * Param - None
 * Description - This function is an event listener for the return button on the bottom of my
 * results page. It returns the user to the landing page.
 */
function handleReturnClick () {
  $('.js-return-button').on('click', event =>{
    event.preventDefault();
    renderLandingPage();
  })
}

/**
*Function - getResultsList
*Param searchQuery - The query string taken by the search input. (Must be a movie title)
*Description - This function queries the tMDB API and calls the renderResultsPage function 
*with the query string and response data.
*/
function getResultsList(searchQuery) {
    let resultsListHtml = '';
    let api_key = '7087ed750c60817c883cf6512c1c0f1c'
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodeURIComponent(searchQuery)}`)
    .then(response => response.json())
    .then(responseJson => renderResultsPage(searchQuery, responseJson));
}

/**
*Function - createResultsList
*Param responseJson - The Json object retrieved from the tMDB API with the fetch API
*Descrtiption - This function takes the JSON object and creates the html needed to display the results
*in a bootstrap carousel. That html is then returned.
*/
function createResultsList(responseJson) {
    let imgEndpoint = 'http://image.tmdb.org/t/p/original/';
    let resultsListHtml = [];
    

    for (let i = 0; i < getNumResults(responseJson.total_results); i++) {
        let activeCarousel = (i) => {if(i == 0) {return 'active';}};
        let resultItemHtml = `<div data-id=${responseJson.results[i].id} class="carousel-item ${activeCarousel(i)}">
                                <img class="d-block img-fluid movie-poster js-movie-poster" src="${imgEndpoint + responseJson.results[i].poster_path}" alt="movie poster">
                                <div id='carousel-information' class="carousel-caption">
                                    <h3><a href='' class='js-movie-title' style='color: white'>${responseJson.results[i].title}</a></h5>
                                    <p>${responseJson.results[i].overview.substring(0, 275)+'...'}</p>
                                </div>
                            </div>`;
            resultsListHtml.push(resultItemHtml);
    }
    resultsListHtml.unshift(`<div id='results-carousel' class="carousel slide">
                                <div class="carousel-inner">`);
    resultsListHtml.push(`</div>
                            <a id='left-control' class="carousel-control-prev" href="" role="button" data-slide="prev">
                                <span class="carousel-control-prev-icon"></span>
                            </a>
                            <a id='right-control' class="carousel-control-next" href="" role="button" data-slide="next">
                                <span class="carousel-control-next-icon"></span>
                            </a>
                        </div>`);
    resultsListHtml = resultsListHtml.join(' ');
    return resultsListHtml;
}
/**
*Function - getNumResults
*Param numResults - The number of results returned by the tMDB api
*Description - I set a limit to the number of results to be displayed because the api
*returns a lot of irrelevant data after a certain point. 
*Note - I may remove this if people end up needing all of the data
*/
function getNumResults(numResults) {
    if (numResults > 20) {
        return 20;
    }
    else {
        return numResults;
    }
}

$(renderLandingPage());