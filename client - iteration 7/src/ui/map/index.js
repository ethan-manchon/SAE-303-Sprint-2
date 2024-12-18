import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import 'leaflet.markercluster';

let MapView = {};

MapView.render = function(lycees, candidats) {
    var map = L.map('map').setView([45.85, 1.25], 9);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 1,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Create a marker cluster group
    var markers = L.markerClusterGroup();

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
                var marker = L.marker([lycee.latitude, lycee.longitude]);
                let totalCandidatures = candidats.filter(candidat => {
                    return candidat.Scolarite.some(scolarite => scolarite.UAIEtablissementorigine === lycee.numero_uai);
                }).length;
                marker.bindPopup(`<b>${lycee.appellation_officielle}</b><br>${lycee.libelle_commune}<br>Candidatures : ${totalCandidatures}`);
                markers.addLayer(marker); // Add marker to the cluster group
            }
        });
    }

    RenderLycees();
    map.addLayer(markers); // Add the cluster group to the map
}

export { MapView };