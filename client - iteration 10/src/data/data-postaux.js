let data = await fetch("./src/data/json/codes_postaux.json");
data = await data.json();

let Postaux = {}

data.sort((a, b) => a.code_postal < b.code_postal ? -1 : a.code_postal > b.code_postal ? 1 : 0 );

Postaux.getAll = function() {
    return data;
}

Postaux.Code = function (code) {
    let min = 0;
    let max = data.length - 1;

    while (min <= max) {
        const mid = Math.floor((min + max) / 2);

        if (data[mid].code_postal === code) {
            return data[mid]._geopoint; // Correspondance trouvée
        } else if (data[mid].code_postal < code) {
            min = mid + 1; // Recherche dans la moitié supérieure
        } else {
            max = mid - 1; // Recherche dans la moitié inférieure
        }
    }

    return undefined; // Aucun élément trouvé
};

export { Postaux };