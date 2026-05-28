/* =====================================================
   BIOSEGURIDAD INDUSTRIAL
   VERSION FINAL EMPRESARIAL
===================================================== */

/* ========= FIREBASE ========= */

const firebaseConfig = {
apiKey:"AIzaSyDjoFwT1oTlKhDKq8MX5bQvGIqs0_ESIFM",
authDomain:"bioseguridad-industrial.firebaseapp.com",
databaseURL:"https://bioseguridad-industrial-default-rtdb.firebaseio.com",
projectId:"bioseguridad-industrial"
};
   

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

/* ========= VARIABLES ========= */

let subPaginaActual = "scz";

let intervaloAlarma = null;
let audioCtx = null;
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

/* ========= CONTENIDO ========= */

const contenidos = {

preavance:`

<div class="seccion-detallada">

<div class="texto-introduccion">

<h2>Bioseguridad Industrial</h2>

<p>
Sistema inteligente de monitoreo industrial
con sensores conectados a Firebase para
prevención de riesgos laborales.
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

/* ========= DETALLES ========= */

const infoDetallada = {

teorico:`
<div class="seccion-detallada">
<h2>Marco Teórico</h2>
<p>
La bioseguridad industrial reduce riesgos,
protege operarios y mejora la productividad.
</p>
</div>`,

metodologia:`
<div class="seccion-detallada">
<h2>Metodología</h2>
<p>
Se utilizaron sensores conectados a Firebase
para monitoreo industrial en tiempo real.
</p>
</div>`,

materiales:`
<div class="seccion-detallada">
<h2>Materiales</h2>
<p>
ESP32, sensores industriales, Firebase,
HTML, CSS y JavaScript.
</p>
</div>`,

comparacion:`
<div class="seccion-detallada">
<h2>Comparativa</h2>
<p>
Comparación entre planta nacional PIL
y plataforma internacional Nestlé.
</p>
</div>`,

resultados:`
<div class="seccion-detallada">
<h2>Resultados</h2>
<p>
El sistema detecta riesgos y genera alertas
en tiempo real.
</p>
</div>`,

conclusion:`
<div class="seccion-detallada">
<h2>Conclusión</h2>
<p>
La automatización mejora seguridad,
control y eficiencia operativa.
</p>
</div>`

};

/* ========= UTILIDADES ========= */

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

}function sonarAlarma(){

    if(intervaloAlarma) return;

    if(!audioCtx){

        audioCtx =
        new(window.AudioContext || window.webkitAudioContext)();

    }

    if(audioCtx.state === "suspended"){
        audioCtx.resume();
    }

    intervaloAlarma = setInterval(()=>{

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "square";
        osc.frequency.setValueAtTime(
            700,
            audioCtx.currentTime
        );

        gain.gain.setValueAtTime(
            0.2,
            audioCtx.currentTime
        );

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();

        osc.stop(audioCtx.currentTime + 0.3);

    },1000);

}

function detenerAlarma(){

    if(intervaloAlarma){

        clearInterval(intervaloAlarma);

        intervaloAlarma = null;

    }

}

/* ========= INTERFAZ ========= */

window.cargarInterfazPractica = (sub="scz") => {

subPaginaActual = sub;

const panel =
document.getElementById("dynamic-content");

/* =====================================================
   PIL ANDINA
===================================================== */

if(sub=="scz"){

let t = parseInt(datosSCZ.temperatura)||0;

let r = parseInt(datosSCZ.ruido)||0;

let riesgo =
(t>40 || r>90) ? "ALTO" :
(t>34 || r>75) ? "MEDIO" :
"BAJO";

if(riesgo=="ALTO"){

    sonarAlarma();

}else{

    detenerAlarma();

}

panel.innerHTML = `

<div class="practico-pro seccion-detallada">

<div class="topbar-pro">

<div class="empresa-header">

<img
src="img/pil.png"
class="logo-empresa">

<div>

<h2>PIL ANDINA • Planta Santa Cruz</h2>

<span class="empresa-tag">
Industria Alimentaria y Láctea
</span>

</div>

</div>

<span>
${new Date().toLocaleTimeString()}
</span>

</div>

<div class="selector-subpaginas">

<button class="active"
onclick="cargarInterfazPractica('scz')">
Santa Cruz
</button>

<button
onclick="cargarInterfazPractica('int')">
Internacional
</button>

</div>

<!-- KPI -->

<div class="kpi-grid">

<div class="kpi-card">

<h3>Temperatura</h3>

<div class="kpi-value">
${t}°C
</div>

</div>

<div class="kpi-card">

<h3>Ruido</h3>

<div class="kpi-value">
${r} dB
</div>

</div>

<div class="kpi-card">

<h3>Índice Seguridad</h3>

<div class="kpi-value">

${riesgo=="BAJO"
?"96%"
:riesgo=="MEDIO"
?"71%"
:"42%"}

</div>

</div>

<div class="kpi-card">

<h3>Tendencia</h3>

<div class="kpi-value">
${tendencia(historialRuido)}
</div>

</div>

</div>

<!-- MAPA -->

<div class="mapa-industrial">

<h2 class="titulo-mapa">
Mapa Inteligente PIL Andina
</h2>

<div class="planta-grid">

<div class="zona zona-normal">

<h3>Recepción de Leche</h3>

<div class="sensor-mini online"></div>

<p>Ingreso materia prima</p>

</div>

<div class="
zona
${r>75?"zona-media":"zona-normal"}
">

<h3>Cámara Fría</h3>

<div class="
sensor-mini
${r>75?"alerta":"online"}
"></div>

<p>Conservación productos</p>

<div class="dato-zona">
Ruido: ${r} dB
</div>

</div>

<div class="
zona
${riesgo=="ALTO"
?"zona-peligro"
:riesgo=="MEDIO"
?"zona-media"
:"zona-normal"}
">

<h3>Pasteurización</h3>

<div class="sensor-item">

🌡 Temperatura:
${t}°C

</div>

<div class="sensor-item">

🔊 Ruido:
${r} dB

</div>

<div class="estado-zona">

${riesgo=="ALTO"
?"RIESGO ALTO"
:riesgo=="MEDIO"
?"RIESGO MEDIO"
:"OPERACIÓN SEGURA"}

</div>

</div>

<div class="zona zona-normal">

<h3>Área Operarios</h3>

<div class="sensor-item">
⛑ Casco: ${datosSCZ.casco}
</div>

<div class="sensor-item">
🧤 Guantes: ${datosSCZ.guantes}
</div>

<div class="sensor-item">
👷 Estado: ${datosSCZ.operario}
</div>

</div>

<div class="zona zona-normal">

<h3>Control de Calidad</h3>

<div class="sensor-mini online"></div>

<p>Monitoreo microbiológico</p>

</div>

<div class="zona centro-control">

<h3>Centro Monitoreo</h3>

<div class="online-box">

<span class="online-dot"></span>

FIREBASE ONLINE

</div>

<div class="mini-kpi">

TIEMPO REAL

</div>

</div>

<div class="zona salida-box">

<h3>Salida Emergencia</h3>

<div class="salida-alerta">

RUTA SEGURA

</div>

</div>

<div class="zona zona-segura">

<h3>Zona Segura</h3>

<div class="seguro-box">

ÁREA PROTEGIDA

</div>

</div>

</div>

</div>

</div>

`;

}else{

/* =====================================================
   NESTLE
===================================================== */

let a = parseInt(datosINT.aire)||0;

let g = parseInt(datosINT.gas)||0;

let riesgo =
(a<60 || g>70) ? "ALTO" :
(a<80 || g>40) ? "MEDIO" :
"BAJO";

if(riesgo=="ALTO"){

    sonarAlarma();

}else{

    detenerAlarma();

}

panel.innerHTML = `

<div class="practico-pro seccion-detallada">

<div class="topbar-pro">

<div class="empresa-header">

<img
src="img/nestle.png"
class="logo-empresa">

<div>

<h2>NESTLÉ • Plataforma Internacional</h2>

<span class="empresa-tag">
Centro Global de Bioseguridad
</span>

</div>

</div>

<span>
${new Date().toLocaleTimeString()}
</span>

</div>

<div class="selector-subpaginas">

<button
onclick="cargarInterfazPractica('scz')">
Santa Cruz
</button>

<button class="active"
onclick="cargarInterfazPractica('int')">
Internacional
</button>

</div>

<!-- KPI -->

<div class="kpi-grid">

<div class="kpi-card">

<h3>Calidad Aire</h3>

<div class="kpi-value">
${a}%
</div>

</div>

<div class="kpi-card">

<h3>Gas Tóxico</h3>

<div class="kpi-value">
${g}%
</div>

</div>

<div class="kpi-card">

<h3>Índice Seguridad</h3>

<div class="kpi-value">

${riesgo=="BAJO"
?"95%"
:riesgo=="MEDIO"
?"68%"
:"35%"}

</div>

</div>

<div class="kpi-card">

<h3>Tendencia</h3>

<div class="kpi-value">
${tendencia(historialAire)}
</div>

</div>

</div>

<!-- MAPA -->

<div class="mapa-industrial">

<h2 class="titulo-mapa">
Mapa Inteligente Nestlé
</h2>

<div class="planta-grid">

<div class="zona zona-normal">

<h3>Control Acceso</h3>

<div class="sensor-mini online"></div>

<p>Ingreso autorizado</p>

</div>

<div class="
zona
${a<80?"zona-media":"zona-normal"}
">

<h3>Purificación Ambiental</h3>

<div class="
sensor-mini
${a<80?"alerta":"online"}
"></div>

<p>Control ambiental</p>

<div class="dato-zona">
Aire: ${a}%
</div>

</div>

<div class="
zona
${g>70
?"zona-peligro"
:g>40
?"zona-media"
:"zona-normal"}
">

<h3>Procesamiento Alimentario</h3>

<div class="sensor-item">

☣ Gas:
${g}%

</div>

<div class="sensor-item">

💨 Aire:
${a}%

</div>

<div class="estado-zona">

${riesgo=="ALTO"
?"CONTAMINACIÓN ALTA"
:riesgo=="MEDIO"
?"CONTROL PREVENTIVO"
:"OPERACIÓN SEGURA"}

</div>

</div>

<div class="zona zona-normal">

<h3>Detector Movimiento</h3>

<div class="sensor-item">
📡 ${datosINT.movimiento}
</div>

<div class="sensor-item">
🛡 ${datosINT.zona}
</div>

</div>

<div class="zona zona-normal">

<h3>Laboratorio Nutricional</h3>

<div class="sensor-mini online"></div>

<p>Análisis alimentario</p>

</div>

<div class="zona centro-control">

<h3>Centro Internacional</h3>

<div class="online-box">

<span class="online-dot"></span>

FIREBASE ONLINE

</div>

<div class="mini-kpi">

SINCRONIZACIÓN GLOBAL

</div>

</div>

<div class="zona salida-box">

<h3>Ruta Evacuación</h3>

<div class="salida-alerta">

PROTOCOLO ACTIVO

</div>

</div>

<div class="zona zona-segura">

<h3>Área Segura</h3>

<div class="seguro-box">

CONTROL ESTABLE

</div>

</div>

</div>

</div>

</div>

`;

}
renderGrafico();
};

/* ========= NAVEGACION ========= */

window.mostrarDetalle = (k)=>{

document.getElementById("dynamic-content")
.innerHTML = infoDetallada[k];

};

window.volverAPizarra = ()=>{

document.getElementById("dynamic-content")
.innerHTML = contenidos.preavance;

};

/* ========= INICIO ========= */

window.onload = ()=>{
   document.addEventListener("click",()=>{

    const AudioContext =
    window.AudioContext || window.webkitAudioContext;

    if(AudioContext){

        const ctx = new AudioContext();

        if(ctx.state === "suspended"){

            ctx.resume();

        }

    }

},{once:true});

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

/* ========= FIREBASE ========= */

database.ref("bioseguridad/sc").on("value",(snap)=>{

const d = snap.val() || {};

datosSCZ = {
temperatura: d.temperatura ?? "0",
ruido: d.ruido ?? "0",
casco: d.casco ?? "No",
guantes: d.guantes ?? "No",
operario: d.operario ?? "Sin dato"
};

historialRuido.push(parseInt(d.ruido)||0);
if(historialRuido.length>10) historialRuido.shift();

if(subPaginaActual=="scz" && document.querySelector(".practico-pro")){
cargarInterfazPractica("scz");
}
historialRuido.push(parseInt(d.ruido)||0);
if(historialRuido.length>10) historialRuido.shift();

renderGrafico();
});

database.ref("bioseguridad/int").on("value",(snap)=>{

const d = snap.val() || {};

datosINT = {
aire: d.aire ?? "0",
gas: d.gas ?? "0",
zona: d.zona ?? "Sin dato",
movimiento: d.movimiento ?? "Sin dato",
estado: d.estado ?? "Sin dato"
};

historialAire.push(parseInt(d.aire)||0);
if(historialAire.length>10) historialAire.shift();

if(subPaginaActual=="int" && document.querySelector(".practico-pro")){
cargarInterfazPractica("int");
}
historialAire.push(parseInt(d.aire)||0);
if(historialAire.length>10) historialAire.shift();

renderGrafico();
});
