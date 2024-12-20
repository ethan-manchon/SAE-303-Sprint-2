import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";

let MapView = {};

// Variable globale pour stocker la carte et les groupes de marqueurs
let map = null;
let neoMarkers = null;
let postMarkers = null;

MapView.render = function (neo, post) {
    // Initialise la carte si elle n'existe pas encore
    if (!map) {
        map = L.map("map").setView([45.85, 1.25], 6);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 20,
            minZoom: 3,
        }).addTo(map);

        // Initialise les groupes de marqueurs
        neoMarkers = L.markerClusterGroup({ zoomToBoundsOnClick: false });
        postMarkers = L.layerGroup();

        map.addLayer(neoMarkers);
        map.addLayer(postMarkers);
    }

    // Efface les marqueurs existants
    neoMarkers.clearLayers();
    postMarkers.clearLayers();

    // Fonction pour ajouter les données des néo-bacheliers
    var renderNeoBachelier = function (neo) {
        neo.forEach(function (bac) {
            var marker = L.marker([bac.lycee.coordinates.lat, bac.lycee.coordinates.lon])
                .bindPopup(
                    "<b>" +
                        bac.lycee.nom +
                        "</b><br>" +
                        bac.town +
                        "<br>" +
                        "Candidature néo-bachelier: " +
                        bac.candidature.total +
                        "<br>" +
                        "Généraux: " +
                        bac.candidature.general +
                        "<br>" +
                        "STI2D: " +
                        bac.candidature.sti2d +
                        "<br>" +
                        "Autres: " +
                        bac.candidature.other
                );
            neoMarkers.addLayer(marker);
        });
    };

    // Gestion des clics sur les clusters
    neoMarkers.on("clusterclick", function (a) {
        var cluster = a.layer;
        var total = 0,
            general = 0,
            sti2d = 0,
            other = 0;

        cluster.getAllChildMarkers().forEach(function (marker) {
            var content = marker.getPopup().getContent();
            total += parseInt(content.match(/Candidature néo-bachelier: (\d+)/)[1]);
            general += parseInt(content.match(/Généraux: (\d+)/)[1]);
            sti2d += parseInt(content.match(/STI2D: (\d+)/)[1]);
            other += parseInt(content.match(/Autres: (\d+)/)[1]);
        });

        cluster.bindPopup(
            "Candidature néo-bachelier: " +
                total +
                "<br>" +
                "Généraux: " +
                general +
                "<br>" +
                "STI2D: " +
                sti2d +
                "<br>" +
                "Autres: " +
                other
        ).openPopup();
    });

    // Fonction pour ajouter les données des post-bacs
    var renderPostBac = function (post) {
        post.forEach(function (dpt) {
            var marker = L.circle([
                dpt.lieu.coordinates.lat,
                dpt.lieu.coordinates.lon,
            ], {
                fillColor: "#FF0000",
                color: "none",
                fillOpacity: "0.5",
                radius: 3000,
            });
            marker.bindPopup(
                "Sous préfecture de: <b>" +
                    dpt.lieu.town +
                    "</b><br>Post-Bac: <b>" +
                    dpt.candidature +
                    "</b>"
            );
            postMarkers.addLayer(marker);
        });
    };

    // Rendu des données
    renderNeoBachelier(neo);
    renderPostBac(post);
};

export { MapView };