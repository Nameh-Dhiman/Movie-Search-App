var search = document.querySelector("#movie-search");
var timerid;
var result = document.querySelector("#result-container");
var searchList = document.getElementById("search-list");

var inputDiv = document.querySelector("#inputDiv");
inputDiv.addEventListener("blur", () => {
  searchList.classList.add("hide-search-list");
  search.value = null;
});

async function searchData() {
  try {
    let res = await fetch(
      `https://www.omdbapi.com/?s=${search.value.trim()}&apikey=4ac9e285`
    );
    let data = await res.json();
    if (data.Response == "True") displayList(data.Search);
    else {
      searchList.classList.remove("hide-search-list");
      result.innerHTML = "";
      var noData = document.createElement("img");
      noData.src = "https://c.tenor.com/Z4H2w7dmSGgAAAAM/error-april-fool.gif";
      noData.style.width = "25rem";
      noData.style.borderRadius = "1rem";
      result.setAttribute("class", "noData");
      result.append(noData);
    }
  } catch (err) {
    console.log("Error", err);
  }
}

function displayList(data) {
  searchList.innerHTML = "";
  searchList.classList.remove("hide-search-list");
  data.forEach((el) => {
    var itemDiv = document.createElement("div");
    itemDiv.setAttribute("class", "search-list-item");
    itemDiv.addEventListener("click", () => {
      searchList.classList.add("hide-search-list");
      search.value = null;
      displayData(el.imdbID);
    });
    var item = document.createElement("div");
    item.setAttribute("class", "search-item-thumbnail");

    var itemImg = document.createElement("img");
    if (el.Poster == "N/A") {
      itemImg.src = "https://www.freeiconspng.com/uploads/no-image-icon-23.jpg";
    } else {
      itemImg.setAttribute("src", el.Poster);
    }
    item.append(itemImg);

    var itemInfo = document.createElement("div");
    itemInfo.setAttribute("class", "search-item-info");
    var title = document.createElement("h3");
    title.innerText = el.Title;
    var year = document.createElement("p");
    year.innerText = el.Year;
    itemInfo.append(title, year);
    itemDiv.append(item, itemInfo);
    searchList.append(itemDiv);
  });
}

async function displayData(id) {
  let res = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=4ac9e285`);
  let data = await res.json();
  console.log(data);
  displayMovies(data);
}

function displayMovies(dataObj) {
  result.removeAttribute("class", "noData");
  result.innerHTML = "";

  var poster = document.createElement("div");
  poster.setAttribute("id", "movie-poster");
  var info = document.createElement("div");
  info.setAttribute("id", "movie-info");
  var img = document.createElement("img");
  if (dataObj.Poster == "N/A") {
    img.src = "https://www.freeiconspng.com/uploads/no-image-icon-23.jpg";
  } else {
    img.setAttribute("src", dataObj.Poster);
  }
  poster.append(img);

  var title = document.createElement("h2");
  title.innerHTML = dataObj.Title;
  var dir = document.createElement("h3");
  dir.innerHTML = "Director: " + dataObj.Director;
  var rated = document.createElement("p");
  rated.innerHTML = "Rated: " + dataObj.Rated;
  var year = document.createElement("p");
  year.innerHTML = "Release Year: " + dataObj.Year;
  var imdbR = document.createElement("p");
  imdbR.innerHTML = "ImDB: " + dataObj.imdbRating + "/10";
  var awards = document.createElement("p");
  awards.innerHTML = "Awards: " + dataObj.Awards;
  console.log(Number(dataObj.imdbRating) >= 8.5);
  if (Number(dataObj.imdbRating) > 8.5) {
    var badge = document.createElement("div");
    badge.innerText = "Recommended!";
    badge.setAttribute("class", "badge");
    info.append(badge, title, dir, rated, year, imdbR, awards);
  } else info.append(title, dir, rated, year, imdbR, awards);

  result.append(poster, info);
  result.setAttribute("class", "result-container");
}

function debounce(func, delay) {
  if (timerid) {
    clearInterval(timerid);
  }
  timerid = setTimeout(() => {
    func();
  }, delay);
}
