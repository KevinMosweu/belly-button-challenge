// URL for JSON data

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Setting up dropdown menu and specifying default ID selection

function init() {
    
    // Selecting dropdown menu
    let dropDown = d3.select("#selDataset");

    // Importing data
    d3.json(url).then(function(data) {
        // Console log to check if data is loaded
        console.log(data);

        // Collecting IDs
        let options = data.names;

        // Adding IDs from data to drowdown menu
        options.forEach((item) => dropDown.append("option").text(item).property("value", item));

        // Default ID Selection
        let defaultID = options[0];

        barChart(defaultID);
        bubbleChart(defaultID);
        demographicInfo(defaultID);

    });
}

init();

// Function to create bar chart

function barChart(chosenID) {

    // Importing data
    d3.json(url).then(function(data) {
        let sampleData = data.samples;

        // Filtering to narrow down data to chosen ID
        let selection = sampleData.filter((item) => item.id == chosenID)[0];

        // Setting up trace to only include top 10 results in descending order
        let trace1 = {
            x: selection.sample_values.slice(0, 10).reverse(),
            y: selection.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
            text: selection.otu_labels,
            type: "bar",
            orientation: "h"
        }

        let traceData = [trace1];

        let layout = {
            title: 'Top 10 Present OTUs',
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            },
        }

        Plotly.newPlot("bar", traceData, layout);
    })
}

// Function to create bubble chart

function bubbleChart(chosenID) {

    // Importing data
    d3.json(url).then(function(data) {
        let sampleData = data.samples;

        // Filtering to narrow down data to chosen ID
        let selection = sampleData.filter((item) => item.id == chosenID)[0];

        // Setting up trace for bubble chart
        let trace2 = {
            x: selection.otu_ids,
            y: selection.sample_values,
            text: selection.otu_labels,
            mode: "markers",
            marker: {
                size: selection.sample_values,
                color: selection.otu_ids,
                colorscale: "Earth"
            }  
        }

        let traceData = [trace2];

        let layout2 = {
            title: "Bacteria Sample Size by OTU ID",
            xaxis: { title: "OTU ID"}
        }

        Plotly.newPlot("bubble", traceData, layout2);
    })
}

// Function to create demographic info display

function demographicInfo(chosenID) {

    // Importing data
    d3.json(url).then(function(data) {
        let sampleData = data.metadata;

        // Filtering to narrow down data to chosen ID
        let selection = sampleData.filter((item) => item.id == chosenID)[0];

        // Selecting the display
        let display = d3.select("#sample-metadata");

        // Reseting display
        display.html("");

        // Collecting key-value pairs and entering them into the display
        Object.entries(selection).forEach(([key, value]) => {display.append("h5").text(`${key}: ${value}`)});

    })
}

// Function to update graphs and info when a new ID is chosen
function optionChanged(chosenID) { 

    barChart(chosenID);
    bubbleChart(chosenID);
    demographicInfo(chosenID);
};