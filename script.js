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

function cutEQList(list, includeTsunamis = false) { 
  console.log("fired cut list");
  const filteredList = includeTsunamis ? 
    list.filter(item => item.properties.tsunami === 1):
    list; 
  const range = [...Array(15).keys()];
  return (newArray = range.map((item) => {
    const index = getRandomIntInclusive(0, filteredList.length - 1);
    return filteredList[index];
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

function markerPlace(array, map, data) {
  console.log(array);
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.remove();
    }
  });

    
  array.forEach((item, index) => {
    
    const marker = L.marker([item[1], item[0]]).addTo(map);
    
    console.log(data[index].geometry.coordinates)
    console.log(item)
    
    for (let i = 0; i < features.length; i++) { 
      const eqCoords = data[i].geometry.coordinates;
      const eqLat = eqCoords[1];
      const eqLng = eqCoords[0];

      if (item[0] === eqLng && item[1] === eqLat) {
        const earthquake = data[i].properties;
        
        const magnitude = earthquake.mag;
        const place = earthquake.place;
        const url = earthquake.url;
        
        marker.bindPopup(
          `<strong>Location:</strong> ${place}<br>
          <strong>Magnitude:</strong> ${magnitude}<br>
          <strong>URL:</strong> <a href="${url}" target="_blank">${url}</a>
          <Strong>Coords:</strong> ${[item[1], item[0]]}<br>`
        ).openPopup();
      }
      
    }

    
  });
}

async function mainEvent() {
  const mainForm = document.querySelector(".main_form");
  const loadButton = document.querySelector("#data_load");
  const clearButton = document.querySelector("#data_clear");
  const generateListButton = document.querySelector("#generate");
  const textField = document.querySelector("#eq");
  const loadAnimation = document.querySelector("#data_load_animation");
  const tsunamiCheckbox = document.getElementById('tsunami-checkbox');
  const refreshButton = document.querySelector("#refresh_data");
  loadAnimation.style.display = "none";

  const carto = initmap();

  const storedData = localStorage.getItem("storedData");
  let parsedData = JSON.parse(storedData);
  
  
  let currentList = []; 
  let coords = [];
  let allFeatures = [];

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
    allFeatures = features;
    
    
    for (let i = 0; i < features.length; i++) {
      const geometry = features[i].geometry;
      const coordinates = geometry.coordinates;
      coords.push(coordinates);
    }
    //console.log(coords);
    loadAnimation.style.display = "none";    
  });

  

  textField.addEventListener("input", (event) => {
    console.log("input", event.target.value);
    const newList = filterList(currentList, event.target.value);
    console.log(newList);
    injectHTML(newList);
    markerPlace(newList, carto, currentList);
  });
 
  generateListButton.addEventListener("click", (event) => {
    console.log("generate new list");
    currentList = cutEQList(coords);
    
    markerPlace(currentList, carto, allFeatures);
  });

  
  clearButton.addEventListener("click", (event) => {
    console.log("clear browser data");
    localStorage.clear();
    console.log("localStorage Check", localStorage.getItem("storedData"));
  });

  refreshButton.addEventListener("click", async () => {
    console.log("refresh")
    loadAnimation.style.display = "inline-block";

    const results = await fetch(
      "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-01-01&endtime=2020-01-02"
    );
    
    const newData = await results.json();
    localStorage.setItem("storedData", JSON.stringify(newData));
    parsedData = newData;

    console.table(parsedData);
    loadAnimation.style.display = "none";
  })
}

document.addEventListener("DOMContentLoaded", async () => mainEvent());
