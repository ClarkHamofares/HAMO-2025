const prayers = {
  "الفجر": "04:29 ص",
  "الشروق": "06:09 ص",
  "الظهر": "12:57 م",
  "العصر": "04:36 م",
  "المغرب": "07:46 م",
  "العشاء": "09:14 م"
};

function convertTo24Hour(time) {
  let [hour, minute] = time.split(/:| /);
  let period = time.includes("ص") ? "AM" : "PM";
  hour = parseInt(hour);
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, '0')}:${minute}`;
}

function updatePrayerTimes() {
  const container = document.getElementById("prayer-times");
  container.innerHTML = "";

  const now = new Date();
  const nowTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
  let nextPrayerName = null;
  let nextPrayerTime = null;

  for (let [name, time] of Object.entries(prayers)) {
    const time24 = convertTo24Hour(time);
    if (!nextPrayerTime && time24 > nowTime) {
      nextPrayerName = name;
      nextPrayerTime = time24;
    }

    const div = document.createElement("div");
    div.textContent = `${name}: ${time}`;
    if (name === nextPrayerName) div.classList.add("highlight");
    container.appendChild(div);
  }

  // If no future prayer today, set next prayer to first one tomorrow
  if (!nextPrayerTime) {
    const firstPrayer = Object.entries(prayers)[0];
    nextPrayerName = firstPrayer[0];
    nextPrayerTime = convertTo24Hour(firstPrayer[1]);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [h, m] = nextPrayerTime.split(":").map(Number);
    tomorrow.setHours(h, m, 0);
    startCountdown(tomorrow);
  } else {
    const [h, m] = nextPrayerTime.split(":").map(Number);
    const next = new Date();
    next.setHours(h, m, 0);
    startCountdown(next);
  }
}

function startCountdown(target) {
  const countdown = document.getElementById("countdown");
  clearInterval(window.countdownInterval);
  window.countdownInterval = setInterval(() => {
    const now = new Date();
    if (target < now) {
      updatePrayerTimes(); // Restart countdown
      return;
    }
    const diff = target - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    countdown.textContent = `متبقي: ${hours}س ${minutes}د ${seconds}ث`;
  }, 1000);
}

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

let count = 0;
function incrementTasbeeh() {
  count++;
  document.getElementById("tasbeeh-count").textContent = count;
}
function resetTasbeeh() {
  count = 0;
  document.getElementById("tasbeeh-count").textContent = count;
}

// البوصلة (اتجاه القبلة)
if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", function(event) {
    const compass = document.getElementById("compass");
    if (!compass) return;
    const ctx = compass.getContext("2d");
    ctx.clearRect(0, 0, compass.width, compass.height);
    const angle = event.alpha || 0;
    ctx.save();
    ctx.translate(100, 100);
    ctx.rotate((-angle * Math.PI) / 180);
    ctx.beginPath();
    ctx.moveTo(0, -50);
    ctx.lineTo(10, 0);
    ctx.lineTo(-10, 0);
    ctx.closePath();
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.restore();
  });
}

updatePrayerTimes(); // Start updating prayer times
