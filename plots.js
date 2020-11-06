function init() {
  var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      var TestSubjectID = data.names;
      TestSubjectID.forEach((id) => {
        selector
        .append("option")
        .text(id)
        .property("value", id);
      });
    
    optionChanged(940)
    
    
  });
}

function updateMetaTable(sample) {
  d3.json("samples.json").then((data) => {

      var metadata = data.metadata;
      var searchArray = metadata.filter(sampleObject => sampleObject.id == sample);
      var result = searchArray[0];

      var metaDataTable = d3.select("#sample-metadata");
      metaDataTable.html("");

      Object.entries(result).forEach(([key, value]) => {
          metaDataTable.append("h6").text(`${key}: ${value}`)
      })

  });
}

function plotChart(sample) {    
  d3.json("samples.json").then((data) => {

  var samples = data.samples;
  var searchArray = samples.filter(sampleObject => sampleObject.id == sample);
  var result = searchArray[0];
  var searchValues = result.searchValues;
  var otu_ids = result.otu_ids;
  var otuIDLables = result.otuIDLables;   

  var visualizationSetup = {
      x: otu_ids,
      y: searchValues,
      text: otuIDLables,
      mode: 'markers',
      marker: {
      size: searchValues,
      color: otu_ids,
      }
  };
  var data = [visualizationSetup];
  var layout = {
      title: 'Bacteria Cultures per Sample',
      xaxis: {title:"OTU ID " + sample},
      margin: {t:30}
  };
  Plotly.newPlot('bubble', data, layout); 


  var visualizationSetup = {
      x: searchValues.slice(0,10).reverse(),
      y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
      text: otuIDLables.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
  };
  var data = [visualizationSetup];
  var layout = {
      title: "OTU Values for Subject: " + sample,
      margin: {l: 100, r: 100, t: 100, b: 100}
  };
  Plotly.newPlot("bar", data, layout);  
  });
}

function optionChanged(newSample) {
  plotChart(newSample);
  updateMetaTable(newSample);
}

init();