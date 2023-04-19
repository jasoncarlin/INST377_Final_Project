function filterList(list, query) {
    return list.filter((item) => {
      const lowerCaseName = item.name.toLowerCase();
      const lowerCaseQuery = query.toLowerCase();
      return lowerCaseName.includes(lowerCaseQuery);
    });
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.ceil(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function initmap() {
    const carto = L.map("map").setView([38.98, -76.93], 13);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(carto);
    return carto;
}

function markerPlace(array, map) {
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.remove();
      }
    });
    
    array.forEach((item) => {
      console.log('markerPlace', item);
      const {coordinates} = item.geocoded_column_1
  
      L.marker([coordinates[1], coordinates[0]]).addTo(map);
    })
}

async function mainEvent() {
    const loadButton = document.querySelector("#data_load");
    const clearButton = document.querySelector("#data_clear");
    const textField = document.querySelector("#resto");

    const loadAnimation = document.querySelector("#data_load_animation");
    loadAnimation.style.display = "none";
    const carto = initmap();

    const storedData = localStorage.getItem("storedData");
    let parsedData = JSON.parse(storedData);

    loadButton.addEventListener("click", async (submitEvent) => {
        console.log("loading data");
        loadAnimation.style.display = "inline-block";
    
        const results = await fetch(
          "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-01-01&endtime=2020-01-02"
        );
    
        const storedList = await results.json();
        localStorage.setItem("storedData", JSON.stringify(storedList));
        parsedData = storedList;
    
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

    clearButton.addEventListener("click", (event) => {
    console.log('clear browser data');
    localStorage.clear();
    console.log ('localStorage Check', localStorage.getItem("storedData"));
    })
}

document.addEventListener("DOMContentLoaded", async () => mainEvent());