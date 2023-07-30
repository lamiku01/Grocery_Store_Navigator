TESTER = document.getElementById('tester');
var trace = {
    x: [13, 43],
    y: [3, 3],
    mode: "markers+text",
    type: 'scatter',
    marker: {
        size: 15,
        color: 'rgba(116, 176, 255, 1)'
    },
    text: ["Entrance", "Exit"],
    textposition: "top center",
    textfont: {
        color: 'rgba(116, 176, 255, 1)'
    },
    hovertemplate: '%{text}<extra></extra>'
};

var data = [trace];

var THISlayout = {

    paper_bgcolor: "#f8f3eb",
    autosize: true,

    margin: {
        l: 20,
        r: 10,
        b: 30,
        t: 30
    },

    xaxis: {
        range: [0, 55],
        showgrid: false
    },

    yaxis: {
        range: [0, 40],
        showgrid: false
    },

    images: [{
        "source": "https://s3.us-east-2.amazonaws.com/gns-grocerystorenavigator.com/map_3.png",
        "xref": "x",
        "yref": "y",
        "x": 0,
        "y": 40,
        "sizex": 55,
        "sizey": 40,
        "sizing": "stretch",
        "opacity": 1,
        "layer": "below"

    }],

};

var config = { responsive: true }

Plotly.newPlot(TESTER, data, THISlayout, config);