let MapView = {};

MapView.render = function(lycees, candidats){

    var map = L.map('map').setView([45.85, 1.25], 9);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 16,
        minZoom: 2,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    let filteredLycees = FilterLycees();

    function FilterLycees() {
        lycees.forEach(lycee => {
            lycee.score = 0;
            candidats.forEach(candidat => {
                candidat.Scolarite.forEach(scolarite => {
                    if (scolarite.AnneeScolaireCode === 0) {
                        if (scolarite.UAIEtablissementorigine === lycee.numero_uai) {
                            lycee.score += 1;
                        }
                    }
   
                });
            });
        });
        return lycees.filter(lycee => lycee.score > 0);
    }

    function RenderLycees() {
        filteredLycees.forEach(lycee => {
            if (lycee.latitude && lycee.longitude && !isNaN(lycee.latitude) && !isNaN(lycee.longitude)) {
                var marker = L.marker([lycee.latitude, lycee.longitude]).addTo(map);
                let totalCandidatures = candidats.filter(candidat => {
                    return candidat.Scolarite.some(scolarite => scolarite.UAIEtablissementorigine === lycee.numero_uai);
                }).length;
                marker.bindPopup(`<b>${lycee.appellation_officielle}</b><br>${lycee.libelle_commune}<br>Candidatures : ${totalCandidatures}`);
            }
        });
    }
    
    RenderLycees();
}
export {MapView};