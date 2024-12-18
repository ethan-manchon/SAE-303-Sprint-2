import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";

let MapView = {};

MapView.render = function (candidats, filteredLycees, filteredDepartement, Postaux) {
    var map = L.map("map").setView([45.85, 1.25], 6);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 20,
        minZoom: 3,
    }).addTo(map);

    var markers = L.markerClusterGroup({ zoomToBoundsOnClick: false });

    var getCandidatures = function (lycee) {
        var total = 0, general = 0, sti2d = 0, other = 0;
        candidats.forEach(function (candidat) {
            if (candidat.Baccalaureat.TypeDiplomeCode === 4 && candidat.Scolarite[0].UAIEtablissementorigine === lycee.numero_uai) {
                total++;
                if (candidat.Baccalaureat.SerieDiplomeCode === "Générale") general++;
                else if (candidat.Baccalaureat.SerieDiplomeCode === "STI2D") sti2d++;
                else other++;
            }
        });
        return { total: total, general: general, sti2d: sti2d, other: other };
    };

    var renderLycees = function () {
        filteredLycees.forEach(function (lycee) {
            if (lycee.latitude && lycee.longitude && !isNaN(lycee.latitude) && !isNaN(lycee.longitude)) {
                var candidatures = getCandidatures(lycee);
                var marker = L.marker([lycee.latitude, lycee.longitude])
                    .bindPopup("<b>" + lycee.appellation_officielle + "</b><br>" + lycee.libelle_commune + "<br>" +
                        "Candidature néo-bachelier: " + candidatures.total + "<br>" +
                        "Généraux: " + candidatures.general + "<br>" +
                        "STI2D: " + candidatures.sti2d + "<br>" +
                        "Autres: " + candidatures.other);
                markers.addLayer(marker);
            }
        });
    };

    markers.on("clusterclick", function (a) {
        var cluster = a.layer;
        var total = 0, general = 0, sti2d = 0, other = 0;

        cluster.getAllChildMarkers().forEach(function (marker) {
            var content = marker.getPopup().getContent();
            total += parseInt(content.match(/Candidature néo-bachelier: (\d+)/)[1]);
            general += parseInt(content.match(/Généraux: (\d+)/)[1]);
            sti2d += parseInt(content.match(/STI2D: (\d+)/)[1]);
            other += parseInt(content.match(/Autres: (\d+)/)[1]);
        });

        cluster.bindPopup("Candidature néo-bachelier: " + total + "<br>" +
            "Généraux: " + general + "<br>" +
            "STI2D: " + sti2d + "<br>" +
            "Autres: " + other).openPopup();
    });

    var renderDepartement = function () {
        filteredDepartement.forEach(function (depCode) {
            var geopoint = Postaux.Code(depCode + "000");
            if (geopoint) {
                var coords = geopoint.split(",").map(Number);
                var lat = coords[0], lon = coords[1];
                var marker = L.circle([lat, lon], { fillColor: "#FF0000", color: "none", fillOpacity:'0.5', radius: 5000 });
                var totalReorientation = candidats.filter(function (candidat) {
                    var codePostal = candidat.Scolarite[0]?.CommuneEtablissementOrigineCodePostal || candidat.Scolarite[1]?.CommuneEtablissementOrigineCodePostal;
                    return candidat.Baccalaureat.TypeDiplomeCode === 1 && codePostal?.startsWith(depCode.substring(0, 2));
                }).length;

                marker.bindPopup("Département: <b>" + depCode + "</b><br>Post-Bac: <b>" + totalReorientation + "</b>");
                map.addLayer(marker);
            }
        });
    };

    renderLycees();
    renderDepartement();
    map.addLayer(markers);
};

export { MapView };
