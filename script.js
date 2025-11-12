// TAM EKRAN
function enableFullScreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) elem.requestFullscreen();
  else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
  else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
}
window.addEventListener("click", enableFullScreen);

// ------------------ Tarih & Saat ------------------
function updateDateTime() {
  const now = new Date();
  const days = ["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"];
  const months = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım"];
  
  const dayName = days[now.getDay()];
  const dateNum = now.getDate();
  const monthName = months[now.getMonth()];
  const hours = now.getHours().toString().padStart(2,"0");
  const minutes = now.getMinutes().toString().padStart(2,"0");
  
  document.getElementById("dayMonth").innerText = `${dayName}, ${dateNum} ${monthName}`;
  document.getElementById("time").innerText = `${hours}:${minutes}`;
}
setInterval(updateDateTime, 1000);
updateDateTime();

// ------------------ YKS & LGS ------------------
function countdown(target, numEl, hourEl) {
  const now = new Date();
  const diff = target - now;
  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff / (1000*60*60)) % 24);
  document.getElementById(numEl).innerText = days;
  document.getElementById(hourEl).innerText = hours;
}
setInterval(()=>{
  countdown(new Date("2026-06-20"), "yksCountdownNum","yksCountdownHour");
  countdown(new Date("2026-06-01"), "lgsCountdownNum","lgsCountdownHour");
}, 1000);

// ------------------ HAVA DURUMU ------------------
async function loadWeather() {
  const apiKey = "c5155ad22a417a8b1068985b43425bb3";
  const city = "Develi,TR";

  try {
    const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=tr`);
    const currentData = await currentRes.json();
    document.getElementById("temp").innerText = Math.round(currentData.main.temp) + "°C";
    document.getElementById("desc").innerText = currentData.weather[0].description.toUpperCase();
    const iconMap = {
      Clear: "sunny.png",
      Clouds: "cloudy.png",
      Rain: "rainy.png",
      Snow: "snowy.png",
      Drizzle: "drizzle.png",
      Thunderstorm: "thunderstorm.png"
    };

    const weatherMain = currentData.weather[0].main;
    const iconFile = iconMap[weatherMain] || "sunny.png";
    document.getElementById("weatherIcon").src = "icons/weather/" + iconFile;

  } catch {
    document.getElementById("temp").innerText = "--";
    document.getElementById("desc").innerText = "❌ Veri alınamadı";
  }

  try {
    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=tr`);
    const forecastData = await forecastRes.json();
    const daysMap = ["Paz","Pzt","Sal","Çar","Per","Cum","Cts"];
    const dailyForecast = [];
    const addedDates = new Set();

    for (let item of forecastData.list) {
      const date = new Date(item.dt_txt);
      const dateKey = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
      if (!addedDates.has(dateKey)) {
        addedDates.add(dateKey);
        dailyForecast.push({
          dayName: daysMap[date.getDay()],
          temp: Math.round(item.main.temp)
        });
      }
      if (dailyForecast.length >= 3) break;
    }

    const forecastContainer = document.querySelector("#weatherBox .forecast");
    forecastContainer.innerHTML = dailyForecast.map(d => `
      <div class="day">
        <div class="dayName">${d.dayName}</div>
        <div class="temp">${d.temp}°C</div>
      </div>
    `).join("");

  } catch {
    document.querySelector("#weatherBox .forecast").innerHTML = "<div style='color:red'>❌ Veri alınamadı</div>";
  }
}
loadWeather();

function updateWeatherHourly() {
  const now = new Date();
  const delay = (60 - now.getMinutes())*60*1000 - now.getSeconds()*1000;
  setTimeout(() => {
    loadWeather();
    setInterval(loadWeather, 3600000);
  }, delay);
}
updateWeatherHourly();

// ------------------ NÖBETÇİ ÖĞRETMEN ------------------
const sheetURL = "https://docs.google.com/spreadsheets/d/1oF2cT3UkMBW4c2PgVIsncCYfHV1dJeoB_fS68c8pU1c/gviz/tq?tqx=out:json&gid=0";

function loadDutyTeachers() {
  fetch(sheetURL)
    .then(res => res.text())
    .then(text => {
      const json = JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1));
      const rows = json.table.rows;

      const days = [null,"PAZARTESİ","SALI","ÇARŞAMBA","PERŞEMBE","CUMA",null];
      const today = days[new Date().getDay()];

      const headers = rows[0].c.map(h => h?.v?.toString().toUpperCase() || "");
      const colIndex = headers.indexOf(today);
      if(colIndex === -1) {
        document.getElementById("nobetciList").innerHTML = "❌ Bugün yok";
        return;
      }

      let output = "";

      for (let i = 1; i < rows.length; i++) {
        const place = rows[i].c[0]?.v || "";
        const teacherCell = rows[i].c[colIndex]?.v || "";
        if (!place && !teacherCell) continue;

        const teachers = teacherCell.split("\n").filter(t => t.trim() !== "");

        output += `<div class="nobetRow">`;
        if(place) output += `<span class="nobetPlace">${place}:</span> `;
        if(teachers.length) {
          output += `<span class="nobetTeacher">`;
          teachers.forEach(t => {
            output += `${t}<br>`;
          });
          output += `</span>`;
        }
        output += `</div>`;
      }

      document.getElementById("nobetciList").innerHTML = output || "BUGÜN NÖBET YOK";
    })
    .catch(err => {
      console.error(err);
      document.getElementById("nobetciList").innerHTML = "❌ Veri alınamadı";
    });
}

loadDutyTeachers();
setInterval(loadDutyTeachers, 30000);

// ------------------ DUYURULAR ------------------
const announcementSheetURL="https://docs.google.com/spreadsheets/d/114FVDdj4yqfaHVaEHVS5-jQwLEdwVpEBYNF-43354og/gviz/tq?tqx=out:json&gid=0";
let announcements=[],currentIndex=0;
const centerBox=document.getElementById("centerBox");

function loadAnnouncements(){
  fetch(announcementSheetURL).then(res=>res.text()).then(text=>{
    const json=JSON.parse(text.substring(47,text.length-2));
    const rows=json.table.rows;
    announcements=rows.map(r=>r.c[1]?.v||"").filter(x=>x);
    const textSpan = document.getElementById("announcementText");
    if(textSpan) textSpan.innerText = announcements.length > 0 ? announcements[0] : "DUYURU YOK";
  }).catch(()=>centerBox.innerHTML=`<span id="announcementText">❌ Veri alınamadı</span>`);
}
loadAnnouncements();
setInterval(loadAnnouncements,30000);

// ------------------ YEMEK LİSTESİ ------------------
const menuSheetURL="https://docs.google.com/spreadsheets/d/1ps4RgDTOscAE8FVLU0mWl9hJpnK2XEMlHa8C7c7e9pw/gviz/tq?tqx=out:json&gid=0";

function loadMenu(){
    const menuListElement = document.getElementById("menuList");
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); 
    const day = now.getDate().toString().padStart(2, "0");
    const todayDateString = `${day}.${month}.${year}`; 

    fetch(menuSheetURL)
        .then(res => res.text())
        .then(text => {
            const jsonText = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
            const json = JSON.parse(jsonText);
            const rows = json.table.rows;
            
            let output = "Bu güne ait yemek listesi yok.";
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i].c;
                const sheetDateCell = row[0]?.f || row[0]?.v; 
                
                if (!sheetDateCell) continue;
                
                let sheetDateString = null;

                if (typeof sheetDateCell === 'string' && sheetDateCell.startsWith('Date(')) {
                    const parts = sheetDateCell.match(/\d+/g);
                    if (parts && parts.length >= 3) {
                        const sheetYear = parts[0];
                        const sheetMonth = (parseInt(parts[1]) + 1).toString().padStart(2, "0");
                        const sheetDay = parts[2].toString().padStart(2, "0");
                        sheetDateString = `${sheetDay}.${sheetMonth}.${sheetYear}`;
                    }
                } else if (typeof sheetDateCell === 'string') {
                    sheetDateString = sheetDateCell.trim();
                }

                if (sheetDateString === todayDateString) {
                    output = row[1]?.v || "Yemek listesi boş.";
                    break;
                }
            }
            menuListElement.innerHTML = output.split("\n").join("<br>");
        })
        .catch(err => {
            console.error("Yemek Listesi Hatası:", err);
            menuListElement.innerHTML = "❌ Yemek listesi alınamadı";
        });
}

loadMenu();
setInterval(loadMenu, 3600000); 

// ------------------ GÜNLÜK SÖZLER ------------------
const quoteSheetURL = "https://docs.google.com/spreadsheets/d/1p4pq-wpK-oFzufueyKOTmYi_Ic2iVcVTyyhXbfpzBhE/gviz/tq?tqx=out:json&gid=0";

function loadDailyQuote() {
    const solKutuElement = document.getElementById("box1Content");
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); 
    const day = now.getDate().toString().padStart(2, "0");
    const todayDateString = `${day}.${month}.${year}`; 

    fetch(quoteSheetURL)
        .then(res => res.text())
        .then(text => {
            const jsonText = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
            const json = JSON.parse(jsonText);
            const rows = json.table.rows;
            
            let quote = "Bu güne ait ilham verici söz yok.";

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i].c;
                const sheetDateCell = row[0]?.f || row[0]?.v; 
                
                if (!sheetDateCell) continue;
                
                let sheetDateString = null;

                if (typeof sheetDateCell === 'string' && sheetDateCell.startsWith('Date(')) {
                    const parts = sheetDateCell.match(/\d+/g);
                    if (parts && parts.length >= 3) {
                        const sheetYear = parts[0];
                        const sheetMonth = (parseInt(parts[1]) + 1).toString().padStart(2, "0");
                        const sheetDay = parts[2].toString().padStart(2, "0");
                        sheetDateString = `${sheetDay}.${sheetMonth}.${sheetYear}`;
                    }
                } else if (typeof sheetDateCell === 'string') {
                    sheetDateString = sheetDateCell.trim(); 
                }

                if (sheetDateString === todayDateString) {
                    quote = row[1]?.v || "Söz listesi boş.";
                    break;
                }
            }
            
            solKutuElement.innerHTML = quote.split("\n").join("<br>");
        })
        .catch(err => {
            console.error("Günlük Söz Hatası:", err);
            solKutuElement.innerHTML = "❌ Günlük söz alınamadı";
        });
}

loadDailyQuote();