const checkAuth = () => {
    const user = localStorage.getItem('user');
    console.log(user);
    
    if (!user &&  !window.location.pathname.includes('register.html')) {
      window.location.href = 'register.html'; 
    }
  };
  
  window.addEventListener("load", checkAuth);



const API_KEY = 'api_key=4dcd0f5949cf61be8b4f32ed12c588d5';
const BASE_URL = 'https://api.themoviedb.org/3';
const trendingURL = BASE_URL + '/trending/all/day?&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const main = document.getElementById('main'); 
const categorySelect = document.getElementById('category-select'); 
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const currBtn = document.getElementById('current');

var selectedCategory = '';
var curr = 1;
var next = 2;
var prev = 0;
var lastUrl = '';
var totalPages = 100;


function getMovies(category = 'all', callback, page = 1) {
    let url;
    switch (category) {
        case 'movie':
            url = `${BASE_URL}/trending/movie/day?${API_KEY}&page=${page}`;
            break;
        case 'tv':
            url = `${BASE_URL}/trending/tv/day?${API_KEY}&page=${page}`;
            break;
        case 'people':
            url = `${BASE_URL}/trending/person/day?${API_KEY}&page=${page}`;
            break;
        default:
            url = `${BASE_URL}/trending/all/day?${API_KEY}&page=${page}`;
    }
    lastUrl = url;

    var xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
            var data = JSON.parse(this.response);
            callback(data.results, category);
            curr = data.page;
            next = curr + 1;
            prev = curr - 1;
            totalPages = data.total_pages;

            currBtn.innerText = `Page ${curr} of ${totalPages}`;
            prevBtn.disabled = prev <= 0 ;
            nextBtn.disabled = next > totalPages;
        }
    });

    xhr.open('GET', url);
    xhr.send();
}

function showMovies(data, category) {
    main.innerHTML = '';

    main.classList.add('grid', 'grid-cols-1', 'sm:grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-5', 'gap-4', 'px-20');
    
    data.forEach(item => {
        const { title, name, poster_path, vote_average, overview, profile_path } = item;
        const displayTitle = title || name || 'Unknown';
        const imagePathUsed = profile_path || poster_path;
        const vote = vote_average ? `<span class="text-sm text-gray-400">${vote_average.toFixed(1)}</span>` : '';
        const details = category !== 'person' ? `<p class="text-sm text-gray-300 line-clamp-5">${overview || 'No Overview Available'}</p>` : '';

        const itemElement = document.createElement('div');
        itemElement.classList.add('movie', 'bg-[#1c1c1c]', 'rounded-lg', 'overflow-hidden', 'shadow-md', 'group', 'relative');
       
        itemElement.innerHTML = `
            <img src="${IMG_URL + imagePathUsed}" alt="No Image Available" class="w-full object-cover rounded-t-lg cursor-pointer">
            <div class="movie-details p-2">
                <h3 class="text-base font-bold text-white">${displayTitle}</h3>
                ${vote}
            </div>
            <div class="absolute top-0 left-0 w-full h-full bg-[#141414] bg-opacity-90 p-4 text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out cursor-pointer translate-y-60">
            <h4 class="text-l font-bold text-red-600 py-5 uppercase">Overview</h4>
            <p>${details}</p>
            </div>
        `;
        main.appendChild(itemElement);
    });
}

categorySelect.addEventListener('change', (event) => {
    selectedCategory = event.target.value;
    curr = 1; 
    getMovies(selectedCategory, showMovies, curr);
});

nextBtn.addEventListener('click', () => {
    if (next <= totalPages) {
        getMovies(selectedCategory,showMovies,next);
    }
});

prevBtn.addEventListener('click', () => {
    if (prev > 0) {
        getMovies(selectedCategory,showMovies,prev);
    }
});

getMovies('all', showMovies);
