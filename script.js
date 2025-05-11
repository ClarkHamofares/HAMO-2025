function showSection(id) {
  document.querySelectorAll('.main-content').forEach(el => el.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

function incrementSebha() {
  let count = parseInt(document.getElementById('count').innerText);
  document.getElementById('count').innerText = count + 1;
}

function resetSebha() {
  document.getElementById('count').innerText = '0';
}

const prayerTimes = [
  { name: 'الفجر', time: '4:29', audio: 'https://ia600703.us.archive.org/15/items/90---azan---90---azan--many----sound----mp3---alazan/038-1.mp3' },
  { name: 'الشروق', time: '6:09', audio: null },
  { name: 'الظهر', time: '12:57', audio: 'https://ia800703.us.archive.org/15/items/90---azan---90---azan--many----sound----mp3---alazan/019--1.mp3' },
  { name: 'العصر', time: '16:36', audio: 'https://ia800703.us.archive.org/15/items/90---azan---90---azan--many----sound----mp3---alazan/019--1.mp3' },
  { name: 'المغرب', time: '19:46', audio: 'https://ia800703.us.archive.org/15/items/90---azan---90---azan--many----sound----mp3---alazan/019--1.mp3' },
  { name: 'العشاء', time: '21:14', audio: 'https://ia800703.us.archive.org/15/items/90---azan---90---azan--many----sound----mp3---alazan/019--1.mp3' }
];

function updatePrayerHighlight() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  let nextIndex = -1;
  let minDiff = 1440; // 24*60

  prayerTimes.forEach((prayer, index) => {
    const [h, m] = prayer.time.split(':').map(Number);
    const diff = ((h * 60 + m) - (hours * 60 + minutes) + 1440) % 1440;
    if (diff < minDiff && diff > 0) {
      minDiff = diff;
      nextIndex = index;
    }
  });

  document.querySelectorAll('#prayer-times li').forEach(li => li.classList.remove('next'));
  if (nextIndex !== -1) {
    const prayer = prayerTimes[nextIndex];
    document.getElementById('next-prayer-name').innerText = 'الصلاة القادمة: ' + prayer.name;
    document.querySelectorAll('#prayer-times li')[nextIndex].classList.add('next');
  }
}

function checkForAdhan() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  prayerTimes.forEach(prayer => {
    if (prayer.audio && prayer.time === currentTime) {
      const audio = document.getElementById('adhan-audio');
      audio.src = prayer.audio;
      audio.play();
    }
  });
}

setInterval(updatePrayerHighlight, 60000);
setInterval(checkForAdhan, 60000);
window.onload = () => {
  showSection('home');
  updatePrayerHighlight();
};
