import './../../../node_modules/jscharting/dist/jscharting';

let ChartView = {};

ChartView.render = function(data) {
  console.log(data);
  var series = JSC.nest()
    .key(function(candidat) {
      if (candidat.Baccalaureat.TypeDiplomeCode === 1) {
        return 'Post-Bac';
      } else if (candidat.Baccalaureat.TypeDiplomeCode === 4) {
        if (candidat.Baccalaureat.SerieDiplomeCode === 'Générale') {
          return 'Générale';
        } else if (candidat.Baccalaureat.SerieDiplomeCode === 'STI2D') {
          return 'STI2D';
        } else {
          return 'Autres';
        }
      } else {
        return 'Autres';
      }
      })
    .key(function(candidat) {
      let codePostal = candidat.Scolarite[0]?.CommuneEtablissementOrigineCodePostal || candidat.Scolarite[1]?.CommuneEtablissementOrigineCodePostal;
      return codePostal ? codePostal.substring(0, 2) : 'Autres';
    })
    .rollup(function(leaves) {
      return leaves.length;
    })
    .series(data);

  JSC.chart('chart', {
    type: 'horizontal column',
    debug: true,
    title_label_text: 'Candidatures par filière et par département',
    legend_visible: false,
    palette: ['#9fa8da', '#f48fb1', '#ffab91', '#ffe082', '#c5e1a5', '#80cbc4', '#81d4fa'],
    defaultPoint_tooltip: 'Département: <b>%name</b> <br> Étudiant en: <b>%seriesname</b> <br><b>%value candidatures</b>',
    defaultSeries_firstPoint: { label_text: '%seriesName' },
    yAxis: {
      scale_type: 'stacked',
      alternateGridFill: 'none',
    },
    series: series
  });
}

export { ChartView };
