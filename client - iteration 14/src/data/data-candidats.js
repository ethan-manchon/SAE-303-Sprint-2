import { Lycees } from "./data-lycees.js";
import { Postaux } from "./data-postaux.js";

let data = await fetch("./src/data/json/candidatures.json");
data = await data.json();

let Candidats = {};

let distanceVolDoiseau = function(lat_b, lon_b) {
    let lat_a = 45.83572902465089;
    let lon_a = 1.2309630846589699;
    
    let a = Math.PI / 180;
    let lat1 = lat_a * a;
    let lat2 = lat_b * a;
    let lon1 = lon_a * a;
    let lon2 = lon_b * a;
  
    let t1 = Math.sin(lat1) * Math.sin(lat2);
    let t2 = Math.cos(lat1) * Math.cos(lat2);
    let t3 = Math.cos(lon1 - lon2);
    let t4 = t2 * t3;
    let t5 = t1 + t4;
    let rad_dist = Math.atan(-t5/Math.sqrt(-t5 * t5 +1)) + 2 * Math.atan(1);

    return (rad_dist * 3437.74677 * 1.1508) * 1.6093470878864446;
};

Candidats.getNeoBachelierByLycee = function(value, generale, autres, sti2d) {
    let index = {};

    data.forEach(candidat => {
        if (candidat.Baccalaureat.TypeDiplomeCode === 4) {
            let derniereScolarite = candidat.Scolarite.find(scolarite => scolarite.UAIEtablissementorigine);
            if (!derniereScolarite) return;

            let uai = derniereScolarite.UAIEtablissementorigine;
            let lycee = Lycees.binarySearch(uai);
            let cp = Postaux.getTownCoordinates(derniereScolarite.CommuneEtablissementOrigineCodePostal);

            if (!lycee || !cp || distanceVolDoiseau(cp.coordinates.lat, cp.coordinates.lon) > value) return;

            if (!index[uai]) {
                index[uai] = {
                    lycee: lycee, 
                    cp: cp, 
                    candidature: {
                        total: 0,
                        general: 0,
                        sti2d: 0,
                        other: 0
                    }
                };
            }

            let serieCode = candidat.Baccalaureat.SerieDiplomeCode;
            // if (serieCode === "Générale" && generale)  ne fonctionne pas, contraint de faire un if dans un if
            if (serieCode === "Générale") {
                if (generale) {
                    index[uai].candidature.general++;
                    index[uai].candidature.total++;
                }
            } else if (serieCode === "STI2D") {
                if (sti2d) {
                    index[uai].candidature.sti2d++;
                    index[uai].candidature.total++;
                }
            } else if (autres) {
                index[uai].candidature.other++;
                index[uai].candidature.total++;
            }

            if (index[uai].candidature.total === 0) {
                delete index[uai];
            }
        }
    });

    return Object.values(index);
};

Candidats.getPostBacByDepartement = function(value, postBac) {
    const index = {};

    data.forEach(candidat => {
        if (candidat.Baccalaureat.TypeDiplomeCode === 1) {
            if (postBac) {
            const scolarite = candidat.Scolarite;
            let coordinates = null;

            if (scolarite[0].CommuneEtablissementOrigineCodePostal) {
                coordinates = Postaux.getTownCoordinates(scolarite[0].CommuneEtablissementOrigineCodePostal);
            } else if (scolarite[1].CommuneEtablissementOrigineCodePostal) {
                coordinates = Postaux.getTownCoordinates(scolarite[1].CommuneEtablissementOrigineCodePostal);
            }

            if (coordinates && distanceVolDoiseau(coordinates.coordinates.lat, coordinates.coordinates.lon) <= value) {
                const key = JSON.stringify(coordinates);
                if (!index[key]) {
                    index[key] = {
                        lieu: coordinates,
                        candidature: 1
                    };
                } else {
                    index[key].candidature++;
                }
            }    
        }
        }
    });

    return Object.values(index);
};

export { Candidats };
