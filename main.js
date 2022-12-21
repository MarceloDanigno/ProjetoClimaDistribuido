import './style.css'

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
    `&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,rain_sum,precipitation_hours&timezone=` + event.currentTarget.dataset.time;

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

        // Cria dados semanais
        weeklyinfo.innerHTML = `
        <div class="dayTarget" data-json=` + JSON.stringify(weatherData) + `> <div class="dayTarget__data">`
        + convertDate(weatherData.daily.time[0]) + `</div><div class="dayTarget__data">🌡 ` + parseFloat((weatherData.daily.apparent_temperature_max[0] + weatherData.daily.apparent_temperature_min[0])/2).toFixed(2) +`°C
        </div></div>
        <div class="dayTarget" data-json=` + JSON.stringify(weatherData) + `> <div class="dayTarget__data">`
        + convertDate(weatherData.daily.time[1]) + `</div><div class="dayTarget__data">🌡 ` + parseFloat((weatherData.daily.apparent_temperature_max[1] + weatherData.daily.apparent_temperature_min[1])/2).toFixed(2) +`°C
        </div></div>
        <div class="dayTarget" data-json=` + JSON.stringify(weatherData) + `> <div class="dayTarget__data">`
        + convertDate(weatherData.daily.time[2]) + `</div><div class="dayTarget__data">🌡 ` + parseFloat((weatherData.daily.apparent_temperature_max[2] + weatherData.daily.apparent_temperature_min[2])/2).toFixed(2) +`°C
        </div></div>
        <div class="dayTarget" data-json=` + JSON.stringify(weatherData) + `> <div class="dayTarget__data">`
        + convertDate(weatherData.daily.time[3]) + `</div><div class="dayTarget__data">🌡 ` + parseFloat((weatherData.daily.apparent_temperature_max[3] + weatherData.daily.apparent_temperature_min[3])/2).toFixed(2) +`°C
        </div></div>
        <div class="dayTarget" data-json=` + JSON.stringify(weatherData) + `> <div class="dayTarget__data">`
        + convertDate(weatherData.daily.time[4]) + `</div><div class="dayTarget__data">🌡 ` + parseFloat((weatherData.daily.apparent_temperature_max[4] + weatherData.daily.apparent_temperature_min[4])/2).toFixed(2) +`°C
        </div></div>
        <div class="dayTarget" data-json=` + JSON.stringify(weatherData) + `> <div class="dayTarget__data">`
        + convertDate(weatherData.daily.time[5]) + `</div><div class="dayTarget__data">🌡 ` + parseFloat((weatherData.daily.apparent_temperature_max[5] + weatherData.daily.apparent_temperature_min[5])/2).toFixed(2) +`°C
        </div></div>
        <div class="dayTarget" data-json=` + JSON.stringify(weatherData) + `> <div class="dayTarget__data">`
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

    // Pega json do data-json e usa para criar o que quizer (o que ficar legal para o trabalho)
    let weatherInfo = JSON.parse(event.currentTarget.dataset.json);

    // Aqui só mostrei a resposta como toda
    let dailyinfo = document.getElementById("dailyinfo");
    dailyinfo.innerHTML = event.currentTarget.dataset.json;
  });
}
