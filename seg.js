/* =====================================================
   BIOSEGURIDAD INDUSTRIAL
===================================================== */

/* ========= FIREBASE CONFIG ========= */
const firebaseConfig = {
    apiKey: "AIzaSyDjoFwT1oTlKhDKq8MX5bQvGIqs0_ESIFM",
    authDomain: "bioseguridad-industrial.firebaseapp.com",
    databaseURL: "https://bioseguridad-industrial-default-rtdb.firebaseio.com",
    projectId: "bioseguridad-industrial"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

/* ========= ESTADO GLOBAL ========= */
let estadoApp = {
    vistaActual: "preavance",
    empresaActual: "scz",
    chartInstance: null,
    intervaloAlarma: null,
    audioCtx: null,
    relojInterval: null
};

let datosSensores = {
    scz: { temperatura: 0, ruido: 0, casco: "No", guantes: "No", operario: "Desconocido", historial: [] },
    int: { aire: 0, gas: 0, zona: "Desconocida", movimiento: "Sin dato", estado: "Desconocido", historial: [] }
};

/* ========= PLANTILLAS HTML ========= */
const Vistas = {
    preavance: `
        <div class="fade-in">
            <!-- HERO SECTION -->
            <div class="hero-industrial glass-panel">
                <h2><i class="fa-solid fa-microchip"></i> Plataforma Smart Safety Industry </h2>
                <p>Sistema centralizado de telemetría y bioseguridad conectado a Firebase. Monitoreo predictivo de riesgos laborales en tiempo real mediante redes de sensores IoT e Inteligencia de Datos.</p>
                <div class="tag-container">
                    <span class="hero-tag"><i class="fa-brands fa-cloudversify"></i> Cloud Computing</span>
                    <span class="hero-tag"><i class="fa-solid fa-satellite-dish"></i> Telemetría RT</span>
                    <span class="hero-tag"><i class="fa-solid fa-shield-virus"></i> Prevención Activa</span>
                </div>
            </div>

            <!-- TIMELINE DEL PROYECTO -->
            <div class="timeline-section glass-panel">
                <h3><i class="fa-solid fa-road"></i> Hoja de Ruta del Proyecto</h3>
                <div class="timeline">
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <h4>Fase 1: Marco Teórico</h4>
                            <p>Investigación sobre normativas de bioseguridad industrial y protocolos de reducción de riesgos laborales.</p>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <h4>Fase 2: Arquitectura IoT</h4>
                            <p>Diseño de hardware (ESP32, Sensores MQ, DHT) y conexión con la base de datos NoSQL Firebase.</p>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <h4>Fase 3: Plataforma Web</h4>
                            <p>Desarrollo de este Dashboard corporativo con HTML5, CSS3 Glassmorphism y JS Modular.</p>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <h4>Fase 4: Análisis Comparativo</h4>
                            <p>Evaluación de métricas entre PIL Andina (Nacional) y Nestlé (Estándar Global).</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    
    simulacionTemplate: (empresa) => {
        const esNacional = empresa === 'scz';
        return `
        <div class="fade-in">
            
            <div class="company-selector">
                <button class="btn-company ${esNacional ? 'active' : ''}" onclick="cambiarEmpresa('scz')">
                    <i class="fa-solid fa-industry"></i> PIL Andina (Santa Cruz)
                </button>
                <button class="btn-company ${!esNacional ? 'active' : ''}" onclick="cambiarEmpresa('int')">
                    <i class="fa-solid fa-globe"></i> Nestlé (Global)
                </button>
            </div>

            <div class="dashboard-grid">
                <div class="card-kpi glass-panel">
                    <div class="kpi-header">
                        <span>${esNacional ? 'Temperatura Planta' : 'Calidad Aire (AQI)'}</span>
                        <i class="fa-solid ${esNacional ? 'fa-temperature-half' : 'fa-wind'}"></i>
                    </div>
                    <div class="kpi-value" id="kpi-1">--</div>
                    <div class="kpi-trend" id="trend-1">Calculando...</div>
                </div>
                
                <div class="card-kpi glass-panel">
                    <div class="kpi-header">
                        <span>${esNacional ? 'Nivel Ruido' : 'Gas Tóxico Detectado'}</span>
                        <i class="fa-solid ${esNacional ? 'fa-volume-high' : 'fa-biohazard'}"></i>
                    </div>
                    <div class="kpi-value" id="kpi-2">--</div>
                    <div class="kpi-trend" id="trend-2">Calculando...</div>
                </div>

                <div class="card-kpi glass-panel" style="border-left: 4px solid var(--primary)">
                    <div class="kpi-header">
                        <span>Health Index / Estado</span>
                        <i class="fa-solid fa-heart-pulse"></i>
                    </div>
                    <div class="kpi-value" id="kpi-status" style="font-size: 1.8rem;">Evaluando</div>
                    <div class="kpi-trend"><i class="fa-solid fa-clock"></i> <span id="reloj-live">--:--:--</span></div>
                </div>
            </div>

            <!-- GRAFICA EN TIEMPO REAL -->
            <div class="chart-wrapper glass-panel">
                <div class="chart-header">
                    <h3><i class="fa-solid fa-chart-area"></i> Análisis Histórico Telemetría</h3>
                    <span style="color: var(--success); font-size: 0.85rem;"><i class="fa-solid fa-circle-nodes"></i> Stream Activo</span>
                </div>
                <canvas id="liveChart"></canvas>
            </div>

            <!-- MAPA DE PLANTA -->
            <div class="plant-map glass-panel" id="mapa-container">
                <!-- Se inyecta por JS dinámicamente -->
            </div>
        </div>
        `;
    }
};

/* ========= CONTROLADORES DE AUDIO (ALARMAS) ========= */
function inicializarAudio() {
    if (!estadoApp.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        estadoApp.audioCtx = new AudioContext();
    }
    if (estadoApp.audioCtx.state === "suspended") estadoApp.audioCtx.resume();
}

function manejarAlarma(activar) {
    if (activar && !estadoApp.intervaloAlarma) {
        inicializarAudio();
        estadoApp.intervaloAlarma = setInterval(() => {
            if(!estadoApp.audioCtx) return;
            const osc = estadoApp.audioCtx.createOscillator();
            const gain = estadoApp.audioCtx.createGain();
            osc.type = "square";
            osc.frequency.setValueAtTime(800, estadoApp.audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, estadoApp.audioCtx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.1, estadoApp.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, estadoApp.audioCtx.currentTime + 0.3);
            osc.connect(gain);
            gain.connect(estadoApp.audioCtx.destination);
            osc.start();
            osc.stop(estadoApp.audioCtx.currentTime + 0.3);
        }, 1000);
    } else if (!activar && estadoApp.intervaloAlarma) {
        clearInterval(estadoApp.intervaloAlarma);
        estadoApp.intervaloAlarma = null;
    }
}

/* ========= LÓGICA DE GRÁFICOS ========= */
function initChart() {
    const ctx = document.getElementById('liveChart');
    if (!ctx) return;
    
    if (estadoApp.chartInstance) {
        estadoApp.chartInstance.destroy();
    }

    const esNacional = estadoApp.empresaActual === 'scz';
    const labelData = esNacional ? 'Niveles de Ruido (dB)' : 'Calidad de Aire (%)';
    
    estadoApp.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['-9s', '-8s', '-7s', '-6s', '-5s', '-4s', '-3s', '-2s', '-1s', 'Ahora'],
            datasets: [{
                label: labelData,
                data: esNacional ? datosSensores.scz.historial : datosSensores.int.historial,
                borderColor: '#0ea5e9',
                backgroundColor: 'rgba(14, 165, 233, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#f8fafc',
                pointBorderColor: '#0ea5e9'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { 
                    beginAtZero: true, 
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94a3b8' }
                },
                x: { 
                    grid: { display: false },
                    ticks: { color: '#94a3b8' }
                }
            },
            animation: { duration: 0 } // Desactiva animación para evitar saltos en update continuo
        }
    });
}

function updateChart() {
    if (estadoApp.chartInstance && estadoApp.vistaActual === 'practica_total') {
        const dataArray = estadoApp.empresaActual === 'scz' ? datosSensores.scz.historial : datosSensores.int.historial;
        estadoApp.chartInstance.data.datasets[0].data = dataArray;
        estadoApp.chartInstance.update();
    }
}

/* ========= ACTUALIZACIÓN DE UI (DOM) ========= */
function iniciarReloj() {
    if (estadoApp.relojInterval) clearInterval(estadoApp.relojInterval);
    estadoApp.relojInterval = setInterval(() => {
        const el = document.getElementById('reloj-live');
        if (el) el.innerText = new Date().toLocaleTimeString();
    }, 1000);
}

function calcularTendencia(arr) {
    if(arr.length < 2) return `<span class="trend-down"><i class="fa-solid fa-minus"></i> Estable</span>`;
    const diff = arr[arr.length-1] - arr[arr.length-2];
    if(diff > 0) return `<span class="trend-up"><i class="fa-solid fa-arrow-trend-up"></i> +${diff} (Subiendo)</span>`;
    if(diff < 0) return `<span class="trend-down"><i class="fa-solid fa-arrow-trend-down"></i> ${diff} (Bajando)</span>`;
    return `<span class="trend-down" style="color:var(--text-muted)"><i class="fa-solid fa-minus"></i> Estable</span>`;
}

function renderDOM() {
    if (estadoApp.vistaActual !== 'practica_total') return;
    
    const esNacional = estadoApp.empresaActual === 'scz';
    const data = esNacional ? datosSensores.scz : datosSensores.int;
    
    // Evaluar Riesgos
    let riesgo = "BAJO";
    if(esNacional) {
        if(data.temperatura > 40 || data.ruido > 90) riesgo = "ALTO";
        else if(data.temperatura > 34 || data.ruido > 75) riesgo = "MEDIO";
    } else {
        if(data.aire < 60 || data.gas > 70) riesgo = "ALTO";
        else if(data.aire < 80 || data.gas > 40) riesgo = "MEDIO";
    }

    manejarAlarma(riesgo === "ALTO");

    // Actualizar KPIs superiores
    document.getElementById('kpi-1').innerText = esNacional ? `${data.temperatura}°C` : `${data.aire}%`;
    document.getElementById('kpi-2').innerText = esNacional ? `${data.ruido} dB` : `${data.gas}%`;
    document.getElementById('trend-2').innerHTML = calcularTendencia(data.historial);
    
    const statusEl = document.getElementById('kpi-status');
    if(riesgo === "ALTO") {
        statusEl.innerHTML = `<span style="color:var(--danger)">PELIGRO</span>`;
    } else if(riesgo === "MEDIO") {
        statusEl.innerHTML = `<span style="color:var(--warning)">PRECAUCIÓN</span>`;
    } else {
        statusEl.innerHTML = `<span style="color:var(--success)">ÓPTIMO</span>`;
    }

    // Actualizar Mapa Dinámico
    const mapaHTML = esNacional ? `
        <div class="map-header">
            <h3><i class="fa-solid fa-map-location-dot"></i> Layout PIL Andina</h3>
        </div>
        <div class="zone-grid">
            <div class="zone-card ${riesgo==='ALTO'?'status-danger':(riesgo==='MEDIO'?'status-warn':'status-safe')}">
                <div class="zone-title">Pasteurización <span class="zone-status">${riesgo}</span></div>
                <div class="zone-data"><i class="fa-solid fa-temperature-empty"></i> Temp: ${data.temperatura}°C</div>
                <div class="zone-data"><i class="fa-solid fa-wave-square"></i> Ruido: ${data.ruido} dB</div>
            </div>
            <div class="zone-card status-info">
                <div class="zone-title">Área Operarios <span class="zone-status">INFO</span></div>
                <div class="zone-data"><i class="fa-solid fa-helmet-safety"></i> Casco: ${data.casco}</div>
                <div class="zone-data"><i class="fa-solid fa-mitten"></i> Guantes: ${data.guantes}</div>
                <div class="zone-data"><i class="fa-solid fa-user-gear"></i> ${data.operario}</div>
            </div>
        </div>
    ` : `
        <div class="map-header">
            <h3><i class="fa-solid fa-map-location-dot"></i> Layout Nestlé Global</h3>
        </div>
        <div class="zone-grid">
            <div class="zone-card ${riesgo==='ALTO'?'status-danger':(riesgo==='MEDIO'?'status-warn':'status-safe')}">
                <div class="zone-title">Procesamiento <span class="zone-status">${riesgo}</span></div>
                <div class="zone-data"><i class="fa-solid fa-wind"></i> Pureza Aire: ${data.aire}%</div>
                <div class="zone-data"><i class="fa-solid fa-skull-crossbones"></i> Gas: ${data.gas}%</div>
            </div>
            <div class="zone-card status-info">
                <div class="zone-title">Seguridad IA <span class="zone-status">INFO</span></div>
                <div class="zone-data"><i class="fa-solid fa-camera-retro"></i> Movimiento: ${data.movimiento}</div>
                <div class="zone-data"><i class="fa-solid fa-shield-halved"></i> Zona: ${data.zona}</div>
                <div class="zone-data"><i class="fa-solid fa-power-off"></i> Estado: ${data.estado}</div>
            </div>
        </div>
    `;
    
    document.getElementById('mapa-container').innerHTML = mapaHTML;
}

/* ========= NAVEGACIÓN Y EVENTOS ========= */
window.cambiarEmpresa = (empresa) => {
    estadoApp.empresaActual = empresa;
    renderizarVista();
};

function renderizarVista() {
    const contenedor = document.getElementById('dynamic-content');
    if (estadoApp.vistaActual === 'preavance') {
        manejarAlarma(false); // Apagar alarma al salir
        contenedor.innerHTML = Vistas.preavance;
    } else {
        contenedor.innerHTML = Vistas.simulacionTemplate(estadoApp.empresaActual);
        initChart();
        iniciarReloj();
        renderDOM();
    }
}

function inicializarNavegacion() {
    document.querySelectorAll('.menu li').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.menu li').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            estadoApp.vistaActual = item.dataset.section;
            renderizarVista();
        });
    });
}

/* ========= FIREBASE LISTENERS ========= */
database.ref("bioseguridad/sc").on("value", (snap) => {
    const d = snap.val() || {};
    datosSensores.scz.temperatura = parseInt(d.temperatura) || 0;
    datosSensores.scz.ruido = parseInt(d.ruido) || 0;
    datosSensores.scz.casco = d.casco || "No";
    datosSensores.scz.guantes = d.guantes || "No";
    datosSensores.scz.operario = d.operario || "Desconocido";

    datosSensores.scz.historial.push(datosSensores.scz.ruido);
    if(datosSensores.scz.historial.length > 10) datosSensores.scz.historial.shift();
    
    if (estadoApp.vistaActual === 'practica_total') {
        renderDOM();
        updateChart();
    }
});

database.ref("bioseguridad/int").on("value", (snap) => {
    const d = snap.val() || {};
    datosSensores.int.aire = parseInt(d.aire) || 0;
    datosSensores.int.gas = parseInt(d.gas) || 0;
    datosSensores.int.zona = d.zona || "Desconocido";
    datosSensores.int.movimiento = d.movimiento || "Desconocido";
    datosSensores.int.estado = d.estado || "Desconocido";

    datosSensores.int.historial.push(datosSensores.int.aire);
    if(datosSensores.int.historial.length > 10) datosSensores.int.historial.shift();

    if (estadoApp.vistaActual === 'practica_total') {
        renderDOM();
        updateChart();
    }
});

/* ========= INICIO DE APP ========= */
window.onload = () => {
    // Relleno inicial de arrays (para gráficos sin errores al inicio)
    datosSensores.scz.historial = new Array(10).fill(0);
    datosSensores.int.historial = new Array(10).fill(100);

    // Requerimiento de interacción para AudioContext
    document.addEventListener("click", inicializarAudio, { once: true });
    
    inicializarNavegacion();
    renderizarVista(); // Cargar Dashboard 
};
