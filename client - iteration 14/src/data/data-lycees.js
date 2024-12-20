let data = await fetch("./src/data/json/lycees.json");

data = await data.json();


let Lycees = {}

data.shift();

data.sort((a, b) => a.numero_uai < b.numero_uai ? -1 : a.numero_uai > b.numero_uai ? 1 : 0 );


Lycees.binarySearch = function(numero_uai) {
    let min = 0;
    let max = data.length - 1;
    let mid;
    while (min <= max) {
        mid = Math.floor((min + max) / 2);
        if (data[mid].numero_uai === numero_uai) {

            // Quand le lycée n'a pas de latitude ou de longitude, on ne peut pas l'afficher sur la carte
            if (data[mid].latitude === null || data[mid].longitude === null) {
                return null;
            }
            return {
                nom : data[mid].appellation_officielle,
                town : data[mid].libelle_commune,
                uai : data[mid].numero_uai,
                coordinates : {
                    lat : data[mid].latitude,
                    lon : data[mid].longitude
                }
            }
            
        } else if (data[mid].numero_uai < numero_uai) {
            min = mid + 1;
        } else {
            max = mid - 1;
        }
    }
    return null;
}


export { Lycees };