let apiKey = "WjvhQOokmeiUOmgmRAf5Crswwk-ndMKz8XjCd_F5q8Q";
let url = "https://api.unsplash.com/search/photos";

let searchText = document.getElementById("searchInput");
let btnXHR = document.getElementById("xhrSearch");
let btnFetch = document.getElementById("fetchSearch");
let btnFetchAsyncAwait = document.getElementById("fetchAsyncAwaitSearch");
let searchResults = document.getElementById("searchResults");

// ---------- Mouse events (click) ----------
btnXHR.addEventListener("click", function() {
  // clear previous search results
  searchResults.innerHTML = "";
  fetchUnsplashAPI_UsingXHR(searchText.value);
});

btnFetch.addEventListener("click", function() {
  searchResults.innerHTML = "";
  fetchUnsplashAPI_UsingFetch(searchText.value);
});

btnFetchAsyncAwait.addEventListener("click", function() {
  searchResults.innerHTML = "";
  fetchUnsplashAPI_UsingFetchAsyncAwait(searchText.value)
    .catch((e) => {
      console.error(e);
    });
});

// ---------- Keyboard event (keyup): press Enter to search ----------
searchText.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    searchResults.innerHTML = "";
    fetchUnsplashAPI_UsingFetchAsyncAwait(searchText.value)
      .catch((e) => {
        console.error(e);
      });
  }
});

// ---------- 1) XMLHttpRequest ----------
function fetchUnsplashAPI_UsingXHR(keyword) {
  if (!keyword) {
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState != 4) return;
    if (xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      displayImages(data.results);
    }
  };
  xhr.open("GET", url + "?query=" + keyword, true);
  xhr.setRequestHeader("Authorization", "Client-ID " + apiKey);
  xhr.send();
}

// ---------- 2) fetch with promises ----------
function fetchUnsplashAPI_UsingFetch(keyword) {
  if (!keyword) {
    return;
  }
  fetch(url + "?query=" + keyword, {
    headers: {
      Authorization: "Client-ID " + apiKey
    }
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      displayImages(data.results);
    })
    .catch(function(error) {
      console.error(error);
    });
}

// ---------- 3) fetch with async/await ----------
async function fetchUnsplashAPI_UsingFetchAsyncAwait(keyword) {
  if (!keyword) {
    return;
  }
  var response = await fetch(url + "?query=" + keyword, {
    headers: {
      Authorization: "Client-ID " + apiKey
    }
  });
  var data = await response.json();
  displayImages(data.results);
}

// ---------- Create the HTML elements dynamically (DOM API) ----------
function displayImages(images) {
  for (var i = 0; i < images.length; i++) {
    var divElem = document.createElement("div");

    var imgElem = document.createElement("img");
    imgElem.src = images[i].urls.small;
    imgElem.alt = images[i].alt_description;

    var pElem = document.createElement("p");
    var textNode = document.createTextNode("Photo by " + images[i].user.name);
    pElem.appendChild(textNode);

    divElem.appendChild(imgElem);
    divElem.appendChild(pElem);
    searchResults.appendChild(divElem);
  }
}