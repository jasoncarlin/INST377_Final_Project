function filterList(list, query) {
  return list.filter((item) => {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
}

function injectHTML(list) {
  console.log("fired injectHTML");
  const target = document.querySelector("#restaurant_list");
  target.innerHTML = "";
  list.forEach((item) => {
    const str = `<li>${item.name}</li>`;
    target.innerHTML += str;
  });
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.ceil(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function cutEQList(list) { 
  console.log("fired cut list");
  const range = [...Array(15).keys()];
  return (newArray = range.map((item) => {
    const index = getRandomIntInclusive(0, list.length - 1);
    return list[index];
  }))};

function initmap() {
  const carto = L.map("map").setView([38.98, -76.93], 1);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(carto);
  return carto;
}

function markerPlace(array, map) {
  console.log(array);
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.remove();
    }
  });

  array.forEach((item) => {
    console.log("markerPlace", item);
    

    L.marker([item[1], item[0]]).addTo(map);
  });
}

async function mainEvent() {
  const mainForm = document.querySelector(".main_form");
  const loadButton = document.querySelector("#data_load");
  const clearButton = document.querySelector("#data_clear");
  const generateListButton = document.querySelector("#generate");
  const textField = document.querySelector("#eq");
  const loadAnimation = document.querySelector("#data_load_animation");
  loadAnimation.style.display = "none";

  const carto = initmap();

  const storedData = localStorage.getItem("storedData");
  let parsedData = JSON.parse(storedData);

  let currentList = []; // this is "scoped" to the main event function
  let coords = [];

  loadButton.addEventListener("click", async (submitEvent) => {
    console.log("loading data");
    loadAnimation.style.display = "inline-block";

    const results = await fetch(
      "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-01-01&endtime=2020-01-02"
    );

    const storedList = await results.json();
    localStorage.setItem("storedData", JSON.stringify(storedList));
    parsedData = storedList;
    

    features = storedList.features;
    
    for (let i = 0; i < features.length; i++) {
      const geometry = features[i].geometry;
      const coordinates = geometry.coordinates;
      coords.push(coordinates);
    }
    //console.log(coords);
    loadAnimation.style.display = "none";

    console.table(currentList);
  });

  textField.addEventListener("input", (event) => {
    console.log("input", event.target.value);
    const newList = filterList(currentList, event.target.value);
    console.log(newList);
    injectHTML(newList);
    markerPlace(newList, carto);
  });
 
  generateListButton.addEventListener("click", (event) => {
    console.log("generate new list");
    currentList = cutEQList(coords);
    //console.log(features);
    markerPlace(currentList, carto);
  });

  
  clearButton.addEventListener("click", (event) => {
    console.log("clear browser data");
    localStorage.clear();
    console.log("localStorage Check", localStorage.getItem("storedData"));
  });
}

document.addEventListener("DOMContentLoaded", async () => mainEvent());
