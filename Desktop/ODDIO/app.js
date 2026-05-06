const weeks = ["2026-W13", "2026-W14", "2026-W15", "2026-W16", "2026-W17", "2026-W18"];

const territoryData = [
  { region: "Italia", province: "Tutte", weekly: [54, 57, 61, 58, 64, 66], metrics: { prevalenza: 62, amplificazione: 68, incitamento: 55, polarizzazione: 70 } },
  { region: "Lombardia", province: "Milano", weekly: [60, 62, 69, 65, 71, 73], metrics: { prevalenza: 68, amplificazione: 76, incitamento: 58, polarizzazione: 72 } },
  { region: "Lombardia", province: "Bergamo", weekly: [49, 51, 56, 53, 59, 61], metrics: { prevalenza: 56, amplificazione: 62, incitamento: 49, polarizzazione: 60 } },
  { region: "Lazio", province: "Roma", weekly: [58, 64, 67, 62, 69, 72], metrics: { prevalenza: 66, amplificazione: 74, incitamento: 61, polarizzazione: 69 } },
  { region: "Lazio", province: "Latina", weekly: [45, 49, 52, 50, 56, 58], metrics: { prevalenza: 52, amplificazione: 57, incitamento: 48, polarizzazione: 55 } },
  { region: "Campania", province: "Napoli", weekly: [53, 55, 62, 60, 63, 67], metrics: { prevalenza: 61, amplificazione: 69, incitamento: 57, polarizzazione: 66 } },
  { region: "Campania", province: "Caserta", weekly: [47, 50, 57, 55, 60, 62], metrics: { prevalenza: 58, amplificazione: 63, incitamento: 53, polarizzazione: 60 } },
  { region: "Piemonte", province: "Torino", weekly: [50, 54, 60, 57, 62, 64], metrics: { prevalenza: 59, amplificazione: 64, incitamento: 54, polarizzazione: 63 } },
  { region: "Piemonte", province: "Cuneo", weekly: [39, 41, 47, 44, 50, 52], metrics: { prevalenza: 47, amplificazione: 51, incitamento: 42, polarizzazione: 49 } },
  { region: "Veneto", province: "Venezia", weekly: [48, 52, 55, 54, 58, 60], metrics: { prevalenza: 55, amplificazione: 60, incitamento: 49, polarizzazione: 58 } },
  { region: "Veneto", province: "Verona", weekly: [46, 49, 53, 52, 57, 59], metrics: { prevalenza: 53, amplificazione: 59, incitamento: 50, polarizzazione: 56 } },
  { region: "Sicilia", province: "Palermo", weekly: [44, 46, 51, 50, 55, 57], metrics: { prevalenza: 52, amplificazione: 58, incitamento: 47, polarizzazione: 55 } },
  { region: "Sicilia", province: "Catania", weekly: [43, 45, 49, 48, 52, 54], metrics: { prevalenza: 50, amplificazione: 55, incitamento: 46, polarizzazione: 52 } },
  { region: "Emilia-Romagna", province: "Bologna", weekly: [46, 50, 54, 52, 56, 58], metrics: { prevalenza: 53, amplificazione: 58, incitamento: 48, polarizzazione: 56 } },
  { region: "Emilia-Romagna", province: "Rimini", weekly: [40, 43, 47, 46, 51, 53], metrics: { prevalenza: 48, amplificazione: 52, incitamento: 43, polarizzazione: 50 } }
];

const events = [
  { week: "2026-W13", date: "23-29 mar", scope: "Nazionale", title: "Dibattito su sicurezza urbana e migrazione", note: "Aumento di prevalenza in thread politici e commenti a notizie locali.", impact: "+3" },
  { week: "2026-W14", date: "30 mar-5 apr", scope: "Roma", title: "Manifestazione nazionale e scontri verbali online", note: "Picco di amplificazione su X e pagine pubbliche di news.", impact: "+5" },
  { week: "2026-W15", date: "6-12 apr", scope: "Milano", title: "Caso di cronaca con vittima minorenne straniera", note: "Incremento di incitamento e stereotipi xenofobi nei commenti pubblici.", impact: "+7" },
  { week: "2026-W16", date: "13-19 apr", scope: "Napoli", title: "Derby calcistico e tensioni tra tifoserie", note: "Polarizzazione elevata ma prevalenza in lieve rientro dopo moderazione delle community.", impact: "-3" },
  { week: "2026-W17", date: "20-26 apr", scope: "Torino", title: "Proteste per lavoro e casa", note: "Narrative ostili verso gruppi sociali vulnerabili, soprattutto su video brevi.", impact: "+6" },
  { week: "2026-W18", date: "27 apr-3 mag", scope: "Nazionale", title: "Campagna elettorale locale e anniversari civili", note: "Crescita della polarizzazione con cluster coordinati e contenuti rilanciati da account ad alta reach.", impact: "+2" }
];

const $ = (selector) => document.querySelector(selector);
const regionFilter = $("#region-filter");
const provinceFilter = $("#province-filter");
const weekFilter = $("#week-filter");
let trendChart;
let radarChart;

function unique(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, "it"));
}

function initFilters() {
  const regions = ["Italia", ...unique(territoryData.filter((item) => item.region !== "Italia").map((item) => item.region))];
  regionFilter.innerHTML = regions.map((region) => `<option value="${region}">${region}</option>`).join("");
  weekFilter.innerHTML = weeks.map((week) => `<option value="${week}">${formatWeek(week)}</option>`).join("");
  weekFilter.value = weeks.at(-1);
  updateProvinceOptions();
}

function updateProvinceOptions() {
  const region = regionFilter.value;
  if (region === "Italia") {
    provinceFilter.innerHTML = '<option value="Tutte">Tutte</option>';
    provinceFilter.disabled = true;
    return;
  }
  provinceFilter.disabled = false;
  const provinces = ["Tutte", ...unique(territoryData.filter((item) => item.region === region).map((item) => item.province))];
  provinceFilter.innerHTML = provinces.map((province) => `<option value="${province}">${province}</option>`).join("");
}

function aggregateRegion(region) {
  const rows = territoryData.filter((item) => item.region === region);
  const weekly = weeks.map((_, index) => Math.round(rows.reduce((sum, row) => sum + row.weekly[index], 0) / rows.length));
  const metrics = Object.fromEntries(["prevalenza", "amplificazione", "incitamento", "polarizzazione"].map((metric) => [
    metric,
    Math.round(rows.reduce((sum, row) => sum + row.metrics[metric], 0) / rows.length)
  ]));
  return { region, province: "Tutte", weekly, metrics };
}

function selectedData() {
  const region = regionFilter.value;
  const province = provinceFilter.value;
  if (region === "Italia") return territoryData[0];
  if (province === "Tutte") return aggregateRegion(region);
  return territoryData.find((item) => item.region === region && item.province === province);
}

function formatWeek(week) {
  const labels = {
    "2026-W13": "23-29 marzo 2026",
    "2026-W14": "30 marzo-5 aprile 2026",
    "2026-W15": "6-12 aprile 2026",
    "2026-W16": "13-19 aprile 2026",
    "2026-W17": "20-26 aprile 2026",
    "2026-W18": "27 aprile-3 maggio 2026"
  };
  return labels[week] ?? week;
}

function metricDelta(row, weekIndex) {
  if (weekIndex === 0) return 0;
  return row.weekly[weekIndex] - row.weekly[weekIndex - 1];
}

function renderKpis(row, weekIndex) {
  const composite = row.weekly[weekIndex];
  const delta = metricDelta(row, weekIndex);
  $("#hero-score").textContent = composite;
  $("#hero-delta").textContent = `${delta >= 0 ? "+" : ""}${delta} punti vs settimana precedente`;
  const items = [
    ["Indice composito", composite, `${delta >= 0 ? "+" : ""}${delta} punti`],
    ["Prevalenza", row.metrics.prevalenza, "quota campione"],
    ["Amplificazione", row.metrics.amplificazione, "reach e rilanci"],
    ["Incitamento", row.metrics.incitamento, "severità contenuti"]
  ];
  $("#kpi-grid").innerHTML = items.map(([label, value, hint]) => `
    <article class="panel kpi">
      <span>${label}</span>
      <strong>${value}</strong>
      <small>${hint}</small>
    </article>
  `).join("");
}

function renderEvents() {
  const week = weekFilter.value;
  const region = regionFilter.value;
  const province = provinceFilter.value;
  const activeEvents = events.filter((event) => event.week === week || event.scope === province || event.scope === region || event.scope === "Nazionale");
  $("#event-list").innerHTML = activeEvents.map((event) => `
    <article class="event-item">
      <div class="event-date">${event.date}</div>
      <div>
        <h3>${event.title}</h3>
        <p>${event.note}</p>
      </div>
      <span class="badge">${event.impact} indice</span>
    </article>
  `).join("");
}

function renderCharts(row) {
  const scope = row.region === "Italia" ? "Italia" : `${row.region}${row.province !== "Tutte" ? ` · ${row.province}` : ""}`;
  $("#scope-label").textContent = scope;

  if (typeof Chart === "undefined") {
    document.querySelectorAll("canvas").forEach((canvas) => {
      canvas.insertAdjacentHTML("afterend", "<p class=\"chart-warning\">Grafico non disponibile: libreria Chart.js non caricata.</p>");
      canvas.hidden = true;
    });
    return;
  }

  const trendConfig = {
    type: "line",
    data: {
      labels: weeks.map(formatWeek),
      datasets: [{
        label: "Indice composito",
        data: row.weekly,
        tension: 0.35,
        borderColor: "#ad2e24",
        backgroundColor: "rgba(173,46,36,.12)",
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: "#ad2e24"
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100 } } }
  };

  const radarConfig = {
    type: "radar",
    data: {
      labels: ["Prevalenza", "Amplificazione", "Incitamento", "Polarizzazione"],
      datasets: [{
        label: "Componenti",
        data: [row.metrics.prevalenza, row.metrics.amplificazione, row.metrics.incitamento, row.metrics.polarizzazione],
        borderColor: "#182c61",
        backgroundColor: "rgba(24,44,97,.18)",
        pointBackgroundColor: "#182c61"
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { r: { min: 0, max: 100 } } }
  };

  if (trendChart) trendChart.destroy();
  if (radarChart) radarChart.destroy();
  trendChart = new Chart($("#trend-chart"), trendConfig);
  radarChart = new Chart($("#radar-chart"), radarConfig);
}

function renderAll() {
  const row = selectedData();
  const weekIndex = weeks.indexOf(weekFilter.value);
  renderKpis(row, weekIndex);
  renderCharts(row);
  renderEvents();
}

function reportLines() {
  const row = selectedData();
  const weekIndex = weeks.indexOf(weekFilter.value);
  const scope = row.region === "Italia" ? "Italia" : `${row.region} / ${row.province}`;
  const delta = metricDelta(row, weekIndex);
  return [
    "ODDIO - Report settimanale",
    `Periodo: ${formatWeek(weekFilter.value)}`,
    `Territorio: ${scope}`,
    `Indice composito: ${row.weekly[weekIndex]} (${delta >= 0 ? "+" : ""}${delta} vs settimana precedente)`,
    `Prevalenza: ${row.metrics.prevalenza}/100`,
    `Amplificazione: ${row.metrics.amplificazione}/100`,
    `Incitamento: ${row.metrics.incitamento}/100`,
    `Polarizzazione: ${row.metrics.polarizzazione}/100`,
    "",
    "Eventi da verificare:",
    ...events.filter((event) => event.week === weekFilter.value || event.scope === "Nazionale").map((event) => `- ${event.date}: ${event.title}. ${event.note}`),
    "",
    "Nota metodologica: dati sintetici dimostrativi, ispirati agli indici HODIO di prevalenza e amplificazione; le correlazioni non implicano causalita'."
  ];
}

function downloadReport() {
  const lines = reportLines();
  if (window.jspdf?.jsPDF) {
    const doc = new window.jspdf.jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(lines[0], 18, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    let y = 34;
    lines.slice(1).forEach((line) => {
      const wrapped = doc.splitTextToSize(line, 174);
      doc.text(wrapped, 18, y);
      y += wrapped.length * 7;
      if (y > 280) { doc.addPage(); y = 20; }
    });
    doc.save(`ODDIO-${weekFilter.value}-${regionFilter.value}.pdf`);
    return;
  }
  window.print();
}

function handleSignup(event) {
  event.preventDefault();
  const emailInput = $("#email");
  const feedback = $("#signup-feedback");
  const email = emailInput.value.trim().toLowerCase();
  if (!emailInput.checkValidity()) {
    feedback.textContent = "Inserisci un indirizzo email valido.";
    feedback.classList.add("visible");
    return;
  }
  const token = crypto.randomUUID();
  localStorage.setItem("oddio_pending_subscription", JSON.stringify({ email, token, createdAt: new Date().toISOString() }));
  feedback.innerHTML = `Email ricevuta: <strong>${email}</strong>.<br />Controllo double opt-in simulato: <a class="confirm-link" href="#" data-token="${token}">conferma iscrizione</a>.`;
  feedback.classList.add("visible");
}

function handleConfirm(event) {
  const link = event.target.closest("[data-token]");
  if (!link) return;
  event.preventDefault();
  const pending = JSON.parse(localStorage.getItem("oddio_pending_subscription") ?? "null");
  const feedback = $("#signup-feedback");
  if (pending?.token === link.dataset.token) {
    localStorage.setItem("oddio_confirmed_subscription", JSON.stringify({ email: pending.email, confirmedAt: new Date().toISOString() }));
    localStorage.removeItem("oddio_pending_subscription");
    feedback.innerHTML = `Iscrizione confermata per <strong>${pending.email}</strong>. Il report settimanale automatico è attivo nel prototipo.`;
  } else {
    feedback.textContent = "Token non valido o scaduto. Reinvia il modulo per generare una nuova conferma.";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  initFilters();
  renderAll();
  regionFilter.addEventListener("change", () => { updateProvinceOptions(); renderAll(); });
  provinceFilter.addEventListener("change", renderAll);
  weekFilter.addEventListener("change", renderAll);
  $("#download-report").addEventListener("click", downloadReport);
  $("#signup-form").addEventListener("submit", handleSignup);
  $("#signup-feedback").addEventListener("click", handleConfirm);
});
