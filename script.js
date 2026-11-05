const cityInput=document.getElementById("cityInput");
const searchBtn=document.getElementById("searchBtn");
const weatherCard=document.getElementById("weatherCard");

async function getWeather(city){
try{
weatherCard.innerHTML="<p>🔍 Qidirilmoqda...</p>";
const geoRes=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
const geoData=await geoRes.json();
if(!geoData.results) throw new Error("Shahar topilmadi");
const {latitude,longitude,name,country}=geoData.results[0];
const weatherRes=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
const weatherData=await weatherRes.json();
const current=weatherData.current_weather;
const temp=Math.round(current.temperature);
let emoji="☀️";
if(current.weathercode>2) emoji="☁️";
if(current.weathercode>50) emoji="🌧️";
if(current.weathercode>70) emoji="❄️";
weatherCard.innerHTML=`<h2>${name}, ${country}</h2><div style="font-size:50px;margin:10px 0;">${emoji}</div><div class="temp">${temp}°C</div><p>Shamol: ${current.windspeed} km/soat</p><p style="margin-top:10px;color:#6c5ce7;font-weight:bold;">✅ 100% Ishlamoqda!</p>`;
}catch(e){
weatherCard.innerHTML=`<p>❌ ${e.message}<br>Inglizchada yoz: Samarkand, Tashkent, Seoul</p>`;
}
}
searchBtn.addEventListener("click",()=>{const c=cityInput.value.trim();if(c) getWeather(c);});
cityInput.addEventListener("keypress",(e)=>{if(e.key==="Enter"){const c=cityInput.value.trim();if(c) getWeather(c);}});
getWeather("Samarkand");
