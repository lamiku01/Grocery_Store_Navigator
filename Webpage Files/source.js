const nodes = {
    "Entrance": [13, 3],
    "Produce": [18, 15],
    2: [15, 27],
    3: [15, 23],
    4: [16, 23],
    5: [18, 23],
    6: [18, 20],
    7: [19, 23],
    8: [20, 23],
    9: [0, 0],
    10: [22, 23],
    11: [24, 13],
    12: [23, 23],
    13: [27, 9],
    14: [25, 22],
    15: [29, 9],
    16: [26, 22],
    17: [31, 9],
    18: [28, 22],
    19: [32, 9],
    20: [30, 22],
    21: [34, 10],
    22: [31, 22],
    23: [35, 9],
    24: [32, 22],
    25: [37, 9],
    26: [34, 22],
    27: [38, 9],
    28: [35, 22],
    29: [39, 14],
    30: [37, 22],
    31: [38, 22],
    32: [39, 24],
    33: [0, 0],
    34: [41, 20],
    35: [0, 0],
    36: [43, 20],
    37: [0, 0],
    38: [45, 20],
    39: [48, 29],
    40: [49, 27],
    41: [49, 25],
    42: [48, 23],
    43: [48, 20],
    44: [48, 18],
    45: [48, 16],
    46: [48, 14],
    47: [48, 12],
    48: [0, 0],
    "Deli/Bakery": [8, 20],
    "Meat & Seafood": [16, 35],
    "Baby": [28, 26],
    "Pet": [33, 26],
    "Dairy": [43, 34],
    "Beverages": [49, 34],
    "Breakfast": [50, 32],
    "Natural & Organic": [43, 36],
    "Exit": [43, 3]
};


//gets the token needed to use the API search

async function fetchProducts(token, item) {

    url = "https://api.kroger.com/v1/products?filter.term=" + item + "&filter.locationId=02400752&filter.limit=1";

    var requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: {
            Authorization: 'Bearer ' + token,
            "Content-Type": "application/json"
        }
    };

    const response = await fetch(url, requestOptions);
    const r = await response.json();
    const n = await r.data;
    return n;
}

async function getProductLocations(token) {

    var textInput = document.getElementById("textInput").value;
    var itemsArray = textInput.split(", ");

    var i = 0;
    var product_locations = ["Entrance"];
    var item_location_dict = {};

    while (i < itemsArray.length) {

        const a = await fetchProducts(token, itemsArray[i]);

        if ((a[0].aisleLocations).length == 0) {
            aisleNum = a[0].categories[0];
        }

        else {
            var aisleNum = a[0].aisleLocations[0].number;

            if (aisleNum == 0 || aisleNum >= 60 || aisleNum == "") {
                aisleNum = a[0].categories[0];
            }

        }

        product_locations.push(aisleNum);

        if (aisleNum in item_location_dict)
            item_location_dict[aisleNum].push(itemsArray[i]);
        else
            item_location_dict[aisleNum] = [itemsArray[i]];
        i++;
    }

    product_locations.push("Exit");

    return [product_locations, item_location_dict];
}

function getToken() {
    var settings = {
        "async": false,
        "crossDomain": true,
        "url": "https://api.kroger.com/v1/connect/oauth2/token",
        "method": "POST",
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic aHR0cGducy1ncm9jZXJ5c3RvcmVuYXZpZ2F0b3Jjb20tMDRhYmU4Y2JlNjM4OGRhMGM0MjU3YjFmNGUwMTFhZWU4ODM4MDM3ODUxMTc5MDc2NzMyOnJrOG55eGxkTGg5V0FJT1Z6ZWY2eVRtRzI3bURFbzBoU0MwUmh2T3U=",

        },
        "data": {
            "grant_type": "client_credentials",
            "scope": "product.compact"
        }
    }

    $.ajax(settings).done(function (response) {
        result = response.access_token;

    });

    return (result);
}


function calculateDistance(city1, city2) {
    const [x1, y1] = city1;
    const [x2, y2] = city2;
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}


function calculateTourDistance(tour, nodes) {
    let distance = 0;
    for (let i = 0; i < tour.length - 1; i++) {
        const city1 = nodes[tour[i]];
        const city2 = nodes[tour[(i + 1) % tour.length]];
        distance += calculateDistance(city1, city2);
    }
    return distance;
}

function twoOptSwap(tour, i, j) {
    const new_tour = tour.slice(0, i);
    const reversed_segment = tour.slice(i, j + 1).reverse();
    const remaining_cities = tour.slice(j + 1);

    return new_tour.concat(reversed_segment).concat(remaining_cities);
}

function twoOpt(tour, nodes) {
    let improvement = true;
    let best_tour = tour;
    let best_distance = calculateTourDistance(best_tour, nodes);

    while (improvement) {
        improvement = false;

        for (let i = 1; i < tour.length - 1; i++) {
            for (let j = i + 1; j < tour.length - 1; j++) {
                const new_tour = twoOptSwap(tour, i, j);
                const new_distance = calculateTourDistance(new_tour, nodes);

                if (new_distance < best_distance) {
                    best_tour = new_tour;
                    best_distance = new_distance;
                    improvement = true;
                }
            }
        }
        tour = best_tour;
    }
    return best_tour;
}

function run2OptAlgorithm(product_locations) {

    selected_aisles = product_locations;
    final_aisles_order = [];
    final_aisles = [];

    for (let i = 0; i < selected_aisles.length; i++) {
        let aisle_num = selected_aisles[i];

        final_aisles_order.push(aisle_num);
        final_aisles.push(nodes[aisle_num]);
    }

    const initialTour = final_aisles_order;
    const optimized_tour = twoOpt(initialTour, nodes);
    const optimized_distance = calculateTourDistance(optimized_tour, nodes);

    return [optimized_tour, optimized_distance];
}

function removeDuplicates(arr) {
    return [...new Set(arr)];
}

function updatePlotlyGraph(xarray, yarray, text) {


    var trace_update = {
        x: [xarray],
        y: [yarray],
        mode: "markers+text",
        type: "scatter",
        text: [text],
        textposition: 'top center',
        textfont: {
            color: 'rgba(116, 176, 255, 1)'
        },
        hovertemplate: '%{text}<extra></extra>'

    };

    var layout_update = {
        'xaxis.range': [0, 55],
        "yaxis.range": [0, 40]
    };

    Plotly.update(TESTER, trace_update, layout_update, [0]);
}

function outputResult(optimized_tour, item_location_dict) {

    var xarray = [13, 43];
    var yarray = [3, 3];
    var text = ["Entrance", "Exit"];

    document.getElementById("myList").innerHTML = "";
    let list = document.getElementById("myList");
    let div = document.createElement('div');
    document.body.appendChild(div);
    let ul = document.createElement('ol');
    let li = null;
    let subLi = null;


    for (i = 1; i < optimized_tour.length - 1; i++) {

        let key = optimized_tour[i];
        let value = item_location_dict[key];

        let li = document.createElement('li');
        if (isNaN(key)) {
            li.innerText = key;
        }
        else
            li.innerText = "Aisle " + key;
        let subOl = document.createElement('ul');

        for (let j in value) {
            let subValue = value[j];
            subLi = document.createElement('li');
            subLi.innerText = subValue;
            subOl.appendChild(subLi);
        }

        li.appendChild(subOl);
        ul.appendChild(li);

        xarray.push(nodes[key][0]);
        yarray.push(nodes[key][1]);
        if (isNaN(key)) {
            text.push(i + ". " + key);
        }
        else
            text.push(i + ". Aisle " + key);
    };

    div.appendChild(ul);
    list.appendChild(div);

    updatePlotlyGraph(xarray, yarray, text);

}

async function runProgram() {


    var token = getToken();
    let product_results = await getProductLocations(token);
    let product_locations = product_results[0];
    let product_location_dict = product_results[1];

    let result = run2OptAlgorithm(product_locations);
    let optimized_tour = removeDuplicates(result[0]);
    let optimized_distance = result[1];

    outputResult(optimized_tour, product_location_dict);

};


function checkInput() {
    const input = document.getElementById("textInput");
    const isValid = input.checkValidity();

    if (isValid) {
        runProgram();
    }
    else
        return;

}