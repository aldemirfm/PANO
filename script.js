// --- Tarih & Saat ---
function updateDateTime() {
  const now = new Date();
  document.getElementById("dateTime").textContent = now.toLocaleString("tr-TR");
}
setInterval(updateDateTime, 1000);
updateDateTime();

// --- Basit Hava Durumu Örneği ---
document.getElementById("temperature").textContent = "22°C";
document.getElementById("weatherDesc").textContent = "Güneşli";
