//  import M
import { Candidats } from "./data/data-candidats.js";
import { Lycees, filteredLycees } from "./data/data-lycees.js";
import { Postaux, filteredDepartement } from "./data/data-postaux.js";

//  import V
import { MapView } from "./ui/map/index.js";
import { ChartView } from "./ui/chart/index.js";

import './index.css';

let C = {};

C.init = async function(){
    V.init();
}

let V = {
    chart: document.querySelector("#chart"),
};

V.init = function(){
    V.renderMap();
    V.renderChart();
}

V.renderMap= function(){
    MapView.render(Candidats.getAll(), filteredLycees, filteredDepartement, Postaux);
}
V.renderChart= function(){
   V.chart = ChartView.render(Candidats.getAll());
}

C.init();