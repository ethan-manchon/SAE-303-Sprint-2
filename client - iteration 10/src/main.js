import { Candidats } from "./data/data-candidats.js";
import { Lycees } from "./data/data-lycees.js";

//  import V
import { MapView } from "./ui/map/index.js";

import './index.css';

let C = {};

C.init = async function(){
    V.init();
    // console.log(Candidats.getAll());
    // console.log(Lycees.getAll());
}

let V = {
};

V.init = function(){
    V.renderMap();
}

V.renderMap= function(){
    MapView.render(Candidats.getAll());
}

C.init();