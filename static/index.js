// Temperature
let newTempXArray = [];
let newTempYArray = [];
// Humidity
let newHumidityXArray = [];
let newHumidityYArray = [];

// The maximum number of data points displayed on our scatter/line graph
let MAX_GRAPH_POINTS = 12;
let ctr = 0;

var currentTab = 1;
var numberOfDHTSensor = 3;
const TEMPERATURE_CHART_DIV = 0;
const HUMIDITY_CHART_DIV = 1;

window.addEventListener("load", (event) => {
  console.log("Page is ready!");
  numberOfDHTSensor = parseInt(document.querySelector("#sensorCount").value);
  drawCharts();
});

function drawCharts() {
  for (let index = 1; index <= numberOfDHTSensor; index++) {
    let temperatureHistoryDiv = document.getElementById(
      `temperature-history-${index}`
    );
    let humidityHistoryDiv = document.getElementById(
      `humidity-history-${index}`
    );
    let temperatureGaugeDiv = document.getElementById(
      `temperature-gauge-${index}`
    );
    let humidityGaugeDiv = document.getElementById(`humidity-gauge-${index}`);

    Plotly.newPlot(
      temperatureHistoryDiv,
      [temperatureTrace],
      temperatureLayout,
      graphConfig
    );
    Plotly.newPlot(
      humidityHistoryDiv,
      [humidityTrace],
      humidityLayout,
      graphConfig
    );

    Plotly.newPlot(temperatureGaugeDiv, temperatureData, layout, graphConfig);
    Plotly.newPlot(humidityGaugeDiv, humidityData, layout, graphConfig);
  }
}

function resetCharts() {
  for (let index = 1; index <= numberOfDHTSensor; index++) {
    let temperatureHistoryDiv = document.getElementById(
      `temperature-history-${index}`
    );
    let humidityHistoryDiv = document.getElementById(
      `humidity-history-${index}`
    );
    let temperatureGaugeDiv = document.getElementById(
      `temperature-gauge-${index}`
    );
    let humidityGaugeDiv = document.getElementById(`humidity-gauge-${index}`);

    let temp_data_update = {
      x: [newTempXArray],
      y: [newTempYArray],
    };
    let humidity_data_update = {
      x: [newHumidityXArray],
      y: [newHumidityYArray],
    };

    Plotly.update(temperatureHistoryDiv, temp_data_update);
    Plotly.update(humidityHistoryDiv, humidity_data_update);

    var temperature_gauge_update = {
      value: 0,
    };
    var humidity_gauge_update = {
      value: 0,
    };

    Plotly.update(temperatureGaugeDiv, temperature_gauge_update);
    Plotly.update(humidityGaugeDiv, humidity_gauge_update);
  }
}

// Initialize the tabs
tabLinks = document.querySelectorAll(".nav-link");

tabLinks.forEach(function (tab) {
  tab.addEventListener("click", function (e) {
    console.log(e.target.dataset.tabNumber);
    currentTab = parseInt(e.target.dataset.tabNumber);
    // Clear Temperature and Humidity Array
    newTempXArray = [];
    newTempYArray = [];
    newHumidityXArray = [];
    newHumidityYArray = [];

    resetCharts();
  });
});

var graphConfig = {
  displayModeBar: false,
  responsive: true,
};

// History Data
var temperatureTrace = {
  x: [],
  y: [],
  name: "Top Sensor",
  mode: "lines+markers",
  type: "line",
};
var humidityTrace = {
  x: [],
  y: [],
  name: "Bottom Sensor",
  mode: "lines+markers",
  type: "line",
};

var temperatureLayout = {
  autosize: false,
  title: {
    text: "Top Sensor",
  },
  font: {
    size: 14,
    color: "#7f7f7f",
  },
  colorway: ["#B22222"],
  width: 320,
  height: 260,
  margin: { t: 30, b: 20, l: 30, r: 20, pad: 0 },
};
var humidityLayout = {
  autosize: false,
  title: {
    text: "Bottom Sensor",
  },
  font: {
    size: 14,
    color: "#7f7f7f",
  },
  colorway: ["#00008B"],
  width: 320,
  height: 260,
  margin: { t: 30, b: 20, l: 30, r: 20, pad: 0 },
};
var config = { responsive: true };

// Gauge Data
var temperatureData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "Top Sensor" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 50 },
    gauge: {
      axis: { range: [null, 100] },
      steps: [
        { range: [0, 20], color: "lightgray" },
        { range: [20, 30], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var humidityData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "Bottom Sensor" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 50 },
    gauge: {
      axis: { range: [null, 100] },
      steps: [
        { range: [0, 20], color: "lightgray" },
        { range: [20, 30], color: "gray" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var layout = { width: 320, height: 250, margin: { t: 0, b: 0, l: 0, r: 0 } };

function updateBoxes(id, temperature, humidity) {
  let temperatureDiv = document.getElementById(`temperature-${id}`);
  let humidityDiv = document.getElementById(`humidity-${id}`);

  if (id === 1) {
    temperatureDiv.innerHTML = temperature + " c";
    humidityDiv.innerHTML = humidity + " %";
  } else if (id === 2) {
    temperatureDiv.innerHTML = temperature + " nm";
    humidityDiv.innerHTML = humidity + " lx";
  } else if (id === 3) {
    temperatureDiv.innerHTML = temperature + " cpm";
    humidityDiv.innerHTML = humidity + " usv";
  } else {
    temperatureDiv.innerHTML = temperature + " aqi";
    humidityDiv.innerHTML = humidity + " apl";
  }
}

function updateGauge(id, temperature, humidity) {
  // If current tab is not equal to the websocket message id then we ignore
  if (currentTab !== id) return;
  var temperature_update = {
    value: temperature,
  };
  var humidity_update = {
    value: humidity,
  };
  let temperatureGaugeDiv = document.getElementById(`temperature-gauge-${id}`);
  let humidityGaugeDiv = document.getElementById(`humidity-gauge-${id}`);

  Plotly.update(temperatureGaugeDiv, temperature_update);
  Plotly.update(humidityGaugeDiv, humidity_update);
}

function updateCharts(id, lineChartDiv, xArray, yArray, sensorRead) {
  if (currentTab !== id) return;
  var today = new Date();
  // var time =
  //   today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  if (xArray.length >= MAX_GRAPH_POINTS) {
    xArray.shift();
  }
  if (yArray.length >= MAX_GRAPH_POINTS) {
    yArray.shift();
  }
  xArray.push(ctr++);
  yArray.push(sensorRead);

  var data_update = {
    x: [xArray],
    y: [yArray],
  };

  if (lineChartDiv === TEMPERATURE_CHART_DIV) {
    let temperatureHistoryDiv = document.getElementById(
      `temperature-history-${id}`
    );
    Plotly.update(temperatureHistoryDiv, data_update);
  } else {
    let humidityHistoryDiv = document.getElementById(`humidity-history-${id}`);
    Plotly.update(humidityHistoryDiv, data_update);
  }
}
//csv.write('date,temperature,humidity,uv,lux,cpm,aqi,apl\n')
function updateSensorReadings(jsonResponse) {

  let temperature = jsonResponse.temperature.toFixed(2);
  let humidity = jsonResponse.humidity.toFixed(2);
  let uv = jsonResponse.uv.toFixed(2);
  let lux = jsonResponse.lux.toFixed(2);
  let cpm = jsonResponse.cpm.toFixed(2);
  let uSv = jsonResponse.uSv.toFixed(2);
  let aqi = jsonResponse.aqi.toFixed(2);
  let apl = jsonResponse.apl.toFixed(2);

  updateBoxes(1, temperature, humidity);
  updateGauge(1, temperature, humidity);
  updateBoxes(2, uv, lux);
  updateGauge(2, uv, lux);
  updateBoxes(3, cpm, uSv);
  updateGauge(3, cpm, uSv);
  updateBoxes(4, aqi, apl);
  updateGauge(4, aqi, apl);

  // Update Temperature Line Chart
  updateCharts(
    1,
    TEMPERATURE_CHART_DIV,
    newTempXArray,
    newTempYArray,
    temperature
  );
  // Update Humidity Line Chart
  updateCharts(
    1,
    HUMIDITY_CHART_DIV,
    newHumidityXArray,
    newHumidityYArray,
    humidity
  );

  // Update Temperature Line Chart
  updateCharts(
    2,
    TEMPERATURE_CHART_DIV,
    newTempXArray,
    newTempYArray,
    uv
  );
  // Update Humidity Line Chart
  updateCharts(
    2,
    HUMIDITY_CHART_DIV,
    newHumidityXArray,
    newHumidityYArray,
    lux
  );

  // Update Temperature Line Chart
  updateCharts(
    3,
    TEMPERATURE_CHART_DIV,
    newTempXArray,
    newTempYArray,
    cpm
  );
  // Update Humidity Line Chart
  updateCharts(
    3,
    HUMIDITY_CHART_DIV,
    newHumidityXArray,
    newHumidityYArray,
    uSv
  );

  // Update Temperature Line Chart
  updateCharts(
    4,
    TEMPERATURE_CHART_DIV,
    newTempXArray,
    newTempYArray,
    aqi
  );
  // Update Humidity Line Chart
  updateCharts(
    4,
    HUMIDITY_CHART_DIV,
    newHumidityXArray,
    newHumidityYArray,
    apl
  );
}
/*
  SocketIO Code
*/
//   var socket = io.connect("http://" + document.domain + ":" + location.port);
var socket = io.connect();

//receive details from server
socket.on("updateSensorData", function (msg) {
  var sensorReadings = JSON.parse(msg);
  //console.log(sensorReadings);
  updateSensorReadings(sensorReadings);
});