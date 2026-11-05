const daysUzb = ["Yak","Dush","Sesh","Chor","Pay","Jum","Shan"];
async function getWeather(){
  try{
    const inputEl = document.getElementById('cityInput');
    const city = (inputEl && inputEl.value ? inputEl.value : "Samarqand").trim() || "Samarqand";
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    const geoData = await res.json();
    if(!geoData.results || !geoData.results.length){alert("Shahar topilmadi");return;}
    const {latitude, longitude, name, country} = geoData.results[0];
    const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
    const data = await wRes.json();
    const mainEl = document.getElementById('mainWeather') || document.getElementById('weather') || document.body;
    if(mainEl){
      mainEl.innerHTML = `<h2 style="text-align:center;font-size:32px">${Math.round(data.current.temperature_2m)}° ${name}</h2><p style="text-align:center">${name}, ${country}</p>`;
    }
    const hourlyEl = document.getElementById('hourly');
    if(hourlyEl){
      let hHtml = "";
      for(let i=0;i<24;i+=3){
        if(!data.hourly.time[i]) continue;
        const t = new Date(data.hourly.time[i]).getHours()+":00";
        hHtml += `<div class="hour"><span>${t}</span><span>${Math.round(data.hourly.temperature_2m[i])}°</span></div>`;
      }
      hourlyEl.innerHTML = hHtml;
    }
    const dailyEl = document.getElementById('daily');
    if(dailyEl){
      let dHtml = "";
      for(let i=0;i<7;i++){
        if(!data.daily.time[i]) continue;
        const d = new Date(data.daily.time[i]);
        if(isNaN(d.getTime())) continue;
        const dayName = daysUzb[d.getDay()];
        dHtml += `<div class="day"><span>${dayName}</span><span>${Math.round(data.daily.temperature_2m_min[i])}° / ${Math.round(data.daily.temperature_2m_max[i])}°</span></div>`;
      }
      dailyEl.innerHTML = dHtml;
    }
  }catch(e){
    console.error(e);
    alert("Xato: "+e.message);
  }
}
document.addEventListener('DOMContentLoaded', getWeather);
const btn = document.querySelector('button');
if(btn) btn.onclick = getWeather;
