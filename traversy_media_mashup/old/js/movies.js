const moviesMainEl = $('#movies-main'), 
totalPagesEl = $('#total-pages'), 
totalResultsEl = $('#total-results'), 
searchFormEl = $('#form'), 
searchInputEl = $('#search'), 
paginationFormEl = $('#pagination-form'), 
paginationInputEl = $('#pagination-form .pagination__input'), 
paginationCategoryEl = $('#pagination .pagination__category'), 
paginationPagesEl = $('#pagination .pages'), 
paginationPrevEl = $('#pagination .page.prev-page'), 
paginationNextEl = $('#pagination .page.next-page');

let CURRENT_URL = '', PAGE = 1, TOTAL_PAGES = 0, SORT_BY = 'popularity.desc',
CATEGORY = paginationCategoryEl.value || 'movie';

const BASE_URI = 'https://api.themoviedb.org/3/';
const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c';
const API_URL = `${BASE_URI}discover/${CATEGORY}?api_key=${API_KEY}&sort_by=${SORT_BY}&page=${PAGE}`;
const SEARCH_API = `${BASE_URI}search/${CATEGORY}?api_key=${API_KEY}&query="'`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';

async function getMovies(url) {
    const res = await fetch(url)
    const data = await res.json()
	
	CURRENT_URL = url;
    showMovies(data) //showMovies(data.results)
}

function showMovies(_data) {
	let frag = document.createDocumentFragment(), movies = _data.results;
	
    movies.forEach((movie) => {
        const { title, poster_path, vote_average, release_date, overview } = movie

        const movieEl = document.createElement('div')
        movieEl.classList.add('movie')
		
		$title = title||movie.name||'???';
		$release_date = release_date ? `released : ${release_date}` : `first aired : ${movie.first_air_date}`;
		$img = poster_path ? IMG_PATH + poster_path : './img/482264.jpg';
		
        movieEl.innerHTML = `
            <img src="${$img}" alt="${$title}">
            <div class="movie-info">
				<h3>${$title}<br><small>${$release_date}</small></h3>
				<span class="popularity ${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
			<div class="overview">
				<h3>Overview</h3>
				${overview}
			</div>
        `
        frag.appendChild(movieEl)
    });
	
	//moviesMainEl.appendChild(frag)
	loader(moviesMainEl,frag).then(()=>{
		let cd = $('#category-display')
		cd.innerHTML = (CATEGORY === 'movie') ? 'Movie Listings' : 'TV Shows';
		
		PAGE = _data.page || 1, perPage = 10, 
		TOTAL_PAGES = _data.total_pages;
		TOTAL_RESULTS = _data.total_results;
		
		paginationInputEl.value = PAGE;
		paginationInputEl.title = `enter page number between 1 and ${TOTAL_PAGES}`;
		totalPagesEl.innerHTML = `showing page: ${PAGE} of ${TOTAL_PAGES}`;
		totalResultsEl.innerHTML = `Total Results: ${TOTAL_RESULTS}`;
	})
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

// Get initial movies
getMovies(API_URL)

searchFormEl.addEventListener('submit', (e) => {
    e.preventDefault()

    const searchTerm = searchInputEl.value;
    CURRENT_URL = SEARCH_API + searchTerm
	
    if(searchTerm && searchTerm !== '') {
        getMovies(CURRENT_URL)
        //searchInputEl.value = ''
    } else {
        window.location.reload()
    }
})

paginationFormEl.addEventListener('submit', (e) => {
    e.preventDefault()

	const searchTerm = searchInputEl.value;
	PAGE = paginationInputEl.value;
    CURRENT_URL = (searchTerm && searchTerm !== '') ? `${SEARCH_API}${searchTerm}&page=${PAGE}` : `https://api.themoviedb.org/3/discover/movie?sort_by=${SORT_BY}&api_key=${API_KEY}&page=${PAGE}`;
    
	if(PAGE && PAGE !== '') {
        getMovies(CURRENT_URL)
    }
})

paginationPrevEl.addEventListener('click', (e) => {
	e.preventDefault()
	PAGE--;
	
	if (PAGE < 1) {
		PAGE = TOTAL_PAGES
	}
	
	const searchTerm = searchInputEl.value;
	CURRENT_URL = (searchTerm && searchTerm !== '') ? `${SEARCH_API}${searchTerm}&page=${PAGE}` : `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=${SORT_BY}&page=${PAGE}`;
    
	getMovies(CURRENT_URL)
})

paginationNextEl.addEventListener('click', (e) => {
	e.preventDefault()
	PAGE++

	if (PAGE > TOTAL_PAGES) {
		PAGE = 1
	}
	
	const searchTerm = searchInputEl.value;
	CURRENT_URL = (searchTerm && searchTerm !== '') ? `${SEARCH_API}${searchTerm}&page=${PAGE}` : `https://api.themoviedb.org/3/discover/${CATEGORY}?api_key=${API_KEY}&sort_by=${SORT_BY}&page=${PAGE}`;
    
	getMovies(CURRENT_URL)
})

paginationCategoryEl.addEventListener('change',e=>{
	e.preventDefault()
	const searchTerm = searchInputEl.value;
	
	CATEGORY = e.target.value;
	PAGE = paginationInputEl.value;
    CURRENT_URL = (searchTerm && searchTerm !== '') ? `${SEARCH_API}${searchTerm}&page=${PAGE}` : `https://api.themoviedb.org/3/discover/${CATEGORY}?api_key=${API_KEY}&sort_by=${SORT_BY}&page=${PAGE}`;
    
	getMovies(CURRENT_URL)
})
