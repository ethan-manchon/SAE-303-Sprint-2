let data = await fetch("./src/data/json/codes_postaux.json");
let candidats = await fetch("./src/data/json/candidatures.json");

data = await data.json();
candidats = await candidats.json();

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
            return data[mid]._geopoint; 
        } else if (data[mid].code_postal < code) {
            min = mid + 1;
        } else {
            max = mid - 1; 
        }
    }

    return undefined;
};
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
                filteredDepartement.add(depCode);
            }
        }
    });
    
    filteredDepartement = Array.from(filteredDepartement);


export { Postaux, filteredDepartement };