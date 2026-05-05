/* =====================================================
   BIOSEGURIDAD INDUSTRIAL - VERSION FINAL CORREGIDA
   PRE-AVANCE + SIMULACIÓN PRÁCTICA
===================================================== */

/* ========= 1. FIREBASE ========= */

const firebaseConfig = {
apiKey:"AIzaSyDjoFwT1oTlKhDKq8MX5bQvGIqs0_ESIFM",
authDomain:"bioseguridad-industrial.firebaseapp.com",
databaseURL:"https://bioseguridad-industrial-default-rtdb.firebaseio.com",
projectId:"bioseguridad-industrial"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

/* ========= 2. VARIABLES ========= */

let subPaginaActual = "scz";
let alarmaActiva = false;

let historialRuido = [];
let historialAire = [];

let datosSCZ = {
temperatura:"0",
ruido:"0",
casco:"No",
guantes:"No",
operario:"Sin dato"
};

let datosINT = {
aire:"0",
gas:"0",
zona:"Sin dato",
movimiento:"Sin dato",
estado:"Sin dato"
};

/* ========= 3. PRE-AVANCE ========= */

const contenidos = {

preavance:`

<div class="seccion-detallada">

<div class="texto-introduccion">

<h2>Bioseguridad Industrial</h2>

<p>
Sistema inteligente de monitoreo en tiempo real para
prevención de riesgos laborales y control operativo.
</p>

</div>

<div class="grid-botones-pre">

<button class="btn-moderno"
onclick="mostrarDetalle('teorico')">
Marco Teórico
</button>

<button class="btn-moderno"
onclick="mostrarDetalle('metodologia')">
Metodología
</button>

<button class="btn-moderno"
onclick="mostrarDetalle('materiales')">
Materiales
</button>

<button class="btn-moderno"
onclick="mostrarDetalle('comparacion')">
Comparativa
</button>

<button class="btn-moderno"
onclick="mostrarDetalle('resultados')">
Resultados
</button>

<button class="btn-moderno"
onclick="mostrarDetalle('conclusion')">
Conclusión
</button>

</div>

</div>
`

};

/* ========= 4. DETALLES ========= */

const infoDetallada = {

teorico:`
<div class="seccion-detallada">
<h2>Marco Teórico</h2>
<p>
La bioseguridad industrial minimiza accidentes,
protege al trabajador y mejora procesos.
</p>
</div>`,

metodologia:`
<div class="seccion-detallada">
<h2>Metodología</h2>
<p>
Se emplean sensores conectados a Firebase para
monitoreo en tiempo real desde web.
</p>
</div>`,

materiales:`
<div class="seccion-detallada">
<h2>Materiales</h2>
<p>
ESP32, sensores, Firebase, HTML, CSS y JavaScript.
</p>
</div>`,

comparacion:`
<div class="seccion-detallada">
<h2>Comparativa</h2>
<p>
Evaluación entre planta Santa Cruz y zona internacional.
</p>
</div>`,

resultados:`
<div class="seccion-detallada">
<h2>Resultados</h2>
<p>
Respuesta inmediata ante riesgos y control continuo.
</p>
</div>`,

conclusion:`
<div class="seccion-detallada">
<h2>Conclusión</h2>
<p>
La automatización mejora seguridad y productividad.
</p>
</div>`

};

/* ========= 5. UTILIDADES ========= */

function color(v){
if(v=="ALTO") return "#ff5252";
if(v=="MEDIO") return "#ffb300";
return "#00c853";
}

function barra(v){
return Math.max(0,Math.min(v,100));
}

function tendencia(arr){

if(arr.length<2) return "ESTABLE";

let a = arr[arr.length-2];
let b = arr[arr.length-1];

if(b>a) return "SUBIENDO";
if(b<a) return "BAJANDO";

return "ESTABLE";
}

function sonarAlarma(){

if(alarmaActiva) return;

alarmaActiva = true;

const ctx =
new(window.AudioContext||window.webkitAudioContext)();

const osc = ctx.createOscillator();
const gain = ctx.createGain();

osc.type = "square";
osc.frequency.value = 700;

osc.connect(gain);
gain.connect(ctx.destination);

gain.gain.value = 0.05;

osc.start();

setTimeout(()=>{

osc.stop();
alarmaActiva = false;

},350);

}

/* ========= 6. SIMULACIÓN PRÁCTICA ========= */

window.cargarInterfazPractica = (sub="scz") => {

subPaginaActual = sub;

const panel =
document.getElementById("dynamic-content");

let html = `

<div class="practico-pro seccion-detallada">

<div class="topbar-pro">
<h2>Centro de Monitoreo Industrial</h2>
<span>${new Date().toLocaleTimeString()}</span>
</div>

<div class="selector-subpaginas">

<button class="${sub=="scz"?"active":""}"
onclick="cargarInterfazPractica('scz')">
Santa Cruz
</button>

<button class="${sub=="int"?"active":""}"
onclick="cargarInterfazPractica('int')">
Internacional
</button>

</div>
`;

/* ===== SANTA CRUZ ===== */

if(sub=="scz"){

let t = parseInt(datosSCZ.temperatura)||0;
let r = parseInt(datosSCZ.ruido)||0;

let riesgo =
(t>40 || r>90) ? "ALTO" :
(t>34 || r>75) ? "MEDIO" :
"BAJO";

if(riesgo=="ALTO") sonarAlarma();

html += `

<div class="kpi-grid">

<div class="kpi-card">
<h3>Temperatura</h3>
<div class="kpi-value">${t}°C</div>
</div>

<div class="kpi-card">
<h3>Ruido</h3>
<div class="kpi-value">${r} dB</div>
</div>

<div class="kpi-card">
<h3>Índice Seguridad</h3>
<div class="kpi-value">
${riesgo=="BAJO"?"96%":
riesgo=="MEDIO"?"71%":"42%"}
</div>
</div>

<div class="kpi-card">
<h3>Tendencia</h3>
<div class="kpi-value">${tendencia(historialRuido)}</div>
</div>

</div>

<div class="grid-monitor">

<div class="card-pro">
<h3>Temperatura Planta</h3>
<div class="big">${t}°C</div>
</div>

<div class="card-pro">
<h3>Nivel Ruido</h3>
<div class="big">${r} dB</div>
<div class="barra">
<span style="width:${barra(r)}%;background:${color(riesgo)};"></span>
</div>
</div>

<div class="card-pro">
<h3>Uso de Casco</h3>
<div class="big">${datosSCZ.casco}</div>
</div>

<div class="card-pro">
<h3>Uso de Guantes</h3>
<div class="big">${datosSCZ.guantes}</div>
</div>

<div class="card-pro">
<h3>Estado Operario</h3>
<div class="status">${datosSCZ.operario}</div>
</div>

<div class="card-pro ${riesgo=="ALTO"?"blink-alert":""}">
<h3>Nivel Riesgo</h3>
<div class="status" style="color:${color(riesgo)}">
${riesgo}
</div>
</div>

</div>
`;

}else{

/* ===== INTERNACIONAL ===== */

let a = parseInt(datosINT.aire)||0;
let g = parseInt(datosINT.gas)||0;

let riesgo =
(a<60 || g>70) ? "ALTO" :
(a<80 || g>40) ? "MEDIO" :
"BAJO";

if(riesgo=="ALTO") sonarAlarma();

html += `

<div class="kpi-grid">

<div class="kpi-card">
<h3>Calidad Aire</h3>
<div class="kpi-value">${a}%</div>
</div>

<div class="kpi-card">
<h3>Gas Tóxico</h3>
<div class="kpi-value">${g}%</div>
</div>

<div class="kpi-card">
<h3>Índice Seguridad</h3>
<div class="kpi-value">
${riesgo=="BAJO"?"95%":
riesgo=="MEDIO"?"68%":"35%"}
</div>
</div>

<div class="kpi-card">
<h3>Tendencia</h3>
<div class="kpi-value">${tendencia(historialAire)}</div>
</div>

</div>

<div class="grid-monitor">

<div class="card-pro">
<h3>Calidad Aire</h3>
<div class="big">${a}%</div>
</div>

<div class="card-pro">
<h3>Gas Tóxico</h3>
<div class="big">${g}%</div>
</div>

<div class="card-pro">
<h3>Zona Segura</h3>
<div class="big">${datosINT.zona}</div>
</div>

<div class="card-pro">
<h3>Detector Movimiento</h3>
<div class="big">${datosINT.movimiento}</div>
</div>

<div class="card-pro">
<h3>Estado Plataforma</h3>
<div class="status">${datosINT.estado}</div>
</div>

<div class="card-pro ${riesgo=="ALTO"?"blink-alert":""}">
<h3>Nivel Riesgo</h3>
<div class="status" style="color:${color(riesgo)}">
${riesgo}
</div>
</div>

</div>
`;

}

html += `</div>`;

panel.innerHTML = html;

};

/* ========= 7. NAVEGACIÓN ========= */

window.mostrarDetalle = (k)=>{

document.getElementById("dynamic-content")
.innerHTML = infoDetallada[k];

};

window.volverAPizarra = ()=>{

document.getElementById("dynamic-content")
.innerHTML = contenidos.preavance;

};

/* ========= 8. INICIO ========= */

window.onload = ()=>{

volverAPizarra();

document.querySelectorAll(".menu li")
.forEach(item=>{

item.addEventListener("click",()=>{

document.querySelectorAll(".menu li")
.forEach(i=>i.classList.remove("active"));

item.classList.add("active");

if(item.dataset.section=="preavance")
volverAPizarra();
else
cargarInterfazPractica("scz");

});

});

};

/* ========= 9. FIREBASE ========= */

database.ref("bioseguridad/sc").on("value",(snap)=>{

datosSCZ = snap.val() || datosSCZ;

historialRuido.push(parseInt(datosSCZ.ruido)||0);

if(historialRuido.length>10)
historialRuido.shift();

if(subPaginaActual=="scz" &&
document.querySelector(".practico-pro")){

cargarInterfazPractica("scz");

}

});

database.ref("bioseguridad/int").on("value",(snap)=>{

datosINT = snap.val() || datosINT;

historialAire.push(parseInt(datosINT.aire)||0);

if(historialAire.length>10)
historialAire.shift();

if(subPaginaActual=="int" &&
document.querySelector(".practico-pro")){

cargarInterfazPractica("int");

}

});
