let MapView = {};

MapView.render = function(lycees){

    var map = L.map('map').setView([45.85, 1.25], 9);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 12,
        minZoom: 5,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    function RenderLycees() {
        lycees.forEach(lycee => {
            if (lycee.latitude && lycee.longitude && !isNaN(lycee.latitude) && !isNaN(lycee.longitude)) {
                var marker = L.marker([lycee.latitude, lycee.longitude]).addTo(map);
                marker.bindPopup("<b>"+lycee.denomination_principale + "</b><br>"+lycee.libelle_commune).openPopup();
            }
        });
    };
    
    RenderLycees();
}
export {MapView};