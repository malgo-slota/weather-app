const todayData = document.querySelector('.today');
const locationName = document.querySelector('.location-name');
const locationInput = document.querySelector(".location-input");

const todayTemp = document.querySelector('.temp-today');
const windStatus = document.querySelector('.wind-value');
const windDirectionDeg = document.querySelector('.wind-direction-deg');
const visibilityValue = document.querySelector('.visibility-value');
const humidityValue = document.querySelector('.humidity-value');
const pressureValue = document.querySelector('.pressure-value');
const weatherStatus = document.querySelector('.weather-status');
const iconStatus = document.querySelector('.weather-status-icon');

const openPlacesBtn = document.querySelector('.open-places-btn');
const closeBtn = document.querySelector('.close-btn');
const navigation = document.querySelector('.navigation');

const gpsBtn = document.querySelector('.gps-round-btn');
const searchBtn = document.querySelector('.search-btn');

const otherParameters = document.querySelector('.other-parameters');
const weatherToday = document.querySelector('.weather-today');
const nextDaysContainer = document.querySelector('.next-days-container');

const baseApiUrl = 'http://api.openweathermap.org/data/2.5/';
const key = config.SECRET_API_KEY;
const apiKeyURL = '&appid='+`${key}`;

openPlacesBtn.addEventListener('click', () => {
    navigation.classList.remove("hide-navigation");
});

closeBtn.addEventListener('click', () => {
    navigation.classList.add("hide-navigation");
});

gpsBtn.addEventListener('click',  fetchByGeolocation);

searchBtn.addEventListener('click', fetchByCityName);

locationInput.addEventListener('input', () => console.log("success"));
locationInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {  
      fetchByCityName();
    }
})

//initial state data
fetchByGeolocation();

function displayData(){
    let date = new Date()
    let day = date.getDate();
    let month = date.getMonth();
    let monthName = monthNames[month];

    let week = date.getDay();
    let weekName = weekDays[week];
    let fullDate = `${weekName} ${day} ${monthName}`;
    todayData.innerHTML = 'Today ' + fullDate;
}
displayData();

//fetch GEOLOCATION
function fetchByGeolocation(){
    navigator.geolocation.getCurrentPosition((success) => {
        let {latitude, longitude} = success.coords;
        let url = baseApiUrl + 'onecall?' + 'lat=' + latitude + '&lon=' + longitude + apiKeyURL;
        fetch(url)
        .then(res => {
            return res.json();
        })
        .then(data =>{
            // locationName.innerHTML = data['timezone'];
            showCurrentWeatherData(data);
            showHumidityLevel(data);
            showForecastData(data);
        })
    })
}

//other parameters by GEO
function showCurrentWeatherData (data){
    let {temp, humidity, pressure, visibility, wind_speed, wind_deg} = data.current;
    temp = (temp - 273.15).toFixed(0);
    
    let desc = data['current']['weather'][0]['description'];    
    let {icon} = data['daily'][0]['weather'][0];
    let iconSrc = "http://openweathermap.org/img/wn//" + icon + "@4x.png";
    
    //today
    iconStatus.src = iconSrc;
    todayTemp.innerHTML = temp + ' &deg;C';
    weatherStatus.innerHTML = desc;
    locationName.innerHTML = data['name'];

    //other parameters
    windStatus.innerHTML = wind_speed + 'mph';
    windDirectionDeg.innerHTML = wind_deg;

    humidityValue.innerHTML = humidity + ' %';
    visibilityValue.innerHTML = visibility + ' miles';
    pressureValue.innerHTML = pressure + ' hPa';
}

function showHumidityLevel(data) {
    let {humidity} = data.current;
    let humidityBar = document.querySelector('.humidity-lvl-bar');
    let x = 300 * humidity * 0.01;
    let y = x + 'px'
    humidityBar.style.width = y;
}

//forecast by GEO
function showForecastData(data){
    for( i = 1; i<=5; i++){
        let {day, night} = data['daily'][i]['temp'];
        let {dt} = data['daily'][i];
        let {icon} = data['daily'][i]['weather'][0];
        
         nextDaysContainer.innerHTML +=`
                    <div class="day-container">
                        <h3 class="next-day-data">${moment(dt*1000).format('ddd')}</h3>
                        <img src="http://openweathermap.org/img/wn//${icon}@2x.png" alt="weather icon" class="w-icon">
                        <div class="day-night-wrapper">
                            <div class="temp-day">${(day- 273.15).toFixed(0)}&deg;C</div>
                            <div class="temp-night">${(night- 273.15).toFixed(0)}&deg;C</div>
                        </div>
                    </div>
         `;
    }
}

// fetch by LOCATION NAME 
function fetchByCityName(){
    let cityName = locationInput.value;
    let url = 'http://api.openweathermap.org/data/2.5/weather?q=' + `${cityName}` + apiKeyURL;

    fetch(url)
        .then(res => {
            return res.json();
        })
        .then(dataCN =>{
            displayByCityName(dataCN);
            showHumidityLevelCN(dataCN);
        })
      //if locationInput.value === undefined - display in placeholder "enter location" in red
}

//other parameters by CityName
function displayByCityName(dataCN){
    let icon = dataCN['weather'][0]['icon'];
    let iconSrc = "http://openweathermap.org/img/wn//" + icon + "@4x.png";
    let name = dataCN['name'];
    let desc = dataCN['weather'][0]['description'];
    let temp = ((dataCN['main']['temp'])-273.15).toFixed(0);
            
            //today
            iconStatus.src = iconSrc;
            todayTemp.innerHTML = temp + '&deg;C';
            weatherStatus.innerHTML = desc;
            locationName.innerHTML = name;

            //other parameters
            visibilityValue.innerHTML = dataCN['visibility'] + 'm';
            windStatus.innerHTML = ((dataCN['wind']['speed'])*3.6).toFixed(1) + 'km/h';
            windDirectionDeg.innerHTML = dataCN['wind']['deg'];
            humidityValue.innerHTML = dataCN['main']['humidity'] + '%';
            pressureValue.innerHTML = dataCN['main']['pressure'] + 'hPa';
}

function showHumidityLevelCN(dataCN){
    let humidity = dataCN['main']['humidity'];
    let humidityBar = document.querySelector('.humidity-lvl-bar');
    let x = 300 * humidity * 0.01;
    let y = x + 'px'
    humidityBar.style.width = y;
}






//TODO forecast by city name (convert lon i lat into name)
//wind status icon and direction
//geo btn styling
//width of navigation the same as left container width
//location name by GEO display
//do not let dublind days by clicking in geo (refresh effecr)

//forecast by cityName
function showForecastByCityName(dataCN){
    for( i = 1; i<=5; i++){
        let {temp} = dataCN['daily'][i]['main'];
        let {dt} = dataCN['daily'][i];
        let {icon} = dataCN['daily'][i]['weather'][0];
        console.log(dt);
         nextDaysContainer.innerHTML +=`
                    <div class="day-container">
                        <h3 class="next-day-data">${moment(dt*1000).format('ddd')}</h3>
                        <img src="http://openweathermap.org/img/wn//${icon}@2x.png" alt="weather icon" class="w-icon">
                        <div class="day-night-wrapper">
                            <div class="temp-day">${(temp- 273.15).toFixed(0)}&deg;C</div>
                        </div>
                    </div>
         `;
    }
}