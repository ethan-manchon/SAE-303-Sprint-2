import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

import { Lycees } from "../../data/data-lycees.js";
import { Postaux } from "../../data/data-postaux.js";

let MapView = {};

MapView.render = function(candidats) {
    var map = L.map('map').setView([45.85, 1.25], 6);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 16,
        minZoom: 3,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var markers = L.markerClusterGroup({
        zoomToBoundsOnClick: false
    });

    let filteredLycees = new Set();

    candidats.forEach(candidat => {
        if (candidat.Baccalaureat.TypeDiplomeCode === 4) {
            let lycee = Lycees.binarySearch(candidat.Scolarite[0].UAIEtablissementorigine);
            if (lycee) {
                filteredLycees.add(lycee);
            }
        }
    });

    filteredLycees = Array.from(filteredLycees);

    function RenderLycees() {
        filteredLycees.forEach(lycee => {
            if (lycee.latitude && lycee.longitude && !isNaN(lycee.latitude) && !isNaN(lycee.longitude)) {
                var marker = L.marker([lycee.latitude, lycee.longitude]);

                let totalCandidatures = 0;
                let generalCandidatures = 0;
                let sti2dCandidatures = 0;
                let otherCandidatures = 0;

                candidats.forEach(candidat => {
                    if (candidat.Baccalaureat.TypeDiplomeCode === 4 && candidat.Scolarite[0].UAIEtablissementorigine === lycee.numero_uai) {
                        totalCandidatures++;
                        if (candidat.Baccalaureat.SerieDiplomeCode === 'Générale') {
                            generalCandidatures++;
                        } else if (candidat.Baccalaureat.SerieDiplomeCode === 'STI2D') {
                            sti2dCandidatures++;
                        } else {
                            otherCandidatures++;
                        }
                    }
                });

                marker.bindPopup(`<b>${lycee.appellation_officielle}</b><br>${lycee.libelle_commune}<br>
                                  Candidature néo-bachelier: ${totalCandidatures}<br>
                                  Généraux: ${generalCandidatures}<br>
                                  STI2D: ${sti2dCandidatures}<br>
                                  Autres: ${otherCandidatures}`);
                markers.addLayer(marker);
            }
        });
    }

    markers.on('clusterclick', function (a) {
        var cluster = a.layer;
        var totalCandidatures = 0;
        var generalCandidatures = 0;
        var sti2dCandidatures = 0;
        var otherCandidatures = 0;

        cluster.getAllChildMarkers().forEach(marker => {
            var popupContent = marker.getPopup().getContent();
            var totalMatch = popupContent.match(/Candidature néo-bachelier: (\d+)/);
            var generalMatch = popupContent.match(/Généraux: (\d+)/);
            var sti2dMatch = popupContent.match(/STI2D: (\d+)/);
            var otherMatch = popupContent.match(/Autres: (\d+)/);

            if (totalMatch) totalCandidatures += parseInt(totalMatch[1]);
            if (generalMatch) generalCandidatures += parseInt(generalMatch[1]);
            if (sti2dMatch) sti2dCandidatures += parseInt(sti2dMatch[1]);
            if (otherMatch) otherCandidatures += parseInt(otherMatch[1]);
        });

        cluster.bindPopup(`Candidature néo-bachelier: ${totalCandidatures}<br>
                           Généraux: ${generalCandidatures}<br>
                           STI2D: ${sti2dCandidatures}<br>
                           Autres: ${otherCandidatures}`).openPopup();
    });

    RenderLycees();
    map.addLayer(markers); 

let filteredDepartement = new Set();

candidats.forEach(candidat => {
    if (candidat.Baccalaureat.TypeDiplomeCode === 1) {
        let codePostal = null;
        if (candidat.Scolarite[0].CommuneEtablissementOrigineCodePostal !== null) {
            codePostal = candidat.Scolarite[0].CommuneEtablissementOrigineCodePostal;
        } else if (candidat.Scolarite[1] && candidat.Scolarite[1].CommuneEtablissementOrigineCodePostal !== null) {
            codePostal = candidat.Scolarite[1].CommuneEtablissementOrigineCodePostal;
        }
        if (codePostal) {
            let depCode = codePostal.substring(0, 2);
            depCode += "000";
            filteredDepartement.add(depCode);
        }
    }
});

filteredDepartement = Array.from(filteredDepartement);

function RenderDepartement() {
    filteredDepartement.forEach(depCode => {
        let geopoint = Postaux.Code(depCode);

        if (geopoint) {
            let coords = geopoint.split(',').map(Number);
            var marker2 = L.circleMarker([coords[0], coords[1]], {
                color: '#FF0000',
                radius: 4
            });

            let totalReorientation = 0;

            candidats.forEach(candidat => {
                let codePostal = null;
                if (candidat.Baccalaureat.TypeDiplomeCode === 1) {
                if (candidat.Scolarite[0].CommuneEtablissementOrigineCodePostal !== null) {
                    codePostal = candidat.Scolarite[0].CommuneEtablissementOrigineCodePostal;
                } else if (candidat.Scolarite[1] && candidat.Scolarite[1].CommuneEtablissementOrigineCodePostal !== null) {
                    codePostal = candidat.Scolarite[1].CommuneEtablissementOrigineCodePostal;
                }
                if (codePostal && codePostal.startsWith(depCode.substring(0, 2))) {
                    totalReorientation++;
                }
            }
            });


            marker2.bindPopup(`Département: <b>${depCode}</b><br>Réorientation: <b>${totalReorientation}</b>`);
            map.addLayer(marker2); 
        }
    });
}
let totalReorientation = 0;

candidats.forEach(candidat => {
    if (candidat.Baccalaureat.TypeDiplomeCode === 1) {
        totalReorientation++;
    }
});



RenderDepartement();
map.addLayer(markers);

}

export { MapView };