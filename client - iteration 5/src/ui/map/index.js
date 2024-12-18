
    // function RenderLycees(lycees) {

    //     lycees.forEach(lycee => {

    //     });
    // }
    // RenderLycees(lycees);

let MapView = {};

MapView.render = function(lycees, candidats){

    var map = L.map('map').setView([45.85, 1.25], 9);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 12,
        minZoom: 5,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    let filteredLycees = FilterLycees();

    function FilterLycees() {
        return lycees.filter(lycee => {
            return candidats.some(candidat => {
                return candidat.Scolarite.some(scolarite => scolarite.UAIEtablissementorigine === lycee.numero_uai);
            });
        });
    }

    function RenderLycees() {
        filteredLycees.forEach(lycee => {
            if (lycee.latitude && lycee.longitude && !isNaN(lycee.latitude) && !isNaN(lycee.longitude)) {
                var marker = L.marker([lycee.latitude, lycee.longitude]).addTo(map);
                marker.bindPopup(`<b>${lycee.appellation_officielle}</b><br>${lycee.libelle_commune}`);
            }
        });
    }
    
    RenderLycees();
}
export {MapView};