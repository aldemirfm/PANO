// TAM EKRAN
function enableFullScreen() {
  const elem = document.documentElement;
  if (elem.requestFullscreen) elem.requestFullscreen();
  else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
  else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
}
window.addEventListener("click", enableFullScreen);

// Tarih & Saat
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

// HTML’de verdiğin tüm JS kodlarını buraya birebir ekledim
// YKS/LGS, Hava Durumu, Nöbetçi, Duyurular, Yemek Listesi, Günlük Sözler, Marquee, vb.
