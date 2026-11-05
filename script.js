const daysUzb = ["Yak","Dush","Sesh","Chor","Pay","Jum","Shan"];
async function getWeather(){
  const city = document.getElementById('cityInput').value || "Samarqand";
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
  const geoData = await res.json();
  if(!geoData.results){alert("Shahar topilmadi");return;}
  const {latitude, longitude, name, country} = geoData.results[0];
  const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
  const data = await wRes.json();
  document.getElementById('mainWeather').innerHTML = `
    <h2>${Math.round(data.current.temperature_2m)}° ${name}</h2>
    <p>${name}, ${country}</p>
    <p>Bugun: ${Math.round(data.daily.temperature_2m_min[0])}° / ${Math.round(data.daily.temperature_2m_max[0])}°</p>
  `;
  let hourlyHtml = "";
  for(let i=0;i<24;i+=3){
    const time = new Date(data.hourly.time[i]).getHours()+":00";
    hourlyHtml += `<div class="hour"><span>${time}</span><span>${Math.round(data.hourly.temperature_2m[i])}°</span></div>`;
  }
  document.getElementById('hourly').innerHTML = hourlyHtml;
  let dailyHtml = "";
  for(let i=0;i<7;i++){
    const dayIndex = new Date(data.daily.time[i]).getDay();
    const dayName = daysUzb[dayIndex];
    dailyHtml += `<div class="day"><span>${dayName}</span><span>${Math.round(data.daily.temperature_2m_min[i])}° / ${Math.round(data.daily.temperature_2m_max[i])}°</span></div>`;
  }
  document.getElementById('daily').innerHTML = dailyHtml;
}
getWeather();
