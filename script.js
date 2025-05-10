function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  const btns = document.querySelectorAll('.nav-btn');
  btns.forEach(btn => {
    if (btn.getAttribute('onclick').includes(id)) {
      btn.classList.add('active');
    }
  });
}

function loadPrayerTimes() {
  const times = {
    "الفجر": "04:29 AM",
    "الشروق": "06:09 AM",
    "الظهر": "12:57 PM",
    "العصر": "04:36 PM",
    "المغرب": "07:46 PM",
    "العشاء": "09:14 PM"
  };

  const now = new Date();
  const prayerList = document.getElementById("prayer-list");
  const nextPrayerEl = document.getElementById("next-prayer");
  let foundNext = false;
  let nextPrayerTime;

  prayerList.innerHTML = "";
  for (let [name, time] of Object.entries(times)) {
    let [rawTime, ampm] = time.split(' ');
    let [h, m] = rawTime.split(':').map(Number);
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    const prayerDate = new Date();
    prayerDate.setHours(h, m, 0, 0);

    const isNext = !foundNext && prayerDate > now;
    if (isNext) {
      foundNext = true;
      nextPrayerTime = prayerDate;
      nextPrayerEl.innerHTML = `الصلاة القادمة: <span>${name} - ${time}</span>`;
    }

    prayerList.innerHTML += `
      <div class='prayer-item ${isNext ? "highlight" : ""}'>
        <div>${name}</div>
        <div>${time}</div>
      </div>`;
  }

  if (nextPrayerTime) countdownTo(nextPrayerTime);
}

function countdownTo(time) {
  const countdownEl = document.getElementById("countdown");
  function update() {
    const now = new Date();
    const diff = time - now;
    if (diff <= 0) {
      countdownEl.textContent = "حان وقت الصلاة!";
      return;
    }
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    countdownEl.textContent = `الوقت المتبقي: ${hours} ساعة ${minutes} دقيقة ${seconds} ثانية`;
    setTimeout(update, 1000);
  }
  update();
}

function incrementCount() {
  let count = parseInt(document.getElementById("count").textContent);
  document.getElementById("count").textContent = count + 1;
}

function resetCount() {
  document.getElementById("count").textContent = 0;
}

window.addEventListener("load", loadPrayerTimes);
