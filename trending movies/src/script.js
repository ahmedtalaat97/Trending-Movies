
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
let detailsPage = document.querySelector(".details");
let overlay = document.querySelector(".overlay");

var selectedCategory = '';
var curr = 1;
var next = 2;
var prev = 0;
var lastUrl = '';
var totalPages = 100;
let logut=document.querySelector("#login-btn")
logut.addEventListener("click",()=>{
  localStorage.clear('user');
  window.location.href='register.html';
})

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
        itemElement.addEventListener("click", () => {
            displayDetails(item.id, item.media_type);
          });
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

 function fetchSearchResults(query, callback) {
            const url = `${BASE_URL}/search/multi?${API_KEY}&query=${encodeURIComponent(query)}`;

            var xhr = new XMLHttpRequest();
            xhr.addEventListener('readystatechange', function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        var data = JSON.parse(this.response);
                        callback(data.results);
                    } else {
                        console.error('Error fetching search results:', this.statusText);
                        console.log(url)
                    }
                }
            });

            xhr.open('GET', url);
            xhr.send();
        }

categorySelect.addEventListener('change', (event) => {
    selectedCategory = event.target.value;
    curr = 1; 
    getMovies(selectedCategory, showMovies, curr);
});

      searchButton.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                fetchSearchResults(query, (results) => showMovies(results, 'all'));
            } else {
                getMovies(selectedCategory, showMovies, curr); 
            }
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

window.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
      hide();
    }
  });
  overlay.addEventListener("click", hide);
  function displayDetails(id, type) {
    if (type === "movie") {
      getDetails(id, "movie", movieDetails);
      show();
    } else if (type === "tv") {
      getDetails(id, "tv", tvDetails);
      show();
    }
  }
  function show() {
    overlay.classList.remove("hidden");
    detailsPage.classList.remove("hidden");
    detailsPage.classList.add("flex");
  }
  function hide() {
    overlay.classList.add("hidden");
    detailsPage.classList.add("hidden");
    detailsPage.classList.remove("flex");
  }
  function getDetails(id, type, callback) {
    let dataDetails = {};
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `https://api.themoviedb.org/3/${type}/${id}?${API_KEY}`);
    xhr.send();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        dataDetails = JSON.parse(xhr.responseText);
        callback(dataDetails);
      }
    };
  }
  
  function movieDetails(dataDetails) {
    let container = "";
    detailsPage.innerHTML = "";
    let hours = Math.floor(dataDetails.runtime / 60);
    let minutes = dataDetails.runtime - hours * 60;
    let time;
    if (hours > 0) {
      time = hours + "h " + minutes + "m";
    } else {
      time = minutes + "m";
    }
    container += `<button onclick="hide()" class="absolute top-1 right-4 text-4xl">&times;</button>
                  <div class="d1 w-[30%]">
                    <img src="${IMG_URL}/${dataDetails.poster_path}">
                  </div>
                  <div class="d2 w-[50%] px-8">
                    <h1 class="text-3xl">${dataDetails.title}</h1>
                    <p class="text-gray-500">${dataDetails.tagline}</p>
                    <p class="text-gray-500"><span class="pr-3">${dataDetails.release_date}</span>|<span class="pl-3">${time}<span></p>
                    <div class="geners flex flex-wrap mt-4">`;
    for (let i = 0; i < dataDetails.genres.length; i++) {
      container += `<p class="mr-2 border-solid border-2 bg-gray-500 rounded px-2 py-1">${dataDetails.genres[i].name}</p>`;
    }
    container += `</div>
                    <p class="overview text-gray-50 my-7 w-[90%]">${dataDetails.overview}</p>
                    <div class="lang flex flex-wrap">
                      <p class="text-gray-400 w-[40%]"> spoken languages : </p>
                      <div class="flex flex-wrap w-[60%]">`;
    for (let i = 0; i < dataDetails.spoken_languages.length; i++) {
      container += `    <p class="mr-6 text-gray-50">${dataDetails.spoken_languages[i].english_name}</p>`;
    }
    container += `    </div>
                    </div>`;
    container += `  <div class="companies flex flex-wrap mt-4">
                      <p class="text-gray-400	w-[40%]"> production companies : </p>
                      <div class="flex flex-col w-[60%]">`;
    for (let i = 0; i < dataDetails.production_companies.length; i++) {
      container += `    <p class="text-gray-50	">${dataDetails.production_companies[i].name}</p>`;
    }
    container += `    </div>
                    </div>
                    <div class="country flex mt-4">
                      <p class="text-gray-400 w-[40%]"> country : </p>
                      <div class="flex flex-wrap w-[60%]">`;
    for (let i = 0; i < dataDetails.production_countries.length; i++) {
      container += `    <p class="mr-6 text-gray-50">${dataDetails.production_countries[i].name}</p>`;
    }
    container += `     </div>
                    </div>
                  </div>
                  <div class="d3 w-[20%]">
                    <div class="flex">
                      <p class="ratenumber mr-1 pt-1 text-xl">${
                    Math.round(dataDetails.vote_average * 10) / 10
                      }</p>
                      <img src="/star.png" alt="" class="w-[12%]">
                    </div>
                    <div class="flex my-4">
                      <a target="_blank" href="https://www.imdb.com/title/${
                        dataDetails.imdb_id
                      }/?ref_=nv_sr_srsg_3_tt_5_nm_3_in_0_q_du" class="w-[30%]">
                      <img src="imdb.jpg" class="w-[60%]"></a> 
                      <a target="_blank" href="${
                      dataDetails.homepage
                      }"><i class="fa-solid fa-house text-xl"></i></a>
                    </div>`;
    if (dataDetails.belongs_to_collection) {
      xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        `https://api.themoviedb.org/3/collection/${dataDetails.belongs_to_collection.id}?${API_KEY}`
      );
      xhr.send();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          container += `<div class="parts flex flex-wrap">
                        <p class="w-[100%] my-2 text-xl">related movies</p>`;
          let collectionData = JSON.parse(xhr.responseText);
          for (let i = 0; i < collectionData.parts.length; i++) {
            container += `<div class="w-[50%] p-1">
                          <img src="${IMG_URL}/${collectionData.parts[i].poster_path}">
                          <p class="text-xs">${collectionData.parts[i].title}</p>
                          </div>`;
          }
          container += `</div>
                        </div>`;
          detailsPage.innerHTML += container;
        }
      };
    } else {
      container += `</div>`;
      detailsPage.innerHTML += container;
    }
  }
  function tvDetails(dataDetails) {
    let container = "";
    detailsPage.innerHTML = "";
    let regex = /[0-9]{4}/;
    let stratYear = regex.exec(dataDetails.first_air_date)[0];
    let endYear;
    if (dataDetails.last_air_date === null) {
      endYear = "";
    } else {
      endYear = regex.exec(dataDetails.last_air_date)[0];
    }
    container += `<button onclick="hide()" class="absolute top-1 right-4 text-4xl">&times;</button>
                  <div class="d1 w-[30%]">
                    <img src="${IMG_URL}/${dataDetails.poster_path}">
                  </div>
                  <div class="d2 w-[50%] px-8">
                      <h1 class="text-3xl">${dataDetails.name}</h1>
                      <p class="text-gray-500">${dataDetails.tagline}</p>
                  `;
    container += `  <div class="geners geners flex flex-wrap mt-4">`;
    for (let i = 0; i < dataDetails.genres.length; i++) {
      container += `    <p class="mr-2 border-solid border-2 bg-gray-500 rounded px-2 py-1">${dataDetails.genres[i].name}</p>`;
    }
    container += `</div>
                  <p class="overview text-gray-50 my-7 w-[90%]">${
                    dataDetails.overview
                  }</p>
                  <div class="numberOfSeasons flex">
                    <p class="text-gray-400 w-[40%]"> seasons : </p>
                    <p class=" text-gray-50 w-[60]" >${
                    dataDetails.number_of_seasons
                  }</p>
                  </div>
                  <div class="numberOfSeasons flex mt-4">
                    <p class="text-gray-400 w-[40%]"> episods : </p>
                    <p class=" text-gray-50 w-[60]" >${
                      dataDetails.number_of_episodes
                    }</p>
                  </div>
                  <div class="status flex mt-4">
                    <p class="text-gray-400 w-[40%]"> status : </p>
                    <p class=" text-gray-50 w-[60]" >${dataDetails.status}</p>
                  </div>
                  <div class="firstAir flex mt-4">
                    <p class="text-gray-400 w-[40%]"> first air date : </p>
                    <p class=" text-gray-50 w-[60]" >${
                     dataDetails.first_air_date
                   }</p>
                  </div>
                  <div class="lastAir flex mt-4">
                   <p class="text-gray-400 w-[40%]"> last air date : </p>
                   <p class=" text-gray-50 w-[60]" >${
                      dataDetails.last_air_date || "unknown"
                    }</p>
                  </div>
                  <div class="lang flex flex-wrap mt-4">
                    <p class="text-gray-400 w-[40%]"> spoken languages : </p>
                    <div class="flex flex-wrap w-[60%]">`;
    for (let i = 0; i < dataDetails.spoken_languages.length; i++) {
      container += ` <p class="mr-6 text-gray-50" >${dataDetails.spoken_languages[i].english_name}</p>`;
    }
    container += `</div>
                  </div>
                  <div class="creators flex flex-wrap mt-4">
                    <p class="text-gray-400 w-[40%]"> creators : </p>
                    <div class="flex flex-wrap w-[60%]">`;
    for (let i = 0; i < dataDetails.created_by.length; i++) {
      container += `<p class="mr-6 text-gray-50">${dataDetails.created_by[i].name}</p>`;
    }
    container += `  </div>
                  </div>
                  <div class="companies flex flex-wrap mt-4">
                    <p class="text-gray-400 w-[40%]"> companies : </p>
                    <div class="flex flex-wrap w-[60%]">`;
    for (let i = 0; i < dataDetails.production_companies.length; i++) {
      container += `<p>${dataDetails.production_companies[i].name}</p>`;
    }
    container += `  </div>
                  </div>
                  <div class="country flex flex-wrap mt-4">
                    <p class="text-gray-400 w-[40%]"> country : </p>
                    <div class="flex flex-wrap w-[60%]">`;
    for (let i = 0; i < dataDetails.production_countries.length; i++) {
      container += `<p>${dataDetails.production_countries[i].name}</p>`;
    }
    container += `  </div>
                  </div>
                  </div>
                  <div class="d3 w-[20%]">
                    <div class="flex">
                  <p class="ratenumber mr-1 pt-1 text-xl">${
                    Math.round(dataDetails.vote_average * 10) / 10
                  }</p>
                  <img src="star.png" alt="" class="w-[12%]">
                  </div>
                  <a target="_blank" href="${
                    dataDetails.homepage
                  }"><i class="fa-solid fa-house text-xl my-4"></i></a>`;
    if (dataDetails.seasons.length > 1) {
      container += `<div class="parts flex flex-wrap">
                    <p class="w-[100%] my-2 text-xl">show seasons</p>`;
      for (let i = 0; i < dataDetails.seasons.length; i++) {
        if (dataDetails.seasons[i].poster_path === null) {
          continue;
        }
        container += `<div class="w-[50%] p-2">
                      <img src="${IMG_URL}/${
          dataDetails.seasons[i].poster_path
        }" alt="no photo">
                      <p class="text-xs">${dataDetails.seasons[i].name || ""}</p>
                      </div>`;
      }
      container += `</div>
                    </div>`;
    }
    detailsPage.innerHTML = container;
  }

