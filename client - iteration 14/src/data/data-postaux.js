let data = await fetch("./src/data/json/codes_postaux.json");

data = await data.json();

let Postaux = {}

data.sort((a, b) => a.code_postal < b.code_postal ? -1 : a.code_postal > b.code_postal ? 1 : 0 );

let binarySearch = function (code) {
    let min = 0;
    let max = data.length - 1;

    while (min <= max) {
        const mid = Math.floor((min + max) / 2);

        if (data[mid].code_postal === code) {
            return data[mid]; 
        } else if (data[mid].code_postal < code) {
            min = mid + 1;
        } else {
            max = mid - 1; 
        }
    }

    return undefined;
};

Postaux.getTownCoordinates = function (code) {
    
    let dptCode = code.substring(0, 2);
    dptCode += "000";
   
    let info =  binarySearch(dptCode);
    if (info === undefined) {
        info = binarySearch(code);
        if (info === undefined) {
            return undefined;
        }
    }

    return {
       codePostal: info.code_postal,
       town: info.nom_de_la_commune,
        coordinates: {
            lat: info._geopoint.split(",")[0],
            lon: info._geopoint.split(",")[1]
        }
    }

}



export { Postaux };