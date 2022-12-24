import './style.css';
import { DateTime, Settings } from "luxon";
import _ from "lodash";
import Highcharts, { color } from "highcharts/highstock";
import Indicators from "highcharts/indicators/indicators.js";
import Regressions from "highcharts/indicators/regressions.js";
import borderRadius from "highcharts-border-radius";
Indicators(Highcharts);
Regressions(Highcharts);
borderRadius(Highcharts);

// Executa quando a tela carrega
document.addEventListener(
  "DOMContentLoaded",
  function () {
    // Adiciona evento de click para cada cidade
    document
      .querySelectorAll("div.locationTarget")
      .forEach((item) => {
        addWeatherEvent(item);
      });

    // Adicionar evento de click para o submit da procura de cidade
    document
      .getElementById("search-box-click")
      .addEventListener("click", (event) => { searchCity(event); });
  },
  false
);

// Função de procurar cidade
function searchCity(event) {
  event.preventDefault();

  // Adiciona o simbolo de carregamento
  let loadingTargetGeo = document.getElementById("loadingTargetGeo");
  loadingTargetGeo.style.display = "block";

  // Pega a cidade escrita e faz a chamada da API
  let inputText = document.getElementById("search-box-inputtext").value;
  const geoapiURL = `https://geocoding-api.open-meteo.com/v1/search?name=` + inputText + `&language=pt&count=1`;
  fetch(geoapiURL)
      .then((response) => {
        // Transforma a resposta em um objeto e manda para o proximo then
        if (response.status == 400) {
          throw "Cidade não encontrada";
        }
        return response.json();
      })
      .then((data) => {
        // Verifica se a cidade foi encontrada (se existe algo nas respostas)
        if (!("results" in data)) {
          throw "Cidade não encontrada";
        }
        console.log(data);
        let newLocationTarget = document.getElementById("searchLocationTarget");

        // Retira o simbolo de loading
        let loadingTargetGeo = document.getElementById("loadingTargetGeo");
        loadingTargetGeo.style.display = "none";

        // Atualiza o HTML dummy de cidade. Esse vai funcionar do mesmo modo que os as outras cidades
        newLocationTarget.style.display = "block";
        newLocationTarget.className = newLocationTarget.className.replace(" active", "");
        newLocationTarget.innerHTML = data.results[0].name;
        newLocationTarget.dataset.lat = data.results[0].latitude;
        newLocationTarget.dataset.lon = data.results[0].longitude;
        newLocationTarget.dataset.time = data.results[0].timezone;
      })
      .catch((error) => {
        // Caso algum erro acontecer, atualiza a mensagem do search box, tira o simbolo de loading e mostra o erro no console
        console.error("Falha na chamada da API!");
        document.getElementById("search-box-inputtext").value = "";
        document.getElementById("search-box-inputtext").placeholder = "Cidade não encontrada";

        // Retira o simbolo de loading
        let loadingTargetGeo = document.getElementById("loadingTargetGeo");
        loadingTargetGeo.style.display = "none";
      });
}

// Função de adicionar evento de click para cada cidade
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
    `&hourly=dewpoint_2m,precipitation,rain,temperature_2m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,apparent_temperature_max,apparent_temperature_min,precipitation_sum,windspeed_10m_max,rain_sum,precipitation_hours&timezone=` + event.currentTarget.dataset.time;

    // Adiciona o simbolo de carregamento
    let loadingTarget = document.getElementById("loadingTarget");
    loadingTarget.style.display = "block";

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
        <div class="dayTarget" data-idx="0" data-json=` + JSON.stringify(weatherData) + `> <div class="dayTarget__data"><b>`
        + convertDate(weatherData.daily.time[0]) + `</b></div><div class="dayTarget__data"><b>🌡️</b> ` + parseFloat((weatherData.daily.temperature_2m_max[0] + weatherData.daily.temperature_2m_min[0])/2).toFixed(2) +`°C
        </div></div>
        <div class="dayTarget" data-idx="1" data-json=` + JSON.stringify(weatherData) + `> <div class="dayTarget__data"><b>`
        + convertDate(weatherData.daily.time[1]) + `</b></div><div class="dayTarget__data"><b>🌡️</b> ` + parseFloat((weatherData.daily.temperature_2m_max[1] + weatherData.daily.temperature_2m_min[1])/2).toFixed(2) +`°C
        </div></div>
        <div class="dayTarget" data-idx="2" data-json=` + JSON.stringify(weatherData) + `> <div class="dayTarget__data"><b>`
        + convertDate(weatherData.daily.time[2]) + `</b></div><div class="dayTarget__data"><b>🌡️</b> ` + parseFloat((weatherData.daily.temperature_2m_max[2] + weatherData.daily.temperature_2m_min[2])/2).toFixed(2) +`°C
        </div></div>
        <div class="dayTarget" data-idx="3" data-json=` + JSON.stringify(weatherData) + `> <div class="dayTarget__data"><b>`
        + convertDate(weatherData.daily.time[3]) + `</b></div><div class="dayTarget__data"><b>🌡️</b> ` + parseFloat((weatherData.daily.temperature_2m_max[3] + weatherData.daily.temperature_2m_min[3])/2).toFixed(2) +`°C
        </div></div>
        <div class="dayTarget" data-idx="4" data-json=` + JSON.stringify(weatherData) + `> <div class="dayTarget__data"><b>`
        + convertDate(weatherData.daily.time[4]) + `</b></div><div class="dayTarget__data"><b>🌡️</b> ` + parseFloat((weatherData.daily.temperature_2m_max[4] + weatherData.daily.temperature_2m_min[4])/2).toFixed(2) +`°C
        </div></div>
        <div class="dayTarget" data-idx="5" data-json=` + JSON.stringify(weatherData) + `> <div class="dayTarget__data"><b>`
        + convertDate(weatherData.daily.time[5]) + `</b></div><div class="dayTarget__data"><b>🌡️</b> ` + parseFloat((weatherData.daily.temperature_2m_max[5] + weatherData.daily.temperature_2m_min[5])/2).toFixed(2) +`°C
        </div></div>
        <div class="dayTarget" data-idx="6" data-json=` + JSON.stringify(weatherData) + `> <div class="dayTarget__data"><b>`
        + convertDate(weatherData.daily.time[6]) + `</b></div><div class="dayTarget__data"><b>🌡️</b> ` + parseFloat((weatherData.daily.temperature_2m_max[6] + weatherData.daily.temperature_2m_min[6])/2).toFixed(2) +`°C
        </div></div>`;

        // Retira o simbolo de loading
        let loadingTarget = document.getElementById("loadingTarget");
        loadingTarget.style.display = "none";

        // Adciona eventos de click para cada dia, para o usuário ver com mais detalhes
        document
        .querySelectorAll("div.dayTarget")
        .forEach((item) => {
          addCollapsableEvent(item);
        });
      })
      .catch((error) => {
        // Caso algum erro acontecer tira o simbolo de loading e mostra o erro no console
        console.error("Falha na chamada da API!");
        console.error(error);

        let loadingTarget = document.getElementById("loadingTarget");
        loadingTarget.style.display = "none";
      });
  });
}

// Função para converter data em formato legível
function convertDate(date) {
  // Converte yy-mm-dd para dd MONTH
  let dateArray = date.split("-");
  let month = dateArray[1];
  let day = dateArray[2];
  // -1 pois os meses são indexados em 0
  var convertedMonth = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
      "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"][(parseInt(month) - 1)];
  return day + " " + convertedMonth;
}

// Função para adicionar eventos de click para cada dia
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
    <div class="dataContainer"><div class="dataPoint" id="dataPoint__temp">  </div></div>
    <div class="dataContainer"><div class="dataPoint" id="dataPoint__tempapa">  </div></div>
    <div class="dataContainer"><div class="dataPoint" id="dataPoint__prep">  </div></div>
    <div class="dataContainer"><div class="dataPoint" id="dataPoint__wind">  </div></div>
    <div class="dataContainer"><div class="dataPoint" id="dataPoint__sunrise">  </div></div>
    <div class="dataContainer"><div class="dataPoint" id="dataPoint__sunset">  </div></div>
    <div class="graphContainer"><div class="graphPoint" id="graphPoint__temp">  </div></div>`;

    // Informação de temperatura
    // Retorna resultados baseados em ser maior ou menor que dados hardcoded
    let temp = document.getElementById("dataPoint__temp");
    // Faz a média da temperatura máxima e mínima
    let realTemp = parseFloat((weatherInfo.daily.temperature_2m_max[event.currentTarget.dataset.idx] + weatherInfo.daily.temperature_2m_min[event.currentTarget.dataset.idx])/2).toFixed(2)
    temp.innerHTML = '<div class="dataPoint__infotext"><b>🌡️ ' + realTemp + '°C</b></div>';
    if (realTemp > 30) {
      temp.innerHTML += '<div class="dataPoint__infotext">Ta <b>muito quente</b>!</div>';
    } else if (realTemp > 22) {
      temp.innerHTML += '<div class="dataPoint__infotext">Ta <b>bem</b> quente!</div>';
    } else if (realTemp > 18) {
      temp.innerHTML += '<div class="dataPoint__infotext"><i>Ta perfeito hoje!</i></div>';
    } else if (realTemp > 10) {
      temp.innerHTML += '<div class="dataPoint__infotext">Ta um <i>friozinho</i> bom!</div>';
    } else if (realTemp > 0) {
      temp.innerHTML += '<div class="dataPoint__infotext">Ta <b>bem</b> frio!</div>';
    } else {
      temp.innerHTML += '<div class="dataPoint__infotext">Ta <b>muito frio</b>!</div>';
    }

    // Informação de temperatura aparente
    // Retorna resultados baseados em ser maior ou menor que dados hardcoded, também é visto a diferença entre a temperatura real e a aparente
    let tempapa = document.getElementById("dataPoint__tempapa");
    // Faz a média da temperatura máxima e mínima
    let apaTemp = parseFloat((weatherInfo.daily.apparent_temperature_max[event.currentTarget.dataset.idx] + weatherInfo.daily.apparent_temperature_min[event.currentTarget.dataset.idx])/2).toFixed(2)
    let tempdiff = parseFloat(apaTemp - realTemp).toFixed(2);
    tempapa.innerHTML = '<div class="dataPoint__infotext"><b>👀 ' + apaTemp + '°C</b></div>';
    if (tempdiff > 5) {
      if (realTemp > 22) {
        tempapa.innerHTML += '<div class="dataPoint__infotext">Ta <b>bem mais quente que deveria</b>!</div>';
      } else {
        tempapa.innerHTML += '<div class="dataPoint__infotext">Mas deu uma <b>esquentada boa</b>!</div>';
      }
    } else if (tempdiff < -5) {
      if (realTemp < 18) {
        tempapa.innerHTML += '<div class="dataPoint__infotext">Ta <b>bem mais frio que deveria</b>!</div>';
      } else {
        tempapa.innerHTML += '<div class="dataPoint__infotext">Mas deu uma <b>esfriada boa</b>!</div>';
      }
    } else if (tempdiff > 2) {
      if (realTemp > 22) {
        tempapa.innerHTML += '<div class="dataPoint__infotext">Ta <b>mais quente</b> que deveria!</div>';
      } else {
        tempapa.innerHTML += '<div class="dataPoint__infotext">Mas deu uma <b>esquentadinha</b>!</div>';
      }
    } else if (tempdiff < -2) {
      if (realTemp < 18) {
        tempapa.innerHTML += '<div class="dataPoint__infotext">Ta <b>mais frio</b> que deveria!</div>';
      } else {
        tempapa.innerHTML += '<div class="dataPoint__infotext">Mas deu uma <b>esfriadinha</b>!</div>';
      }
    } else {
      tempapa.innerHTML += '<div class="dataPoint__infotext"><i>Temperatura ta perto do normal!</i></div>';
    }

    // Informação de precipitação
    // Retorna resultados baseados em ser maior ou menor que dados hardcoded
    let prep = document.getElementById("dataPoint__prep");
    let prepdata = weatherInfo.daily.precipitation_sum[event.currentTarget.dataset.idx];
    prep.innerHTML = '<div class="dataPoint__infotext"><b>🌧️ ' + prepdata + 'mm</b></div>';
    if (prepdata > 7.4) {
      prep.innerHTML += '<div class="dataPoint__infotext">Ta uma <b>chuvarada na rua</b>!</div>';
    } else if (prepdata > 2.5) {
      prep.innerHTML += '<div class="dataPoint__infotext">Ta <b>chovendo</b>!</div>';
    } else if (prepdata > 0.1) {
      prep.innerHTML += '<div class="dataPoint__infotext">Ta danda uma <i>chuvinha</i>!</div>';
    } else {
      prep.innerHTML += '<div class="dataPoint__infotext"><i>Ta sem chuva!</i></div>';
    }

    // Informação de vento
    // Retorna resultados baseados em ser maior ou menor que dados hardcoded
    let wind = document.getElementById("dataPoint__wind");
    let winddata = weatherInfo.daily.windspeed_10m_max[event.currentTarget.dataset.idx];
    wind.innerHTML = '<div class="dataPoint__infotext"><b>🌬️ ' + winddata + 'km/h</b></div>';
    if (winddata > 70) {
      wind.innerHTML += '<div class="dataPoint__infotext"><b>💀Perigo!💀</b></div>';
    } else if (winddata > 40) {
      wind.innerHTML += '<div class="dataPoint__infotext">Ta <b>ventando forte</b>!</div>';
    } else if (winddata > 25) {
      wind.innerHTML += '<div class="dataPoint__infotext">Ta um <b>vento</b> bom!</div>';
    } else if (winddata > 10) {
      wind.innerHTML += '<div class="dataPoint__infotext">Rola <i>vento bom pra surf</i>!</div>';
    } else if (winddata > 3) {
      wind.innerHTML += '<div class="dataPoint__infotext">Ta um <i>ventinho</i>!</div>';
    } else {
      if (apaTemp > 22) {
        wind.innerHTML += '<div class="dataPoint__infotext"><b>Ta calor e ta sem vento ainda! 💀</b>!</div>';
      } else {
        wind.innerHTML += '<div class="dataPoint__infotext"><i>Vento bem fraco hoje!</i></div>';
      }
    }

    // Informação de nascer do sol
    // Considera que você está na cidade que está sendo consultada
    // Para isso utiliza DateTime do luxon para tratar o dado ISO da API
    Settings.defaultZoneName = weatherInfo.timezone;
    let sunrise = document.getElementById("dataPoint__sunrise");
    let sunrisetime = weatherInfo.daily.sunrise[event.currentTarget.dataset.idx];
    let remoteTime = DateTime.fromISO(sunrisetime);
    let localTime = DateTime.now().setZone(weatherInfo.timezone);
    // Pega a diferença do horario da cidade e do horario do nascer do sol em minutos
    let timeToSunrise = ((remoteTime.toMillis() - localTime.toMillis())/1000)/60;
    if (timeToSunrise > 0){
      sunrise.innerHTML = '<div class="dataPoint__infotext"><b>🌄 em ' + parseFloat(timeToSunrise).toFixed(0) + ' minutos.</b></div>';
    } else {
      sunrise.innerHTML = '<div class="dataPoint__infotext"><b>🌄 aconteceu ' + parseFloat(Math.abs(timeToSunrise)).toFixed(0) + ' minutos atrás.</b></div>';
    }
    if (timeToSunrise > 300) {
      sunrise.innerHTML += '<div class="dataPoint__infotext">Ta longe do sol nascer!</div>';
    } else if (timeToSunrise > 60) {
      sunrise.innerHTML += '<div class="dataPoint__infotext">Vai demorar <i>um pouco</i> pro sol nascer!</div>';
    } else if (timeToSunrise > 30) {
      sunrise.innerHTML += '<div class="dataPoint__infotext">Ta <b>quase na hora</b> do sol nascer!</div>';
    } else if (timeToSunrise > 10) {
      sunrise.innerHTML += '<div class="dataPoint__infotext">Ta <b>chegando a hora do sol nascer</b>!</div>';
    } else if (timeToSunrise <= 10 && timeToSunrise >= -10) {
      sunrise.innerHTML += '<div class="dataPoint__infotext"><b>Sol ta nascendo!</b></div>';
    } else {
      sunrise.innerHTML += '<div class="dataPoint__infotext"><i>Sol já nasceu!</i></div>';
    }

    // Informação de por do sol
    // Considera que você está na cidade que está sendo consultada
    // Para isso utiliza DateTime do luxon para tratar o dado ISO da API
    let sunset = document.getElementById("dataPoint__sunset");
    let sunsettime = weatherInfo.daily.sunset[event.currentTarget.dataset.idx];
    remoteTime = DateTime.fromISO(sunsettime);
    localTime = DateTime.now().setZone(weatherInfo.timezone);
    // Pega a diferença do horario da cidade e do horario do por do sol em minutos
    let timeToSunset = ((remoteTime.toMillis() - localTime.toMillis())/1000)/60;
    if (timeToSunset > 0){
      sunset.innerHTML = '<div class="dataPoint__infotext"><b>🌇 em ' + parseFloat(timeToSunset).toFixed(0) + ' minutos.</b></div>';
    } else {
      sunset.innerHTML = '<div class="dataPoint__infotext"><b>🌇 aconteceu ' + parseFloat(Math.abs(timeToSunset)).toFixed(0) + ' minutos atrás.</b></div>';
    }
    if (timeToSunset > 300) {
      sunset.innerHTML += '<div class="dataPoint__infotext">Ta longe do sol se por!</div>';
    } else if (timeToSunset > 60) {
      sunset.innerHTML += '<div class="dataPoint__infotext">Vai demorar <i>um pouco</i> pro sol se por!</div>';
    } else if (timeToSunset > 30) {
      sunset.innerHTML += '<div class="dataPoint__infotext">Ta <b>quase na hora</b> do sol se por!</div>';
    } else if (timeToSunset > 10) {
      sunset.innerHTML += '<div class="dataPoint__infotext">Ta <b>chegando a hora do sol se por</b>!</div>';
    } else if (timeToSunset <= 10 && timeToSunset >= -10) {
      sunset.innerHTML += '<div class="dataPoint__infotext"><b>Sol ta se pondo!</b></div>';
    } else {
      sunset.innerHTML += '<div class="dataPoint__infotext"><i>Sol já se pos!</i></div>';
    }

    // Informação da temperatura de toda semana
    let graph = document.getElementById("graphPoint__temp");

    // Regressão linear com os dados (y) e um vetor [0, 1, 2, ...] (x)
    let yArray = weatherInfo.hourly.temperature_2m;
    let xArray = new Array(168).fill().map((_, i) => (i+1) - 1);
    let regressionResult = linearRegression(weatherInfo.hourly.temperature_2m, xArray);
    // Define valor inicial e final para criar a linha no gráfico
    // y = intercept + slope * x
    let zeroRegression = regressionResult.intercept;
    let maxRegression = regressionResult.intercept + regressionResult.slope * 167;

    // Troca mensagem caso a linha for crescente ou decrescente
    if (regressionResult.slope > 0){
      graph.innerHTML = '<div id="graphPoint__temp-info">A temperatura está <b>aumentando</b>! <s> <a href="https://climate.nasa.gov/evidence/"> Daqui a um ano estará em: ' + parseFloat(weatherInfo.hourly.temperature_2m[0] + regressionResult.slope * 8760).toFixed(2) + '°C!</a></s></div><div id="container"></div>';
    } else {
      graph.innerHTML = '<div id="graphPoint__temp-info">A temperatura está <b>diminuindo</b>! <s> <a href="https://climate.nasa.gov/evidence/"> Daqui a um ano estará em: ' + parseFloat(weatherInfo.hourly.temperature_2m[0] + regressionResult.slope * 8760).toFixed(2) + '°C!</a></s></div><div id="container"></div>';
    }

    // Transforma o dado de data de ISO8601 para algo mais legivel para a legenda
    // [[date time, value], [date time, value], ...]
    let convertedTime = weatherInfo.hourly.time.map(
      (time) => {
        return DateTime.fromISO(time).toLocaleString({ day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'}, { locale: 'pt-BR'});
      }
    );
    let timeTempData = _.zip(convertedTime, weatherInfo.hourly.temperature_2m);
    let prepTempData = _.zip(convertedTime, weatherInfo.hourly.precipitation);

    // Cria o gráfico utilizando highcharts
    Highcharts.chart('container', {

        chart: {
            backgroundColor: '#11252f',
            style: {
              color: '#ffffff'
            }
        },

        title: {
            text: 'Dados da semana:',
            style: {
                color: '#fddd33',
                fontSize: '24px',
                fontWeight: 'bold',
                fontFamily: 'Calibri'
            }
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
            enabled: true,
            itemStyle: {
              color: '#ffffff'
            },
            style: {
              color: '#ffffff'
            }
        },

        plotOptions: {
            series: {
                showInLegend: true
            }
        },

        xAxis: {
          crosshair: false,
          tickLength:0,
          title: {
            style: {
              color: '#ffffff'
            }
          },
          labels: {
            enabled: false,
            style: {
              color: '#ffffff'
            }
          },
          style: {
            color: '#ffffff'
          }
        },

        yAxis: [{
            title: {
                text: 'Temperatura (°C)',
                style: {
                  color: '#ffffff'
                }
            },
            opposite: true,
            labels: {
              format: '{value}°C',
              style: {
                color: '#ffffff'
              }
            },
            style: {
              color: '#ffffff'
            }
        }, {
            gridLineWidth: 0,
            title: {
                text: 'Precipitação (mm)',
                style: {
                  color: '#ffffff'
                }
            },
            labels: {
                format: '{value} mm',
                style: {
                  color: '#ffffff'
                }
            },
            style: {
              color: '#ffffff'
            }
        }],

        series: [{
            id: 'tempp',
            name: 'Temperatura (°C)',
            showInNavigator: false,
            color: '#90ed7d',
            lineWidth: 3,
            yAxis: 0,
            zIndex: 2,
            tooltip: {
                valueSuffix: '°C'
            },
            data: timeTempData
        }, {
            id: 'prepp',
            type: 'column',
            yAxis: 1,
            zIndex: 1,
            borderRadiusTopLeft: 5,
            borderRadiusTopRight: 5,
            color: '#7cb5ec',
            borderColor: '#7cb5ec',
            name: 'Precipitação (mm)',
            showInNavigator: false,
            lineWidth: 3,
            tooltip: {
                valueSuffix: 'mm'
            },
            data: prepTempData
        }, {
            type: 'line',
            name: 'Tendência da Temperatura',
            yAxis: 0,
            zIndex: 0,
            linkedTo: 'tempp',
            color: '#B01A8C',
            lineWidth: 2,
            tooltip: {
                valueSuffix: '°C'
            },
            data: [[0, zeroRegression],[167, maxRegression]],
            marker: {
              enabled: false
            }
        }],

        tooltip: {
            shared: true,
            split: false
        }
  });

  });
}

// Código de regressão linear de terceiros
function linearRegression(y,x){
  var lr = {};
  var n = y.length;
  var sum_x = 0;
  var sum_y = 0;
  var sum_xy = 0;
  var sum_xx = 0;
  var sum_yy = 0;

  for (var i = 0; i < y.length; i++) {

      sum_x += x[i];
      sum_y += y[i];
      sum_xy += (x[i]*y[i]);
      sum_xx += (x[i]*x[i]);
      sum_yy += (y[i]*y[i]);
  }

  lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
  lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
  lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

  return lr;
}
