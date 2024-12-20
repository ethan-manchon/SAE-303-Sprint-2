import { Candidats } from "./data/data-candidats.js";

//  import V
import { MapView } from "./ui/map/index.js";
import { ChartView } from "./ui/chart/index.js";

import './index.css';

let C = {};

C.init = async function(dist, generale, postBac, autres, sti2d){
    let dataLycee = Candidats.getNeoBachelierByLycee(dist, generale, autres, sti2d);
    let dataDepartement = Candidats.getPostBacByDepartement(dist, postBac);
    V.init(dataLycee, dataDepartement);
}

let V = {
    chart: document.querySelector("#chart"),
};

V.init = function(dataLycee, dataDepartement){
    V.renderMap(dataLycee, dataDepartement);
    V.renderChart(dataLycee, dataDepartement, 5);
    V.handleSlider(dataLycee, dataDepartement);
    V.handleDistanceSlider();
    V.handleCheckboxes();
}

V.renderMap= function(dataLycee, dataDepartement){
    MapView.render(dataLycee, dataDepartement);
}
V.renderChart= function(dataLycee, dataDepartement, value){
   V.chart = ChartView.render(dataLycee, dataDepartement, value);
}
V.handleSlider = function(dataLycee, dataDepartement){
    document.querySelector("#slider").addEventListener("input", function(event) {
        let value = event.target.value;
        V.renderChart(dataLycee, dataDepartement, value);
    });
}
V.handleDistanceSlider = function(){
    let distCheckbox = document.querySelector("#distCheckbox");
    let distanceSlider = document.querySelector("#distanceSlider");
    let value = distCheckbox.checked ? distanceSlider.value : 9000;

    distanceSlider.addEventListener("input", function(event) {
        if (distCheckbox.checked) {
            value = event.target.value;
            V.updateData();
        }
    });

    distCheckbox.addEventListener("change", function() {
        value = distCheckbox.checked ? distanceSlider.value : 9000;
        V.updateData();
    });

    return value;
}
V.handleCheckboxes = function() {
    document.querySelectorAll("input[type=checkbox]").forEach(function(checkbox) {
        checkbox.addEventListener("change", function() {
            V.updateData();
        });
    });
}

V.updateData = function() {
    let dist = V.handleDistanceSlider();
    let checkboxes = V.getCheckboxStatus();
    C.init(dist, checkboxes.generale, checkboxes.postBac, checkboxes.autres, checkboxes.sti2d);
}

V.getCheckboxStatus = function() {
    let generaleCheckbox = document.querySelector("#generaleCheckbox").checked;
    let postBacCheckbox = document.querySelector("#postBacCheckbox").checked;
    let autresCheckbox = document.querySelector("#autresCheckbox").checked;
    let sti2dCheckbox = document.querySelector("#sti2dCheckbox").checked;
    
    return {
        generale: generaleCheckbox,
        postBac: postBacCheckbox,
        autres: autresCheckbox,
        sti2d: sti2dCheckbox
    };
}

C.init(9000, true, true, true, true);