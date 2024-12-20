import './../../../node_modules/jscharting/dist/jscharting';

let ChartView = {};


ChartView.render = function(Neo, Post, value) {
  // Étape 1 : Préparer les données
  const departmentData = {};

  // Parcourir les données de Neo
  Neo.forEach(entry => {
      const codePostal = entry.cp.codePostal;
      const candidature = entry.candidature;

      if (!departmentData[codePostal]) {
          departmentData[codePostal] = { general: 0, sti2d: 0, other: 0, postBac: 0 };
      }

      departmentData[codePostal].general += candidature.general;
      departmentData[codePostal].sti2d += candidature.sti2d;
      departmentData[codePostal].other += candidature.other;
  });

  // Parcourir les données de Post
  Post.forEach(entry => {
      const codePostal = entry.lieu.codePostal;
      const candidature = entry.candidature;

      if (!departmentData[codePostal]) {
          departmentData[codePostal] = { general: 0, sti2d: 0, other: 0, postBac: 0 };
      }

      departmentData[codePostal].postBac += candidature;
  });

  // Étape 2 : Trier et regrouper les petits départements
  let otherData = { general: 0, sti2d: 0, other: 0, postBac: 0 };
  const sortedData = Object.entries(departmentData)
      .map(([codePostal, data]) => {
          data.total = data.general + data.sti2d + data.other + data.postBac;
          return { codePostal, ...data };
      })
      .sort((a, b) => b.total - a.total);

  const filteredData = [];
  sortedData.forEach(item => {
      if (item.total < value) {
          otherData.general += item.general;
          otherData.sti2d += item.sti2d;
          otherData.other += item.other;
          otherData.postBac += item.postBac;
      } else {
          filteredData.push(item);
      }
  });

  if (otherData.general + otherData.sti2d + otherData.other + otherData.postBac > 0) {
      filteredData.push({
          codePostal: "Autres départements",
          ...otherData,
      });
  }

  // Étape 3 : Construire les données pour le graphique
  const chartData = [
      { name: "General", points: [] },
      { name: "STI2D", points: [] },
      { name: "Autres", points: [] },
      { name: "Post-Bac", points: [] }
  ];

  filteredData.forEach(item => {
      chartData[0].points.push({ x: item.codePostal, y: item.general });
      chartData[1].points.push({ x: item.codePostal, y: item.sti2d });
      chartData[2].points.push({ x: item.codePostal, y: item.other });
      chartData[3].points.push({ x: item.codePostal, y: item.postBac });
  });

  // Étape 4 : Configurer et rendre le graphique
  JSC.chart('chart', {
      type: 'horizontal column',
      legend_position: 'inside right',
      title_label_text: 'Répartition des candidatures par type',
      axisToZoom: 'x',
      xAxis: {
          defaultTick_label_text: '%value',
          label_text: 'Départements',
      },
      yAxis: {
          label_text: 'Nombre de candidatures',
          scale_type: 'stacked'
      },

      series: chartData
  });
};




export { ChartView };