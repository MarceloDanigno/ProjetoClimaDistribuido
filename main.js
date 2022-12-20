import './style.css'

document.addEventListener(
  "DOMContentLoaded",
  function () {
    // Add page change events to nav-bar (requires search bar to be filled)
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

    // Define a cidade como ativa
    let i, tabLinks;
    tabLinks = document.getElementsByClassName("locationTarget");
    for (i = 0; i < tabLinks.length; i++) {
      tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }
    event.currentTarget.className += " active";

    // Faz a chamada para a API
    //ex : fetch https://api.open-meteo.com/v1/forecast?latitude=40.7306&longitude=-73.9352&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,rain_sum,precipitation_hours&timezone=America%2FNew_York
    //utilizando lat lon e timezone do evento atual
    // fetch + then e faz as coisas de baixo:

    // Preenche os dados da semana (limpa oque tem, troca, preenche...) (limpa eventos do dia também)
    // salvar os dados em um json e colocar como data-?
    // adicionar evento de click em cada item que faz aparecer o dia
    let weeklyinfo = document.getElementById("weeklyinfo");

    // Mostra os dados do dia (limpa oque tem, troca, preenche...)
  });
}
