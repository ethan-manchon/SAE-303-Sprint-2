    let data = await fetch("./src/data/json/lycees.json");
    let candidats = await fetch("./src/data/json/candidatures.json");

    data = await data.json();
    candidats = await candidats.json();

    let Lycees = {}

    data.shift();

    data.sort((a, b) => a.numero_uai < b.numero_uai ? -1 : a.numero_uai > b.numero_uai ? 1 : 0 );

    Lycees.getAll = function() {
        return data;
    }

    Lycees.binarySearch = function(numero_uai) {
        let min = 0;
        let max = data.length - 1;
        let mid;
        while (min <= max) {
            mid = Math.floor((min + max) / 2);
            if (data[mid].numero_uai === numero_uai) {
                return data[mid];
            } else if (data[mid].numero_uai < numero_uai) {
                min = mid + 1;
            } else {
                max = mid - 1;
            }
        }
        return null;
    }

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

    export { Lycees, filteredLycees };
