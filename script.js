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
    
}