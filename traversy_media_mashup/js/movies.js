const movieDisplayTemplate = document.querySelector('[data-movie-display-template]'),
moviesMainEl = $('#movies-main'), 
totalPagesEl = $('#total-pages'), 
totalResultsEl = $('#total-results'), 
searchFormEl = $('#movies-search-form'), 
searchInputEl = $('#search'), 
paginationFormEl = $('#pagination-form'), 
paginationInputEl = $('#pagination-form .pagination__input'), 
paginationCategoryEl = $('#pagination .pagination__category'), 
paginationSortbyEl = $('#pagination .pagination__sortby'), 
paginationPagesEl = $('#pagination .pages'), 
paginationPrevEl = $('#pagination .page-frag.prev-page'), 
paginationNextEl = $('#pagination .page-frag.next-page');

let split = location.pathname.split('/'),
filename = Array.isArray(split) && split.length > 0 ? split.pop() : navArr?.index || '',
fileID = filename.split('.')[0];

let CURRENT_URL = '', PAGE = 1, TOTAL_PAGES = 0, SORT_BY = paginationSortbyEl.val() || 'popularity.desc',
CATEGORY = paginationCategoryEl.val() || 'movie';

const BASE_URI = 'https://api.themoviedb.org/3/';
const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c';
const API_URL = `${BASE_URI}discover/${CATEGORY}?api_key=${API_KEY}&sort_by=${SORT_BY}&page=${PAGE}`;
const SEARCH_API = `${BASE_URI}search/${CATEGORY}?api_key=${API_KEY}&query="'`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';

function setInputs(){
    if(paginationCategoryEl.val() === "movie"){
        paginationSortbyEl.html(`
        <option value="popularity.asc" selected>popularity.asc</option>
        <option value="popularity.desc">popularity.desc</option>
        <option value="release_date.asc">release_date.asc</option>
        <option value="release_date.desc">release_date.desc</option>
        <option value="revenue.asc">revenue.asc</option>
        <option value="revenue.desc">revenue.desc</option>
        <option value="primary_release_date.asc">primary_release_date.asc</option>
        <option value="primary_release_date.desc">primary_release_date.desc</option>
        <option value="original_title.asc">original_title.asc</option>
        <option value="original_title.desc">original_title.desc</option>
        <option value="vote_average.asc">vote_average.asc</option>
        <option value="vote_average.desc">vote_average.desc</option>
        <option value="vote_count.asc">vote_count.asc</option>
        <option value="vote_count.desc">vote_count.desc</option>
        `);
    } else {
        paginationSortbyEl.html(`
        <option value="vote_average.desc" selected>vote_average.desc</option>
        <option value="vote_average.asc">vote_average.asc</option>
        <option value="first_air_date.desc">first_air_date.desc</option>
        <option value="first_air_date.asc">first_air_date.asc</option>
        <option value="popularity.desc">popularity.desc</option>
        <option value="popularity.asc">popularity.asc</option>
        `);
    }
}

async function getMovies(url) {
    const res = await fetch(url)
    const data = await res.json()
	
	CURRENT_URL = url;
    showMovies(data) //showMovies(data.results)
}
let GENRES = '';
async function getGenres(url) {
    url = url || `${BASE_URI}genre/${CATEGORY}/list?api_key=3fd2be6f0c70a2a598f084ddfb75487c&language=en-US`;
    
    const res = await fetch(url)
    const data = await res.json()
	
    if(data && data.genres){
        GENRES = data.genres;
    }
    return  data.genres; //showMovies(data.results)
}
let data = getGenres();

function showMovies(_data) {
	let frag = document.createDocumentFragment(), movies = _data.results;
	
    movies.forEach((movie) => {
        const { id, title, poster_path, vote_average, release_date, overview } = movie

        const movieEl = document.createElement('div')
        movieEl.classList.add('movie')
		
		$title = title||movie.name||'???';
		$release_date = release_date ? `released : ${release_date}` : `first aired : ${movie.first_air_date}`;
		$img = poster_path ? IMG_PATH + poster_path : './img/movie-night.png';
		
        movieEl.innerHTML = `<img src="${$img}" alt="${$title}">
        <div class="movie-info">
            <h3>${$title}<br><small>${$release_date}</small></h3>
            <span class="popularity ${getClassByRate(vote_average)}">${vote_average}</span>
        </div>
        <div class="overview">
            <h3>Overview</h3>
            ${overview}
        </div>`;
        frag.appendChild(movieEl);
        movieEl.addEventListener('click',e=>{e.preventDefault();showMovieModal(movieDisplayTemplate, movie)})
    });
	
	loader(moviesMainEl[0],frag).then(()=>{
		let cd = $('#category-display')
		cd.html((CATEGORY === 'movie') ? 'Movie Listings' : 'TV Shows');
		
		PAGE = _data.page || 1, perPage = 10, 
		TOTAL_PAGES = _data.total_pages;
		TOTAL_RESULTS = _data.total_results;
		
		paginationInputEl.val(PAGE);
		paginationInputEl.attr('title',`enter page number between 1 and ${TOTAL_PAGES}`);
		totalPagesEl.html(`showing page: ${PAGE} of ${TOTAL_PAGES}`);
		totalResultsEl.html(`Total Results: ${TOTAL_RESULTS}`);
	});
}

function showMovieModal(el, movie){
    if(movie && typeof movie === "object"){
        var genres = movie.genre_ids.map((value) => {
            let genre_name = value;
            for(genre of GENRES){if(genre.id === value) genre_name = genre.name;}
            var genres_link = `https://www.themoviedb.org/genre/${value}`;
            return `<a href="${genres_link}" target="_blank"><span>${genre_name}</span><span> </span></a>`;
        }).join('');
        
        movieDisplayTemplate.classList.toggle('toggled')
        movieDisplayTemplate.innerHTML = `
        <div class="modal-content" role="document">
            <div class="modal-side">
                <a href="http://image.tmdb.org/t/p/w500${movie.poster_path}" data-lightbox="${movie.title} poster" data-title="${movie.title} Movie Poster" target="_blank">
                    <img class="center-block img-responsive" width="240px" height="320px" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} Poster" onLoad={this.onImageLoad} />
                </a>
            </div>
            <div class="modal-main">
                <div class="modal-header">
                    <button type="button" class="close" aria-label="Close" data-remove-btn><span aria-hidden="true">×</span></button>
                    <h4 id="movie-modal-title" class="modal-title">${movie.title}</h4>
                    <small><b>Rating: </b>${movie.vote_average}/10 (${movie.vote_count} votes)</small>
                    <p><b>Genres: </b>${genres}</p>
                    <p><b>Release Date:</b><span> </span>${movie.release_date}</p>
                </div>
                <div class="modal-body">
                    <!--<div class="center-block">
                        <a href="http://image.tmdb.org/t/p/w500${movie.poster_path}" data-lightbox="${movie.title} poster" data-title="${movie.title} Movie Poster" target="_blank">
                            <img class="center-block img-responsive" width="240px" height="320px" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} Poster" onLoad={this.onImageLoad} />
                        </a>
                    </div>
                    <hr>-->
                    <p>${movie.overview}</p>
                </div>
                <div class="modal-footer">
                    <a class="btn btn-default" href="https://www.themoviedb.org/movie/${movie.id}" target="_blank">Check it out on TheMovieDB</a>
                </div>
            </div>
        </div>`;
        
        movieDisplayTemplate.querySelector('[data-remove-btn]').addEventListener('click',e=>{e.target.closest('[data-movie-display-template]').classList.toggle('toggled')});
    } else console.log('Error: movie object is not valid')
}
function getClassByRate(vote) {
    if(vote >= 8) {
        return 'green'
    } else if(vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}
// -------------------------------------------------------------

setInputs();
$('#container').addClass('snap-container').addClass('x');
$('.movies-nav').slideUp('fast');
$('#toggle-2').click(function(e){
	$('.movies-nav').slideToggle('slow');
});

// Get initial movies
getMovies(API_URL)

searchFormEl.on('submit', (e) => {
    e.preventDefault()

    const searchTerm = searchInputEl.val();
    CURRENT_URL = SEARCH_API + searchTerm
	
    if(searchTerm && searchTerm !== '') {
        getMovies(CURRENT_URL)
        //searchInputEl.value = ''
    } else {
        window.location.reload()
    }
})

paginationFormEl.on('submit', (e) => {
    e.preventDefault()

	const searchTerm = searchInputEl.val();
	PAGE = paginationInputEl.val();
    CURRENT_URL = (searchTerm && searchTerm !== '') ? `${SEARCH_API}${searchTerm}&page=${PAGE}` : `https://api.themoviedb.org/3/discover/movie?sort_by=${SORT_BY}&api_key=${API_KEY}&page=${PAGE}`;
    
	if(PAGE && PAGE !== '') {
        getMovies(CURRENT_URL)
    }
})

paginationPrevEl.on('click', (e) => {
	e.preventDefault()
	PAGE--;
	
	if (PAGE < 1) {
		PAGE = TOTAL_PAGES
	}
	
	const searchTerm = searchInputEl.val();
	CURRENT_URL = (searchTerm && searchTerm !== '') ? `${SEARCH_API}${searchTerm}&page=${PAGE}` : `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=${SORT_BY}&page=${PAGE}`;
    
	getMovies(CURRENT_URL)
})

paginationNextEl.on('click', (e) => {
	e.preventDefault()
	PAGE++

	if (PAGE > TOTAL_PAGES) {
		PAGE = 1
	}
	
	const searchTerm = searchInputEl.val();
	CURRENT_URL = (searchTerm && searchTerm !== '') ? `${SEARCH_API}${searchTerm}&page=${PAGE}` : `https://api.themoviedb.org/3/discover/${CATEGORY}?api_key=${API_KEY}&sort_by=${SORT_BY}&page=${PAGE}`;
    
	getMovies(CURRENT_URL)
})

paginationCategoryEl.on('change',e=>{
	e.preventDefault()
	const searchTerm = searchInputEl.val();
	
	CATEGORY = e.target.value;
	PAGE = paginationInputEl.val();
    CURRENT_URL = (searchTerm && searchTerm !== '') ? `${SEARCH_API}${searchTerm}&page=${PAGE}` : `https://api.themoviedb.org/3/discover/${CATEGORY}?api_key=${API_KEY}&sort_by=${SORT_BY}&page=${PAGE}`;
    
	getMovies(CURRENT_URL);
    setInputs();
})

paginationSortbyEl.on('change',e=>{
	e.preventDefault()
	const searchTerm = searchInputEl.val();
	
	SORT_BY = e.target.value;
	PAGE = paginationInputEl.val();
    CURRENT_URL = (searchTerm && searchTerm !== '') ? `${SEARCH_API}${searchTerm}&page=${PAGE}` : `https://api.themoviedb.org/3/discover/${CATEGORY}?api_key=${API_KEY}&sort_by=${SORT_BY}&page=${PAGE}`;
    
	getMovies(CURRENT_URL);
    //setInputs();
})
