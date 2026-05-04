// THEME-AWARE CHART DEFAULTS
(function applyThemeToChartDefaults() {
    const isLight = document.body.classList.contains('light-mode');
    const gridColor = isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.04)';
    const tickColor = isLight ? '#475569' : '#8892b0';
    if (window.Chart) {
        Chart.defaults.color = tickColor;
        Chart.defaults.borderColor = gridColor;
    }
})();
// NAV
const navBtns = document.querySelectorAll('.nav-btn'), sections = document.querySelectorAll('.spa-section');
navBtns.forEach(btn => { btn.addEventListener('click', () => { navBtns.forEach(b => b.classList.remove('active')); sections.forEach(s => s.classList.remove('active')); btn.classList.add('active'); document.getElementById(btn.dataset.target).classList.add('active'); window.scrollTo({ top: document.querySelector('nav').offsetTop - 10, behavior: 'smooth' }); window.dispatchEvent(new Event('resize')); if (btn.dataset.target === 'home') initStatsTab(); }); });
// DRAG SCROLL
const nc = document.querySelector('.nav-container'); let isDrag = false, startX, scrollL;
nc.addEventListener('mousedown', e => { isDrag = true; nc.classList.add('dragging'); startX = e.pageX - nc.offsetLeft; scrollL = nc.scrollLeft; });
nc.addEventListener('mouseleave', () => { isDrag = false; nc.classList.remove('dragging'); });
nc.addEventListener('mouseup', () => { isDrag = false; nc.classList.remove('dragging'); });
nc.addEventListener('mousemove', e => { if (!isDrag) return; e.preventDefault(); nc.scrollLeft = scrollL - (e.pageX - nc.offsetLeft - startX) * 2; });
nc.addEventListener('touchstart', e => { startX = e.touches[0].pageX - nc.offsetLeft; scrollL = nc.scrollLeft; }, { passive: true });
nc.addEventListener('touchmove', e => { nc.scrollLeft = scrollL - (e.touches[0].pageX - nc.offsetLeft - startX); }, { passive: true });

// CHARTS + I18N
const isEnglish = document.documentElement.lang === 'en';
const i18n = {
    ar: {
        charts: {
            popWater: {
                years: ['1947', '1975', '1990', '2005', '2020', '2024', '2026'],
                perCapitaLabel: 'نصيب الفرد (م³)',
                populationLabel: 'السكان (مليون)',
                perCapitaAxis: 'م³/فرد',
                populationAxis: 'مليون نسمة'
            },
            usagePieLabels: ['الزراعة (76.91%)', 'الشرب والبلديات (14.06%)', 'الصناعة (6.21%)', 'أخرى (2.82%)'],
            efficiencyLabels: ['الري بالغمر', 'الري بالرش', 'الري بالتنقيط'],
            efficiencyDataset: 'كفاءة الاستخدام (%)',
            farmLabels: ['الربح (جنيه/فدان)', 'فقد المياه (م³/فدان)'],
            comparisonLabels: ['الأردن', 'السعودية', 'مصر', 'السودان', 'ألمانيا', 'إثيوبيا', 'المعدل العالمي'],
            comparisonDataset: 'م³/فرد/سنة',
            statPerCapitaLabels: ['1960', '1980', '2000', '2010', '2026'],
            statPerCapitaLabel: 'نصيب الفرد م³',
            statPerCapitaPovertyLabel: 'خط الفقر المائي',
            statDemandLabels: ['الزراعة 76.91%', 'الشرب 14.06%', 'الصناعة 6.21%', 'أخرى 2.82%'],
            statSourcesLabels: ['النيل 84.93%', 'مياه جوفية 12.09%', 'أمطار 1.99%', 'تحلية 0.99%']
        },
        wqi: { excellent: 'ممتاز', good: 'جيد', fair: 'مقبول', poor: 'رديء', critical: 'حرج' },
        scarcityStatus: { absolute: '⚠ شح مائي مطلق', poverty: '⚠ تحت خط الفقر المائي', above: '✓ فوق خط الفقر' },
        nodes: ['Node 1 | أسوان', 'Node 2 | الأقصر', 'Node 3 | أسيوط', 'Node 4 | القناطر', 'Node 5 | دمياط', 'Node 6 | رشيد', 'Node 7 | بحيرة المنزلة']
    },
    en: {
        charts: {
            popWater: {
                years: ['1947', '1975', '1990', '2005', '2020', '2024', '2026'],
                perCapitaLabel: 'Per-capita share (m³)',
                populationLabel: 'Population (million)',
                perCapitaAxis: 'm³/person',
                populationAxis: 'Million people'
            },
            usagePieLabels: ['Agriculture (76.91%)', 'Domestic & Municipal (14.06%)', 'Industry (6.21%)', 'Other (2.82%)'],
            efficiencyLabels: ['Flood irrigation', 'Sprinkler irrigation', 'Drip irrigation'],
            efficiencyDataset: 'Efficiency (%)',
            farmLabels: ['Profit (EGP/feddan)', 'Water loss (m³/feddan)'],
            comparisonLabels: ['Jordan', 'Saudi Arabia', 'Egypt', 'Sudan', 'Germany', 'Ethiopia', 'World Average'],
            comparisonDataset: 'm³/person/year',
            statPerCapitaLabels: ['1960', '1980', '2000', '2010', '2026'],
            statPerCapitaLabel: 'Per-capita share (m³)',
            statPerCapitaPovertyLabel: 'Water poverty line',
            statDemandLabels: ['Agriculture 76.91%', 'Drinking 14.06%', 'Industry 6.21%', 'Other 2.82%'],
            statSourcesLabels: ['Nile 84.93%', 'Groundwater 12.09%', 'Rainfall 1.99%', 'Desalination 0.99%']
        },
        wqi: { excellent: 'Excellent', good: 'Good', fair: 'Fair', poor: 'Poor', critical: 'Critical' },
        scarcityStatus: { absolute: '⚠ Absolute water scarcity', poverty: '⚠ Below water poverty line', above: '✓ Above water poverty line' },
        nodes: ['Node 1 | Aswan', 'Node 2 | Luxor', 'Node 3 | Asyut', 'Node 4 | Al-Qanater', 'Node 5 | Talkha', 'Node 6 | Edfina', 'Node 7 | Lake Manzala']
    }
};
const t = isEnglish ? i18n.en : i18n.ar;
const chartRtl = !isEnglish;

Chart.defaults.color = '#8892b0'; Chart.defaults.font.family = 'Cairo';
const ctxPop = document.getElementById('popWaterChart');
if (ctxPop) {
    new Chart(ctxPop, {
        type: 'line',
        data: {
            labels: t.charts.popWater.years,
            datasets: [
                { label: t.charts.popWater.perCapitaLabel, data: [2526, 1600, 1100, 850, 700, 560, 490], borderColor: '#00d2ff', backgroundColor: 'rgba(0,210,255,0.08)', fill: true, tension: 0.4, yAxisID: 'y', borderWidth: 3, pointRadius: 4, pointBackgroundColor: '#00d2ff', pointBorderColor: '#020b14' },
                { label: t.charts.popWater.populationLabel, data: [19, 38, 56, 72, 100, 106, 110], type: 'bar', backgroundColor: 'rgba(239,68,68,0.2)', borderColor: '#ef4444', borderWidth: 1, yAxisID: 'y1', borderRadius: 4 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                y: { position: 'right', title: { display: true, text: t.charts.popWater.perCapitaAxis, color: '#00d2ff' }, grid: { color: 'rgba(255,255,255,0.04)' } },
                y1: { position: 'left', title: { display: true, text: t.charts.popWater.populationAxis, color: '#ef4444' }, grid: { drawOnChartArea: false } },
                x: { reverse: true, grid: { display: false } }
            },
            plugins: { legend: { position: 'top' }, tooltip: { rtl: chartRtl } }
        }
    });
}
const ctxPie = document.getElementById('usagePieChart');
if (ctxPie) {
    new Chart(ctxPie, {
        type: 'doughnut',
        data: { labels: t.charts.usagePieLabels, datasets: [{ data: [76.91, 14.06, 6.21, 2.82], backgroundColor: ['#2ecc71', '#00d2ff', '#f39c12', '#8b5cf6'], borderWidth: 0, hoverOffset: 6 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { color: '#ccd6f6', font: { family: 'Cairo' }, padding: 10 } }, tooltip: { rtl: chartRtl } } }
    });
}
const ctxEff = document.getElementById('efficiencyBarChart');
if (ctxEff) {
    new Chart(ctxEff, {
        type: 'bar',
        data: { labels: t.charts.efficiencyLabels, datasets: [{ label: t.charts.efficiencyDataset, data: [50, 75, 95], backgroundColor: ['rgba(239,68,68,0.65)', 'rgba(243,156,18,0.65)', 'rgba(46,204,113,0.85)'], borderColor: ['#ef4444', '#f39c12', '#2ecc71'], borderWidth: 1, borderRadius: 6 }] },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { max: 100, grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { callback: v => v + '%' } }, x: { grid: { display: false } } }, plugins: { legend: { display: false } } }
    });
}

// SCADA CORE
const nodeNames = t.nodes;
const NB = {
    1: { ph: 7.4, ec: 180, do: 7.2, tur: 8, temp: 21, tds: 144, hm: 12, ecoli: 80, mp: 25, name: nodeNames[0] },
    2: { ph: 7.2, ec: 200, do: 6.8, tur: 12, temp: 22, tds: 160, hm: 15, ecoli: 90, mp: 30, name: nodeNames[1] },
    3: { ph: 7.0, ec: 250, do: 6.2, tur: 18, temp: 24, tds: 200, hm: 20, ecoli: 100, mp: 40, name: nodeNames[2] },
    4: { ph: 6.8, ec: 310, do: 5.8, tur: 25, temp: 25, tds: 248, hm: 28, ecoli: 130, mp: 55, name: nodeNames[3] },
    5: { ph: 6.6, ec: 380, do: 5.2, tur: 32, temp: 26, tds: 304, hm: 35, ecoli: 150, mp: 70, name: nodeNames[4] },
    6: { ph: 6.7, ec: 360, do: 5.4, tur: 28, temp: 25.5, tds: 288, hm: 30, ecoli: 140, mp: 60, name: nodeNames[5] },
    7: { ph: 6.3, ec: 520, do: 4.5, tur: 45, temp: 27, tds: 416, hm: 45, ecoli: 180, mp: 90, name: nodeNames[6] }
};
let NT = {}, NC = {}; for (let i = 1; i <= 7; i++) { NT[i] = { ...NB[i] }; NC[i] = { ...NB[i] }; }
let activeNode = 1, currentScenario = 'normal', simTime = 0, propagationTimeouts = [], alarmCooldown = {};
let currentSeason = 'spring', sensorHealth = 100, isMuted = true, emergencyActive = false;
let audioCtx = null, sirenOsc = null, sirenGain = null, sirenInterval = null;
const logContent = document.getElementById('log-content'), termContainer = document.getElementById('terminal-container');
function addLog(msg, type = 'info') { const t = new Date().toISOString().substring(11, 19); const div = document.createElement('div'); div.className = 'terminal-entry'; const c = { info: '#8892b0', sys: '#64ffda', warn: '#f39c12', error: '#ef4444' }; div.innerHTML = '<span style="color:#475569">[' + t + ']</span> <span style="color:' + (c[type] || c.info) + '">' + msg + '</span>'; logContent.appendChild(div); termContainer.scrollTop = termContainer.scrollHeight; if (logContent.children.length > 30) logContent.removeChild(logContent.firstChild); }
const maxPts = 40;
const simChart = new Chart(document.getElementById('simComboChart'), { type: 'line', data: { labels: Array(maxPts).fill(''), datasets: [{ label: 'pH', data: Array(maxPts).fill(NC[1].ph), borderColor: '#64ffda', borderWidth: 2, tension: 0.4, pointRadius: 0, yAxisID: 'y' }, { label: 'DO', data: Array(maxPts).fill(NC[1].do), borderColor: '#00d2ff', borderWidth: 2, tension: 0.4, pointRadius: 0, yAxisID: 'y1' }, { label: 'Turb/10', data: Array(maxPts).fill(NC[1].tur / 10), borderColor: '#f39c12', borderWidth: 1.5, tension: 0.4, pointRadius: 0, yAxisID: 'y1', borderDash: [4, 2] }] }, options: { responsive: true, maintainAspectRatio: false, animation: { duration: 0 }, plugins: { legend: { position: 'top', labels: { boxWidth: 12, font: { size: 10 } } }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { min: 0, max: 14, position: 'right', grid: { color: 'rgba(100,255,218,0.04)' }, ticks: { font: { size: 9 }, stepSize: 2 } }, y1: { min: 0, max: 14, position: 'left', grid: { drawOnChartArea: false }, ticks: { font: { size: 9 }, stepSize: 2 } } } } });
function calcWQI(ph, doV, tur, ec) { const phQ = (ph >= 6.5 && ph <= 8.5) ? 100 : (ph >= 5.5 && ph < 6.5 || ph > 8.5 && ph <= 9.5) ? 55 : 20; const doQ = Math.min(100, Math.max(0, (doV / 9) * 100)); const turQ = Math.min(100, Math.max(0, 100 - tur * 1.5)); const ecQ = Math.min(100, Math.max(0, 100 - ec / 12)); return Math.round(phQ * 0.28 + doQ * 0.32 + turQ * 0.22 + ecQ * 0.18); }
function wqiColor(w) { if (w >= 80) return { stroke: '#64ffda', label: t.wqi.excellent, cls: 'alert-green' }; if (w >= 60) return { stroke: '#00d2ff', label: t.wqi.good, cls: 'alert-green' }; if (w >= 40) return { stroke: '#f39c12', label: t.wqi.fair, cls: 'alert-yellow' }; if (w >= 20) return { stroke: '#ef4444', label: t.wqi.poor, cls: 'alert-red' }; return { stroke: '#ff0000', label: t.wqi.critical, cls: 'alert-red blink-critical' }; }
function setCardState(id, val, lo, hi, isLow) { const card = document.getElementById('card-' + id); const el = document.getElementById('val-' + id); if (!card || !el) return; card.className = card.className.replace(/sensor-card-(alert|warn)/g, '').trim(); el.className = 'text-xl digital-font '; if ((isLow && val < lo) || (!isLow && val > hi)) { card.classList.add('sensor-card-alert'); el.className += 'alert-red blink-critical'; } else if ((isLow && val < lo * 1.1) || (!isLow && val > hi * 0.85)) { card.classList.add('sensor-card-warn'); el.className += 'alert-yellow'; } else { el.className += 'alert-green'; } }
function startSiren() { if (isMuted || audioCtx) return; audioCtx = new (window.AudioContext || window.webkitAudioContext)(); sirenOsc = audioCtx.createOscillator(); sirenGain = audioCtx.createGain(); sirenOsc.type = 'square'; sirenOsc.frequency.value = 400; sirenGain.gain.value = 0.15; sirenOsc.connect(sirenGain); sirenGain.connect(audioCtx.destination); sirenOsc.start(); let up = true; sirenInterval = setInterval(() => { sirenOsc.frequency.value = up ? 1000 : 400; up = !up; }, 150); }
function stopSiren() { if (sirenInterval) clearInterval(sirenInterval); if (sirenOsc) try { sirenOsc.stop(); } catch (e) { } audioCtx = null; sirenOsc = null; sirenGain = null; sirenInterval = null; }
window.toggleMute = function () { isMuted = !isMuted; document.getElementById('mute-icon').className = isMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high'; if (isMuted) stopSiren(); };
function checkAlarms(c) { const badge = document.getElementById('sys-status-badge'); const eb = document.getElementById('emergency-btn'); let st = 'NORMAL'; const wqi = calcWQI(c.ph, c.do, c.tur, c.ec); if (wqi < 30) { st = 'CRITICAL'; badge.className = 'text-xs px-3 py-1 rounded font-bold border border-red-500/50 bg-red-500/20 text-red-400 animate-pulse'; if (!isMuted && !audioCtx) startSiren(); eb.classList.remove('hidden'); eb.classList.add('emergency-pulse'); } else if (wqi < 60) { st = 'WARNING'; badge.className = 'text-xs px-3 py-1 rounded font-bold border border-yellow-500/50 bg-yellow-500/20 text-yellow-400'; stopSiren(); eb.classList.add('hidden'); } else { badge.className = 'text-xs px-3 py-1 rounded font-bold border border-green-500/30 bg-green-500/10 text-green-400'; stopSiren(); eb.classList.add('hidden'); } badge.innerText = st; }
function updateNodeMapColors() { for (let n = 1; n <= 7; n++) { const nd = document.getElementById('mnode-' + n); if (!nd) continue; const s = NC[n]; nd.classList.remove('node-warn', 'node-crit', 'node-plastic', 'active-node'); const w = calcWQI(s.ph, s.do, s.tur, s.ec); if (s.mp > 200) nd.classList.add('node-plastic'); else if (w < 40) nd.classList.add('node-crit'); else if (w < 65) nd.classList.add('node-warn'); if (n === activeNode) nd.classList.add('active-node'); } }
const seasonMod = { winter: { temp: -3, do: 1.1 }, spring: { temp: 0, do: 1 }, summer: { temp: 4, do: 0.85 }, autumn: { temp: 1, do: 0.95 } };
window.setSeason = function (s) { currentSeason = s; document.querySelectorAll('[id^=btn-]').forEach(b => b.style.opacity = '0.5'); const b = document.getElementById('btn-' + s); if (b) b.style.opacity = '1'; addLog('Season: ' + s, 'sys'); for (let i = 1; i <= 7; i++) { const base = { ...NB[i] }; base.temp += seasonMod[s].temp; base.do *= seasonMod[s].do; if (currentScenario === 'normal') NT[i] = { ...base, name: NB[i].name }; } };
setInterval(() => { if (sensorHealth > 0) sensorHealth -= 0.5; sensorHealth = Math.max(0, sensorHealth); document.getElementById('health-val').textContent = Math.round(sensorHealth) + '%'; const hb = document.getElementById('health-bar'); hb.style.width = sensorHealth + '%'; hb.className = 'health-bar-fill ' + (sensorHealth > 60 ? 'bg-nile-cyan' : sensorHealth > 40 ? 'bg-yellow-400' : 'bg-red-500'); }, 10000);
window.deployDrone = function () { sensorHealth = 100; document.getElementById('health-val').textContent = '100%'; document.getElementById('health-bar').style.width = '100%'; addLog('Drone deployed - sensors at 100%', 'sys'); };
window.activateEmergency = function () { emergencyActive = true; addLog('EMERGENCY PROTOCOL ACTIVATED', 'error'); for (let i = 1; i <= 7; i++)NT[i] = { ...NB[i], name: NB[i].name }; currentScenario = 'normal'; setTimeout(() => { emergencyActive = false; addLog('Emergency cleared', 'sys'); }, 5000); };
window.showPopup = function (id, el) { const s = NC[id]; const w = calcWQI(s.ph, s.do, s.tur, s.ec); const wc = wqiColor(w); const p = document.getElementById('node-popup'); p.innerHTML = '<div class="text-xs font-bold text-white mb-1">' + NB[id].name + '</div><div class="flex items-center gap-2 mb-1"><span class="text-lg font-black" style="color:' + wc.stroke + '">' + w + '</span><span class="text-[9px] px-1.5 py-0.5 rounded" style="background:' + wc.stroke + '20;color:' + wc.stroke + '">' + wc.label + '</span></div><div class="text-[9px] text-gray-400">pH: ' + s.ph.toFixed(2) + ' | DO: ' + s.do.toFixed(1) + '</div>'; p.style.top = (el.offsetTop - 80) + 'px'; p.style.left = (el.offsetLeft - 60) + 'px'; p.classList.add('visible'); };
window.hidePopup = function () { document.getElementById('node-popup').classList.remove('visible'); };
setInterval(() => {
    const lr = 0.14, rnd = s => (Math.random() - 0.5) * s; const noiseMult = sensorHealth < 40 ? (3 - sensorHealth / 20) : 1;
    for (let i = 1; i <= 7; i++) { let c = NC[i], t = NT[i]; const k = ['ph', 'ec', 'do', 'tur', 'temp', 'tds', 'hm', 'ecoli', 'mp']; const rs = [0.06, 5, 0.12, 1.2, 0.05, 3, 1, 5, 3]; k.forEach((key, j) => { if (c[key] !== undefined && t[key] !== undefined) c[key] += (t[key] - c[key]) * lr + rnd(rs[j] * noiseMult); }); c.ph = Math.max(0.5, Math.min(13.5, c.ph)); c.do = Math.max(0, Math.min(14, c.do)); c.tur = Math.max(0, Math.min(200, c.tur)); c.ec = Math.max(10, Math.min(2000, c.ec)); c.tds = Math.max(5, Math.min(1500, c.tds)); c.temp = Math.max(5, Math.min(45, c.temp)); c.hm = Math.max(0, Math.min(100, c.hm)); c.ecoli = Math.max(0, Math.min(1000, c.ecoli)); c.mp = Math.max(0, Math.min(500, c.mp)); }
    let c = NC[activeNode]; document.getElementById('val-ph').innerText = c.ph.toFixed(2); document.getElementById('val-do').innerText = c.do.toFixed(1); document.getElementById('val-tur').innerText = c.tur.toFixed(1); document.getElementById('val-ec').innerText = Math.round(c.ec); document.getElementById('val-temp').innerText = c.temp.toFixed(1); document.getElementById('val-tds').innerText = Math.round(c.tds); document.getElementById('val-hm').innerText = Math.round(c.hm); document.getElementById('val-ecoli').innerText = Math.round(c.ecoli); document.getElementById('val-mp').innerText = Math.round(c.mp);
    setCardState('ph', c.ph, 6.5, 8.5, false); setCardState('do', c.do, 4.0, 14, true); setCardState('tur', c.tur, 0, 50, false); setCardState('ec', c.ec, 0, 800, false); setCardState('temp', c.temp, 5, 35, false); setCardState('tds', c.tds, 0, 500, false); setCardState('hm', c.hm, 0, 50, false); setCardState('ecoli', c.ecoli, 0, 200, false); setCardState('mp', c.mp, 0, 100, false);
    const wqi = calcWQI(c.ph, c.do, c.tur, c.ec); const wc = wqiColor(wqi); document.getElementById('val-wqi').innerText = wqi; document.getElementById('val-wqi').className = 'text-3xl font-black digital-font ' + wc.cls; document.getElementById('wqi-label').innerText = wc.label; document.getElementById('wqi-label').style.color = wc.stroke; const ci = document.getElementById('wqi-circle'); ci.setAttribute('stroke', wc.stroke); ci.setAttribute('stroke-dasharray', wqi + ' 100');
    simChart.data.datasets[0].data.push(c.ph); simChart.data.datasets[0].data.shift(); simChart.data.datasets[1].data.push(c.do); simChart.data.datasets[1].data.shift(); simChart.data.datasets[2].data.push(c.tur / 10); simChart.data.datasets[2].data.shift(); simChart.update();
    checkAlarms(c); updateNodeMapColors(); simTime++;
}, 1000);
function applyPollution(nid, type, prop) {
    const b = NB[nid]; if (type === 'industrial') { NT[nid] = { ...NT[nid], ph: b.ph - 3.5, ec: b.ec * 4.5, do: b.do - 5.5, tur: b.tur * 10, temp: b.temp + 3, tds: b.tds * 5, hm: 95 }; if (!prop) addLog('[Node' + nid + '] Industrial discharge!', 'error'); }
    else if (type === 'agricultural') { NT[nid] = { ...NT[nid], ph: b.ph + 1.7, ec: b.ec * 2.1, do: b.do - 2.8, tur: b.tur * 5, temp: b.temp + 1, tds: b.tds * 2 }; if (!prop) addLog('[Node' + nid + '] Agricultural runoff!', 'warn'); }
    else if (type === 'municipal') { NT[nid] = { ...NT[nid], ecoli: 800, do: b.do - 3, tur: b.tur * 3 }; if (!prop) addLog('[Node' + nid + '] Municipal - E.coli spike!', 'warn'); }
    else if (type === 'plastic') { NT[nid] = { ...NT[nid], mp: 450, tur: b.tur * 2 }; if (!prop) addLog('[Node' + nid + '] Plastic contamination!', 'warn'); }
}
const flowNext = { 1: [2], 2: [3], 3: [4], 4: [5, 6], 5: [7], 6: [], 7: [] };
function propagate(tid, type, sid) { if (currentScenario === 'normal') return; applyPollution(tid, type, true); addLog('Pollution: Node' + sid + ' -> Node' + tid, 'warn'); const tc = document.getElementById('tti-container'); tc.style.display = 'block'; document.getElementById('tti-val').textContent = '~' + (tid * 4) + 'h'; document.getElementById('tti-target').textContent = 'Node ' + tid; const nxt = flowNext[tid] || []; nxt.forEach(n => { propagationTimeouts.push(setTimeout(() => propagate(n, type, tid), 5000)); }); }
window.triggerScenario = function (type) {
    currentScenario = type; propagationTimeouts.forEach(clearTimeout); propagationTimeouts = []; document.getElementById('tti-container').style.display = 'none';
    if (type === 'normal') { for (let i = 1; i <= 7; i++)NT[i] = { ...NB[i] }; alarmCooldown = {}; addLog('Restoring all nodes...', 'sys'); stopSiren(); } else { applyPollution(activeNode, type); const nxt = flowNext[activeNode] || []; nxt.forEach((n, i) => { propagationTimeouts.push(setTimeout(() => propagate(n, type, activeNode), (i + 1) * 5000)); }); }
};
window.selectNode = function (id) { activeNode = id; const b = NB[id]; document.getElementById('active-node-label').innerText = 'Node ' + id; document.getElementById('node-label-chart').innerText = b.name; simChart.data.datasets[0].data = Array(maxPts).fill(NC[id].ph); simChart.data.datasets[1].data = Array(maxPts).fill(NC[id].do); simChart.data.datasets[2].data = Array(maxPts).fill(NC[id].tur / 10); simChart.update(); addLog('Switched to ' + b.name, 'sys'); };
// TOOLS
let farmChartInstance = null;
window.updateFarm = function () { const crop = document.getElementById('farm-crop').value, irr = document.getElementById('farm-irr').value; const data = { sugarcane: { flood: [18000, 12000], sprinkler: [22000, 7000], drip: [28000, 4000] }, wheat: { flood: [8000, 8000], sprinkler: [11000, 5000], drip: [14000, 2500] }, beet: { flood: [12000, 9000], sprinkler: [16000, 5500], drip: [20000, 3000] } }; const d = data[crop][irr]; if (farmChartInstance) farmChartInstance.destroy(); farmChartInstance = new Chart(document.getElementById('farmChart'), { type: 'bar', data: { labels: t.charts.farmLabels, datasets: [{ data: d, backgroundColor: ['rgba(46,204,113,0.7)', 'rgba(239,68,68,0.7)'], borderColor: ['#2ecc71', '#ef4444'], borderWidth: 1, borderRadius: 6 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(255,255,255,0.04)' } }, x: { grid: { display: false } } } } }); };
setTimeout(() => updateFarm(), 500);
window.updateCalc = function () { const f = +document.getElementById('calc-fam').value, s = +document.getElementById('calc-sh').value, l = +document.getElementById('calc-lau').value, g = +document.getElementById('calc-gar').value; document.getElementById('calc-fam-val').textContent = f; document.getElementById('calc-sh-val').textContent = s; document.getElementById('calc-lau-val').textContent = l; document.getElementById('calc-gar-val').textContent = g; const daily = f * (s * 12 + 50) + l * 70 / 7 + g * 18; document.getElementById('calc-daily').textContent = Math.round(daily); };
window.updateScarcity = function () { const p = +document.getElementById('scar-pop').value, s = +document.getElementById('scar-share').value; document.getElementById('scar-pop-val').textContent = p; document.getElementById('scar-share-val').textContent = s; const pc = Math.round(s * 1e9 / (p * 1e6)); document.getElementById('scar-result').textContent = pc; const st = pc < 500 ? t.scarcityStatus.absolute : pc < 1000 ? t.scarcityStatus.poverty : t.scarcityStatus.above; document.getElementById('scar-status').textContent = st; document.getElementById('scar-result').style.color = pc < 500 ? '#ef4444' : pc < 1000 ? '#f39c12' : '#2ecc71'; document.getElementById('scar-status').style.color = pc < 500 ? '#ef4444' : pc < 1000 ? '#f39c12' : '#2ecc71'; };
const compCtx = document.getElementById('comparisonChart');
if (compCtx) { new Chart(compCtx, { type: 'bar', data: { labels: t.charts.comparisonLabels, datasets: [{ label: t.charts.comparisonDataset, data: [60, 75, 490, 1200, 1200, 1500, 5900], backgroundColor: ['#ef4444', '#ef4444', '#f39c12', '#00d2ff', '#00d2ff', '#2ecc71', '#64ffda'], borderRadius: 6, borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(255,255,255,0.04)' } }, y: { grid: { display: false } } } } }); }
let statsInit = false;
function initStatsTab() {
    if (statsInit) return; statsInit = true;
    document.querySelectorAll('.countup').forEach(el => { const target = parseFloat(el.dataset.target), suffix = el.dataset.suffix || ''; let current = 0; const step = target / 60; const timer = setInterval(() => { current += step; if (current >= target) { current = target; clearInterval(timer); } el.textContent = (target % 1 === 0 ? Math.round(current) : current.toFixed(1)) + suffix; }, 30); });
    setTimeout(() => { const pd = document.getElementById('prog-done'), pw = document.getElementById('prog-wip'), pr = document.getElementById('prog-rem'); if (pd) pd.style.width = '37.5%'; if (pw) pw.style.width = '31%'; if (pr) pr.style.width = '31.5%'; }, 300);
    const pc = document.getElementById('statPerCapita'); if (pc) { new Chart(pc, { type: 'line', data: { labels: t.charts.statPerCapitaLabels, datasets: [{ label: t.charts.statPerCapitaLabel, data: [2000, 1300, 850, 660, 490], borderColor: '#00d2ff', backgroundColor: 'rgba(0,210,255,0.1)', fill: true, tension: 0.4, borderWidth: 3, pointRadius: 5, pointBackgroundColor: '#00d2ff' }, { label: t.charts.statPerCapitaPovertyLabel, data: [1000, 1000, 1000, 1000, 1000], borderColor: '#ef4444', borderDash: [8, 4], borderWidth: 2, pointRadius: 0, fill: false }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { y: { grid: { color: 'rgba(255,255,255,0.04)' } }, x: { grid: { display: false } } } } }); }
    const dd = document.getElementById('statDemand'); if (dd) { new Chart(dd, { type: 'doughnut', data: { labels: t.charts.statDemandLabels, datasets: [{ data: [76.91, 14.06, 6.21, 2.82], backgroundColor: ['#2ecc71', '#00d2ff', '#f39c12', '#8b5cf6'], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { padding: 8, font: { size: 11 } } } } } }); }
    const sd = document.getElementById('statSources'); if (sd) { new Chart(sd, { type: 'doughnut', data: { labels: t.charts.statSourcesLabels, datasets: [{ data: [84.93, 12.09, 1.99, 0.99], backgroundColor: ['#00d2ff', '#64ffda', '#f39c12', '#8b5cf6'], borderWidth: 0 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { padding: 8, font: { size: 11 } } } } } }); }
}
addLog('Connecting to WSN Gateway [LoRaWAN]...', 'sys');
setTimeout(() => addLog('Gateway OK. 7/7 nodes online.', 'sys'), 1500);
setTimeout(() => addLog('DECA EWS v2.0 active.', 'sys'), 2800);

// ===== DECA CONTENT PROTECTION =====
// 1. Disable Right-Click
document.addEventListener('contextmenu', event => event.preventDefault());

// 2. Disable keyboard shortcuts for DevTools & View Source
document.onkeydown = function(e) {
    // Disable F12
    if (e.keyCode === 123) return false;
    // Disable Ctrl+Shift+I
    if (e.ctrlKey && e.shiftKey && e.keyCode === 'I'.charCodeAt(0)) return false;
    // Disable Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && e.keyCode === 'C'.charCodeAt(0)) return false;
    // Disable Ctrl+Shift+J
    if (e.ctrlKey && e.shiftKey && e.keyCode === 'J'.charCodeAt(0)) return false;
    // Disable Ctrl+U (View Source)
    if (e.ctrlKey && e.keyCode === 'U'.charCodeAt(0)) return false;
    // Disable Ctrl+S (Save Page)
    if (e.ctrlKey && e.keyCode === 'S'.charCodeAt(0)) return false;
    // Disable Ctrl+A (Select All)
    if (e.ctrlKey && e.keyCode === 'A'.charCodeAt(0)) return false;
};

// 3. Disable text selection on the whole page
document.addEventListener('selectstart', event => event.preventDefault());

// 4. Disable image drag
document.querySelectorAll('img').forEach(img => {
    img.setAttribute('draggable', 'false');
    img.addEventListener('dragstart', e => e.preventDefault());
});