// جلب مواقيت الصلاة
function loadPrayerTimes() {
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=5`)
      .then(res => res.json())
      .then(data => {
        const timings = data.data.timings;
        const timesContainer = document.getElementById("times");
        timesContainer.innerHTML = "";

        const allowedPrayers = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

        for (let prayer in timings) {
          if (!allowedPrayers.includes(prayer)) continue;
          const div = document.createElement("div");
          div.textContent = `${translatePrayer(prayer)}: ${format12Hour(timings[prayer])}`;
          timesContainer.appendChild(div);

          const prayerTime = convertToDate(timings[prayer]);
          setAlarm(prayerTime, prayer);
        }
      });
  });
}

function convertToDate(timeStr) {
  const now = new Date();
  const [hour, minute] = timeStr.split(":").map(Number);
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
}

function format12Hour(timeStr) {
  let [hour, minute] = timeStr.split(":").map(Number);
  const period = hour >= 12 ? "م" : "ص";
  hour = hour % 12;
  hour = hour === 0 ? 12 : hour;
  return `${hour}:${minute.toString().padStart(2, "0")} ${period}`;
}

function translatePrayer(prayer) {
  const map = {
    Fajr: "الفجر",
    Sunrise: "الشروق",
    Dhuhr: "الظهر",
    Asr: "العصر",
    Maghrib: "المغرب",
    Isha: "العشاء"
  };
  return map[prayer] || prayer;
}

function setAlarm(time, prayerName) {
  const now = new Date();
  const diff = time - now;
  if (diff > 0) {
    setTimeout(() => {
      playAdhan(prayerName);
    }, diff);
  }
}

function playAdhan(prayerName) {
  const fajrAudio = "https://ia600703.us.archive.org/15/items/90---azan---90---azan--many----sound----mp3---alazan/038-1.mp3";
  const regularAudio = "https://ia800703.us.archive.org/15/items/90---azan---90---azan--many----sound----mp3---alazan/019--1.mp3";
  const audioElement = document.getElementById("adhan-audio");
  audioElement.src = prayerName.toLowerCase() === "fajr" ? fajrAudio : regularAudio;
  audioElement.play();
}

loadPrayerTimes();
