const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const currentDiv = document.getElementById('current');
const hourlyDiv = document.getElementById('hourly');
const dailyDiv = document.getElementById('daily');

async function getWeather(city="Samarkand"){
  try{
    currentDiv.innerHTML="⏳ Yuklanmoqda...";
    const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`).then(r=>r.json());
    if(!geo.results){currentDiv.innerHTML="Shahar topilmadi";return}
    const {latitude,longitude,name,country}=geo.results[0];
    const weather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,weather_code&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`).then(r=>r.json());
    
    const code = weather.current.weather_code;
    const icons = {0:"☀️",1:"🌤️",2:"⛅",3:"☁️",45:"🌫️",51:"🌦️",61:"🌧️",71:"❄️",95:"⛈️"};
    const icon = icons[code]||"☀️";
    
    currentDiv.innerHTML=`<div class="temp">${icon} ${Math.round(weather.current.temperature_2m)}°</div><div class="city">${name}, ${country}</div><div>Shamol: ${weather.current.wind_speed_10m} km/h</div>`;
    
    hourlyDiv.innerHTML="";
    for(let i=0;i<12;i++){
      const days = ["Yak","Dush","Sesh","Chor","Pay","Jum","Shan"];
      const date = days[new Date(weather.daily.time[i]).getDay()];
      const t = Math.round(weather.hourly.temperature_2m[i]);
      hourlyDiv.innerHTML+=`<div><div>${time}</div><div>${t}°</div></div>`;
    }
    dailyDiv.innerHTML="";
    for(let i=0;i<7;i++){
      const date = new Date(weather.daily.time[i]).toLocaleDateString('uz-UZ',{weekday:'short'});
      const max = Math.round(weather.daily.temperature_2m_max[i]);
      const min = Math.round(weather.daily.temperature_2m_min[i]);
      dailyDiv.innerHTML+=`<div><span>${date}</span><span>${min}° / ${max}°</span></div>`;
    }
  }catch(e){currentDiv.innerHTML="Xatolik: "+e.message}
}
searchBtn.onclick=()=>getWeather(cityInput.value);
cityInput.onkeydown=(e)=>{if(e.key==="Enter")getWeather(cityInput.value)};
getWeather();
