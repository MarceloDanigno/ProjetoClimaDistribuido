import './style.css';
import { DateTime, Settings } from "luxon";
import Highcharts from "highcharts/highstock";
import Indicators from "highcharts/indicators/indicators.js";
import Regressions from "highcharts/indicators/regressions.js";
Indicators(Highcharts);
Regressions(Highcharts);

document.addEventListener(
  "DOMContentLoaded",
  function () {
    // Adiciona evento de click para cada cidade
    document
      .querySelectorAll("div.locationTarget")
      .forEach((item) => {
        addWeatherEvent(item);
      });
  },
  false
);

function addWeatherEvent(item) {
  item.addEventListener("click", (event) => {
    event.preventDefault();

    // Limpa os dados atuais
    let weeklyinfo = document.getElementById("weeklyinfo");
    weeklyinfo.innerHTML = "";
    let dailyinfo = document.getElementById("dailyinfo");
    dailyinfo.innerHTML = "";

    // Define a cidade como ativa
    let i, tabLinks;
    tabLinks = document.getElementsByClassName("locationTarget");
    for (i = 0; i < tabLinks.length; i++) {
      tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }
    event.currentTarget.className += " active";

    // Define chamada da API
    const apiURL = `https://api.open-meteo.com/v1/forecast?latitude=` + event.currentTarget.dataset.lat + `&longitude=` + event.currentTarget.dataset.lon +
    `&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,apparent_temperature_max,apparent_temperature_min,precipitation_sum,windspeed_10m_max,rain_sum,precipitation_hours&timezone=` + event.currentTarget.dataset.time;

    // Aqui pode ser adicionado um simbolo de loading que deve ser limpado no segundo then (pos:absolute?)

    // Faz a chamada da API
    fetch(apiURL)
      .then((response) => {
        // Transforma a resposta em um objeto e manda para o proximo then
        return response.json();
      })
      .then((data) => {
        let weatherData = data;
        console.log(weatherData);

        // Mostra istruções para a data
        let weeklyText = document.getElementById("weeklyText");
        weeklyText.style.display = "block";

        // Cria dados semanais
        weeklyinfo.innerHTML = `
        <div class="dayTarget" data-idx="0" data-json=` + JSON.stringify(weatherData) + `> <div class="dayTarget__data">`
        + convertDate(weatherData.daily.time[0]) + `</div><div class="dayTarget__data">🌡 ` + parseFloat((weatherData.daily.apparent_temperature_max[0] + weatherData.daily.apparent_temperature_min[0])/2).toFixed(2) +`°C
        </div></div>
        <div class="dayTarget" data-idx="1" data-json=` + JSON.stringify(weatherData) + `> <div class="dayTarget__data">`
        + convertDate(weatherData.daily.time[1]) + `</div><div class="dayTarget__data">🌡 ` + parseFloat((weatherData.daily.apparent_temperature_max[1] + weatherData.daily.apparent_temperature_min[1])/2).toFixed(2) +`°C
        </div></div>
        <div class="dayTarget" data-idx="2" data-json=` + JSON.stringify(weatherData) + `> <div class="dayTarget__data">`
        + convertDate(weatherData.daily.time[2]) + `</div><div class="dayTarget__data">🌡 ` + parseFloat((weatherData.daily.apparent_temperature_max[2] + weatherData.daily.apparent_temperature_min[2])/2).toFixed(2) +`°C
        </div></div>
        <div class="dayTarget" data-idx="3" data-json=` + JSON.stringify(weatherData) + `> <div class="dayTarget__data">`
        + convertDate(weatherData.daily.time[3]) + `</div><div class="dayTarget__data">🌡 ` + parseFloat((weatherData.daily.apparent_temperature_max[3] + weatherData.daily.apparent_temperature_min[3])/2).toFixed(2) +`°C
        </div></div>
        <div class="dayTarget" data-idx="4" data-json=` + JSON.stringify(weatherData) + `> <div class="dayTarget__data">`
        + convertDate(weatherData.daily.time[4]) + `</div><div class="dayTarget__data">🌡 ` + parseFloat((weatherData.daily.apparent_temperature_max[4] + weatherData.daily.apparent_temperature_min[4])/2).toFixed(2) +`°C
        </div></div>
        <div class="dayTarget" data-idx="5" data-json=` + JSON.stringify(weatherData) + `> <div class="dayTarget__data">`
        + convertDate(weatherData.daily.time[5]) + `</div><div class="dayTarget__data">🌡 ` + parseFloat((weatherData.daily.apparent_temperature_max[5] + weatherData.daily.apparent_temperature_min[5])/2).toFixed(2) +`°C
        </div></div>
        <div class="dayTarget" data-idx="6" data-json=` + JSON.stringify(weatherData) + `> <div class="dayTarget__data">`
        + convertDate(weatherData.daily.time[6]) + `</div><div class="dayTarget__data">🌡 ` + parseFloat((weatherData.daily.apparent_temperature_max[6] + weatherData.daily.apparent_temperature_min[6])/2).toFixed(2) +`°C
        </div></div>`;

        // Retira o simbolo de loading aqui

        // Adciona eventos de click para cada dia, para o usuário ver com mais detalhes
        document
        .querySelectorAll("div.dayTarget")
        .forEach((item) => {
          addCollapsableEvent(item);
        });
      })
      .catch((error) => {
        console.error("Falha na chamada da API!");
        console.error(error);
      });
  });
}

function convertDate(date) {
  // date is in format year-month-day
  // convert to day MONTH
  let dateArray = date.split("-");
  let month = dateArray[1];
  let day = dateArray[2];
  // -1 because months are 0 indexed
  var convertedMonth = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
      "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"][(parseInt(month) - 1)];
  return day + " " + convertedMonth;
}

function addCollapsableEvent(item) {
  item.addEventListener("click", (event) => {
    event.preventDefault();

    // Define a data como ativa
    let i, tabLinks;
    tabLinks = document.getElementsByClassName("dayTarget");
    for (i = 0; i < tabLinks.length; i++) {
      tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }
    event.currentTarget.className += " active";

    // Pega json do data-json
    let weatherInfo = JSON.parse(event.currentTarget.dataset.json);

    // Cria espaço para cada informação
    let dailyinfo = document.getElementById("dailyinfo");
    dailyinfo.innerHTML = `
    <div class="dataPoint" id="dataPoint__temp">  </div>
    <div class="dataPoint" id="dataPoint__tempapa">  </div>
    <div class="dataPoint" id="dataPoint__prep">  </div>
    <div class="dataPoint" id="dataPoint__wind">  </div>
    <div class="dataPoint" id="dataPoint__sunrise">  </div>
    <div class="dataPoint" id="dataPoint__sunset">  </div>
    <div class="graphPoint" id="graphPoint__temp">  </div>`;

    // Informação de temperatura
    let temp = document.getElementById("dataPoint__temp");
    let realTemp = parseFloat((weatherInfo.daily.temperature_2m_max[event.currentTarget.dataset.idx] + weatherInfo.daily.temperature_2m_min[event.currentTarget.dataset.idx])/2).toFixed(2)
    console.log(realTemp);
    if (realTemp > 30) {
      temp.innerHTML = "Ta muito quente!";
    } else if (realTemp > 22) {
      temp.innerHTML = "Ta bem quente!";
    } else if (realTemp > 18) {
      temp.innerHTML = "Ta perfeito hoje!";
    } else if (realTemp > 10) {
      temp.innerHTML = "Ta um friozinho bom!";
    } else if (realTemp > 0) {
      temp.innerHTML = "Ta bem frio!";
    } else {
      temp.innerHTML = "Ta muito frio!";
    }

    // Informação de temperatura aparente
    let tempapa = document.getElementById("dataPoint__tempapa");
    let apaTemp = parseFloat((weatherInfo.daily.apparent_temperature_max[event.currentTarget.dataset.idx] + weatherInfo.daily.apparent_temperature_min[event.currentTarget.dataset.idx])/2).toFixed(2)
    console.log(apaTemp);
    let tempdiff = parseFloat(apaTemp - realTemp).toFixed(2);
    if (tempdiff > 5) {
      if (realTemp > 22) {
        tempapa.innerHTML = "Ta bem mais quente que deveria!";
      } else {
        tempapa.innerHTML = "Mas deu uma esquentada boa!";
      }
    } else if (tempdiff < -5) {
      if (realTemp < 18) {
        tempapa.innerHTML = "Ta bem mais frio que deveria!";
      } else {
        tempapa.innerHTML = "Mas deu uma esfriada boa!";
      }
    } else if (tempdiff > 2) {
      if (realTemp > 22) {
        tempapa.innerHTML = "Ta mais quente que deveria!";
      } else {
        tempapa.innerHTML = "Mas deu uma esquentadinha!";
      }
    } else if (tempdiff < -2) {
      if (realTemp < 18) {
        tempapa.innerHTML = "Ta mais frio que deveria!";
      } else {
        tempapa.innerHTML = "Mas deu uma esfriadinha!";
      }
    } else {
      tempapa.innerHTML = "Temperatura ta perto do normal!";
    }

    // Informação de temperatura
    let prep = document.getElementById("dataPoint__prep");
    let prepdata = weatherInfo.daily.precipitation_sum[event.currentTarget.dataset.idx];
    console.log(prepdata);
    if (prepdata > 7.4) {
      prep.innerHTML = "Ta uma chuvarada na rua!";
    } else if (prepdata > 2.5) {
      prep.innerHTML = "Ta chovendo!";
    } else if (prepdata > 0.1) {
      prep.innerHTML = "Ta dando uma chuvinha!";
    } else {
      prep.innerHTML = "Ta sem chuva!";
    }

    // Informação de vento
    let wind = document.getElementById("dataPoint__wind");
    let winddata = weatherInfo.daily.windspeed_10m_max[event.currentTarget.dataset.idx];
    console.log(winddata);
    if (winddata > 70) {
      wind.innerHTML = "Perigo!";
    } else if (winddata > 40) {
      wind.innerHTML = "Ta ventando forte!";
    } else if (winddata > 25) {
      wind.innerHTML = "Ta um vento bom!";
    } else if (winddata > 10) {
      wind.innerHTML = "Rola vento bom pra surf!";
    } else if (winddata > 3) {
      wind.innerHTML = "Ta um ventinho!";
    } else {
      if (apaTemp > 22) {
        wind.innerHTML = "Ta calor e ta sem vento ainda!";
      } else {
        wind.innerHTML = "Vento bem fraco hoje!";
      }
    }

    // Informação de nascer do sol
    Settings.defaultZoneName = weatherInfo.timezone;
    let sunrise = document.getElementById("dataPoint__sunrise");
    let sunrisetime = weatherInfo.daily.sunrise[event.currentTarget.dataset.idx];
    let remoteTime = DateTime.fromISO(sunrisetime);
    let localTime = DateTime.now().setZone(weatherInfo.timezone);
    let timeToSunrise = ((remoteTime.toMillis() - localTime.toMillis())/1000)/60;
    console.log(timeToSunrise);
    if (timeToSunrise > 300) {
      sunrise.innerHTML = "Ta longe do sol nascer!";
    } else if (timeToSunrise > 60) {
      sunrise.innerHTML = "Vai demorar um pouco pro sol nascer!";
    } else if (timeToSunrise > 30) {
      sunrise.innerHTML = "Ta quase na hora do sol nascer!";
    } else if (timeToSunrise > 10) {
      sunrise.innerHTML = "Ta chegando a hora do sol nascer!";
    } else if (timeToSunrise <= 10 && timeToSunrise >= -10) {
      sunrise.innerHTML = "Sol ta nascendo!";
    } else {
      sunrise.innerHTML = "Sol já nasceu!";
    }

    // Informação de por do sol
    let sunset = document.getElementById("dataPoint__sunset");
    let sunsettime = weatherInfo.daily.sunset[event.currentTarget.dataset.idx];
    remoteTime = DateTime.fromISO(sunsettime);
    localTime = DateTime.now().setZone(weatherInfo.timezone);
    let timeToSunset = ((remoteTime.toMillis() - localTime.toMillis())/1000)/60;
    console.log(timeToSunset);
    if (timeToSunset > 300) {
      sunset.innerHTML = "Ta longe do sol se por!";
    } else if (timeToSunset > 60) {
      sunset.innerHTML = "Vai demorar um pouco pro sol se por!";
    } else if (timeToSunset > 30) {
      sunset.innerHTML = "Ta quase na hora do sol se por!";
    } else if (timeToSunset > 10) {
      sunset.innerHTML = "Ta chegando a hora do sol se por!";
    } else if (timeToSunset <= 10 && timeToSunset >= -10) {
      sunset.innerHTML = "Sol ta se ponde!";
    } else {
      sunset.innerHTML = "Sol já se pos!";
    }

    // Informação da temperatura de toda semana
    let graph = document.getElementById("graphPoint__temp");
    graph.innerHTML = '<div id="container"></div>';

    Highcharts.stockChart('container', {

        title: {
            text: 'Temp'
        },

        scrollbar: {
          enabled: false
        },

        navigator: {
          enabled: false
        },

        rangeSelector: {
          enabled: false
        },

        legend: {
            enabled: true
        },

        plotOptions: {
            series: {
                showInLegend: true
            }
        },

        series: [{
            id: 'tempp',
            name: 'Temperature Celcius',
            showInNavigator: false,
            data: weatherInfo.hourly.temperature_2m
        }, {
          type: 'linearRegression',
          linkedTo: 'tempp',
          zIndex: -1,
          params: {
              period: 48
          }
      }],
      tooltip: {
          shared: true,
          split: false
      }
    });

  });
}
