const canvas = document.getElementById('lienzo');
const ctx = canvas.getContext('2d');

// --- REFERENCIAS AL DOM ---
// Dispositivo 1
const tipoDispositivo = document.getElementById('tipoDispositivo');
const escalaDispositivo = document.getElementById('escalaDispositivo');
const escalaValor = document.getElementById('escalaValor');
const dispX = document.getElementById('dispX');
const dispY = document.getElementById('dispY');
const dispRot = document.getElementById('dispRot');
const imagenUpload = document.getElementById('imagenUpload');

// Dispositivo 2
const activarDisp2 = document.getElementById('activarDisp2');
const panelDisp2 = document.getElementById('panelDisp2');
const escalaDispositivo2 = document.getElementById('escalaDispositivo2');
const escalaValor2 = document.getElementById('escalaValor2');
const dispX2 = document.getElementById('dispX2');
const dispY2 = document.getElementById('dispY2');
const dispRot2 = document.getElementById('dispRot2');
const imagenUpload2 = document.getElementById('imagenUpload2');

// Texto
const tituloInput = document.getElementById('tituloInput');
const fuenteTexto = document.getElementById('fuenteTexto');
const textoX = document.getElementById('textoX');
const textoY = document.getElementById('textoY');
const textoRot = document.getElementById('textoRot');
const sombraTexto = document.getElementById('sombraTexto');

// Fondos y Colores
const tipoFondo = document.getElementById('tipoFondo');
const colorFondo = document.getElementById('colorFondo');
const colorFondo2 = document.getElementById('colorFondo2');
const grupoColor2 = document.getElementById('grupoColor2');
const lblColorFondo = document.getElementById('lblColorFondo');
const colorTexto = document.getElementById('colorTexto');

// Controles Generales
const btnDescargar = document.getElementById('btnDescargar');
const listaPantallas = document.getElementById('listaPantallas');
const btnNuevaPantalla = document.getElementById('btnNuevaPantalla');
const btnEliminarPantalla = document.getElementById('btnEliminarPantalla');
const btnExportar = document.getElementById('btnExportar');
const btnImportar = document.getElementById('btnImportar');
const nombrePlantilla = document.getElementById('nombrePlantilla');

// Herramienta Logo
const logoUpload = document.getElementById('logoUpload');
const btnGenerarIcono = document.getElementById('btnGenerarIcono');

const featureUpload = document.getElementById('featureUpload');
const btnGenerarFeature = document.getElementById('btnGenerarFeature');

// --- CONFIGURACIÓN BASE ---
const config = {
    telefono: { canvasW: 1080, canvasH: 1920, tamanoFuente: "80px", textY: 250, mockupAncho: 800, mockupAlto: 1500, mockupY: 320, bordeX: 18, bordeY: 22, radioEsquina: 45, src: 'mockup.png' },
    tablet: { canvasW: 1600, canvasH: 2560, tamanoFuente: "130px", textY: 350, mockupAncho: 1300, mockupAlto: 1950, mockupY: 450, bordeX: 25, bordeY: 30, radioEsquina: 30, src: 'mockup_tablet.png' }
};

let imgMockup = new Image();
let cfgActual = config.telefono;

// --- ESTADO GLOBAL (MEMORIA DEL PROYECTO) ---
let pantallas = [{
    dispositivo: 'telefono', escala: 100, dX: 0, dY: 0, dRot: 0,
    activo2: false, escala2: 100, dX2: 0, dY2: 0, dRot2: 0, imagenSrc2: null, imgObj2: null,
    titulo: '¡Descarga mi App!', tX: 0, tY: 0, tRot: 0, fuenteFamiliar: 'sans-serif', conSombra: false,
    tipoFondo: 'solido', colorFondo: '#2c3e50', colorFondo2: '#1a252f', colorTexto: '#ffffff', 
    imagenSrc: null, imgObj: null
}];
let indiceActual = 0; 

// --- FUNCIONES DEL GESTOR DE PANTALLAS ---
function renderizarBotonesPantallas() {
    listaPantallas.innerHTML = ''; 
    pantallas.forEach((pantalla, index) => {
        const btn = document.createElement('button');
        btn.classList.add('btn-pantalla');
        if (index === indiceActual) btn.classList.add('activa');
        btn.textContent = `${index + 1}`; 
        btn.addEventListener('click', () => cambiarPantalla(index));
        listaPantallas.appendChild(btn);
    });
}

function actualizarUIFondo() {
    if (tipoFondo.value === 'degradado') {
        grupoColor2.style.display = 'block';
        lblColorFondo.textContent = 'Fondo (Arriba):';
    } else {
        grupoColor2.style.display = 'none';
        lblColorFondo.textContent = 'Color Fondo:';
    }
}

function guardarEstadoActual() {
    if(!pantallas[indiceActual]) return;
    const p = pantallas[indiceActual];
    
    // Disp 1
    p.dispositivo = tipoDispositivo.value;
    p.escala = parseInt(escalaDispositivo.value); p.dX = parseInt(dispX.value); p.dY = parseInt(dispY.value); p.dRot = parseInt(dispRot.value);
    
    // Disp 2
    p.activo2 = activarDisp2.checked;
    p.escala2 = parseInt(escalaDispositivo2.value); p.dX2 = parseInt(dispX2.value); p.dY2 = parseInt(dispY2.value); p.dRot2 = parseInt(dispRot2.value);
    
    // Texto
    p.titulo = tituloInput.value; p.tX = parseInt(textoX.value); p.tY = parseInt(textoY.value); p.tRot = parseInt(textoRot.value);
    p.fuenteFamiliar = fuenteTexto.value; p.conSombra = sombraTexto.checked;
    
    // Fondo
    p.tipoFondo = tipoFondo.value; p.colorFondo = colorFondo.value; p.colorFondo2 = colorFondo2.value; p.colorTexto = colorTexto.value;
}

function cambiarPantalla(nuevoIndice, guardarPrevio = true) {
    if (guardarPrevio) guardarEstadoActual(); 
    indiceActual = nuevoIndice;
    const p = pantallas[indiceActual];
    
    // Restaurar Disp 1
    tipoDispositivo.value = p.dispositivo;
    escalaDispositivo.value = p.escala || 100; escalaValor.textContent = escalaDispositivo.value + '%';
    dispX.value = p.dX || 0; dispY.value = p.dY || 0; dispRot.value = p.dRot || 0;
    
    // Restaurar Disp 2
    activarDisp2.checked = p.activo2 || false;
    panelDisp2.style.display = activarDisp2.checked ? 'block' : 'none';
    escalaDispositivo2.value = p.escala2 || 100; escalaValor2.textContent = escalaDispositivo2.value + '%';
    dispX2.value = p.dX2 || 0; dispY2.value = p.dY2 || 0; dispRot2.value = p.dRot2 || 0;
    
    // Restaurar Texto
    tituloInput.value = p.titulo; textoX.value = p.tX || 0; textoY.value = p.tY || 0; textoRot.value = p.tRot || 0;
    fuenteTexto.value = p.fuenteFamiliar || 'sans-serif'; sombraTexto.checked = p.conSombra || false;
    
    // Restaurar Fondo
    tipoFondo.value = p.tipoFondo || 'solido'; colorFondo.value = p.colorFondo; colorFondo2.value = p.colorFondo2 || '#1a252f'; colorTexto.value = p.colorTexto;
    actualizarUIFondo();
    
    // Ajustar Canvas
    cfgActual = config[p.dispositivo];
    canvas.width = cfgActual.canvasW; canvas.height = cfgActual.canvasH;
    
    renderizarBotonesPantallas(); 
    cargarMockup(); 
}

btnNuevaPantalla.addEventListener('click', () => {
    guardarEstadoActual();
    pantallas.push({
        dispositivo: tipoDispositivo.value, escala: 100, dX: 0, dY: 0, dRot: 0,
        activo2: false, escala2: 100, dX2: 0, dY2: 0, dRot2: 0, imagenSrc2: null, imgObj2: null,
        titulo: 'Nueva Pantalla', tX: 0, tY: 0, tRot: 0, fuenteFamiliar: fuenteTexto.value, conSombra: sombraTexto.checked,
        tipoFondo: tipoFondo.value, colorFondo: colorFondo.value, colorFondo2: colorFondo2.value, colorTexto: colorTexto.value, imagenSrc: null, imgObj: null
    });
    cambiarPantalla(pantallas.length - 1); 
});

btnEliminarPantalla.addEventListener('click', () => {
    if (pantallas.length === 1) return alert("No puedes eliminar la única pantalla.");
    if (confirm("¿Estás seguro de eliminar esta pantalla?")) {
        pantallas.splice(indiceActual, 1); 
        cambiarPantalla(indiceActual >= pantallas.length ? pantallas.length - 1 : indiceActual, false); 
    }
});

// --- FUNCIONES DE DIBUJO ---
function cargarMockup() {
    imgMockup.src = cfgActual.src;
    imgMockup.onload = dibujarCanvas;
}

function crearCaminoRedondeado(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y); ctx.lineTo(x + width - radius, y); ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius); ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height); ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius); ctx.quadraticCurveTo(x, y, x + radius, y); ctx.closePath();
}

function dibujarCanvas() {
    const p = pantallas[indiceActual];
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. CAPA FONDO
    if (p.tipoFondo === 'degradado') {
        const gradiente = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradiente.addColorStop(0, p.colorFondo);
        gradiente.addColorStop(1, p.colorFondo2 || '#1a252f');
        ctx.fillStyle = gradiente;
    } else {
        ctx.fillStyle = p.colorFondo;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. CAPA TEXTO
    ctx.save(); 
    ctx.translate((canvas.width / 2) + (p.tX || 0), cfgActual.textY + (p.tY || 0));
    ctx.rotate((p.tRot || 0) * Math.PI / 180);
    ctx.fillStyle = p.colorTexto;
    ctx.font = `bold ${cfgActual.tamanoFuente} ${p.fuenteFamiliar}`;
    ctx.textAlign = "center";
    if (p.conSombra) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'; ctx.shadowBlur = 10; ctx.shadowOffsetX = 4; ctx.shadowOffsetY = 4;
    }
    ctx.fillText(p.titulo, 0, 0);
    ctx.restore(); 

    // SUB-FUNCIÓN DIBUJAR DISPOSITIVOS (Maneja rotación y escala independientemente)
    function dibujarDispositivo(escalaVal, dx, dy, dRot, imgApp) {
        ctx.save();
        const escala = (escalaVal || 100) / 100;
        const anchoMock = cfgActual.mockupAncho * escala;
        const altoMock = cfgActual.mockupAlto * escala;
        
        const centroX = (canvas.width / 2) + (dx || 0);
        const centroY = cfgActual.mockupY + (altoMock / 2) + (dy || 0);

        ctx.translate(centroX, centroY);
        ctx.rotate((dRot || 0) * Math.PI / 180);

        const drawX = -anchoMock / 2;
        const drawY = -altoMock / 2;

        if (imgApp) {
            const bordeX = cfgActual.bordeX * escala;
            const bordeY = cfgActual.bordeY * escala;
            const anchoPantalla = anchoMock - (bordeX * 2);
            const altoPantalla = altoMock - (bordeY * 2);
            const posX = drawX + bordeX;
            const posY = drawY + bordeY;
            const radioEsquina = cfgActual.radioEsquina * escala;

            ctx.save();
            crearCaminoRedondeado(ctx, posX, posY, anchoPantalla, altoPantalla, radioEsquina);
            ctx.clip();
            ctx.drawImage(imgApp, posX, posY, anchoPantalla, altoPantalla);
            ctx.restore();
        }

        if (imgMockup.complete && imgMockup.naturalWidth !== 0) {
            ctx.drawImage(imgMockup, drawX, drawY, anchoMock, altoMock);
        }
        ctx.restore();
    }

    // 3. DIBUJAR DISPOSITIVO 2 (SE DIBUJA PRIMERO PARA QUEDAR ATRÁS)
    if (p.activo2) {
        dibujarDispositivo(p.escala2, p.dX2, p.dY2, p.dRot2, p.imgObj2);
    }

    // 4. DIBUJAR DISPOSITIVO 1 (SE DIBUJA DESPUÉS PARA QUEDAR AL FRENTE)
    dibujarDispositivo(p.escala, p.dX, p.dY, p.dRot, p.imgObj);
}

// --- EVENTOS INTERFAZ ---
activarDisp2.addEventListener('change', (e) => {
    panelDisp2.style.display = e.target.checked ? 'block' : 'none';
    guardarEstadoActual(); dibujarCanvas();
});

tipoFondo.addEventListener('change', () => {
    actualizarUIFondo();
    guardarEstadoActual(); dibujarCanvas();
});

const inputs = [
    tituloInput, fuenteTexto, sombraTexto, colorFondo, colorFondo2, colorTexto, tipoDispositivo, 
    escalaDispositivo, dispX, dispY, dispRot, 
    escalaDispositivo2, dispX2, dispY2, dispRot2, 
    textoX, textoY, textoRot
];

inputs.forEach(input => {
    input.addEventListener(input === sombraTexto ? 'change' : 'input', () => {
        if (input === escalaDispositivo) escalaValor.textContent = escalaDispositivo.value + '%';
        if (input === escalaDispositivo2) escalaValor2.textContent = escalaDispositivo2.value + '%';
        
        guardarEstadoActual();
        if(input === tipoDispositivo) {
            cfgActual = config[tipoDispositivo.value];
            canvas.width = cfgActual.canvasW; canvas.height = cfgActual.canvasH;
            cargarMockup();
        } else {
            dibujarCanvas();
        }
    });
});

// --- SUBIDA DE IMÁGENES ---
imagenUpload.addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() { pantallas[indiceActual].imagenSrc = event.target.result; pantallas[indiceActual].imgObj = img; dibujarCanvas(); }
        img.src = event.target.result;
    }
    if(e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
});

imagenUpload2.addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() { pantallas[indiceActual].imagenSrc2 = event.target.result; pantallas[indiceActual].imgObj2 = img; dibujarCanvas(); }
        img.src = event.target.result;
    }
    if(e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
});

// --- DESCARGAR Y GUARDAR ---
btnDescargar.addEventListener('click', () => {
    const enlace = document.createElement('a');
    enlace.download = `pantalla_${indiceActual + 1}_${tipoDispositivo.value}.png`;
    enlace.href = canvas.toDataURL('image/png');
    enlace.click();
});

btnExportar.addEventListener('click', () => {
    guardarEstadoActual();
    const datosExportar = pantallas.map(p => ({
        dispositivo: p.dispositivo, escala: p.escala, dX: p.dX, dY: p.dY, dRot: p.dRot,
        activo2: p.activo2, escala2: p.escala2, dX2: p.dX2, dY2: p.dY2, dRot2: p.dRot2, imagenSrc2: p.imagenSrc2,
        titulo: p.titulo, tX: p.tX, tY: p.tY, tRot: p.tRot, fuenteFamiliar: p.fuenteFamiliar, conSombra: p.conSombra,
        tipoFondo: p.tipoFondo, colorFondo: p.colorFondo, colorFondo2: p.colorFondo2, colorTexto: p.colorTexto, imagenSrc: p.imagenSrc
    }));
    const jsonString = JSON.stringify(datosExportar, null, 2);
    let nArchivo = nombrePlantilla.value.trim() || "mi_proyecto";
    if (!nArchivo.endsWith('.json')) nArchivo += ".json";
    const blob = new Blob([jsonString], { type: "application/json" });
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(blob); enlace.download = nArchivo; enlace.click();
});

btnImportar.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const datosGuardados = JSON.parse(event.target.result);
            pantallas = datosGuardados.map(p => {
                let imgTemp = null; let imgTemp2 = null;
                if (p.imagenSrc) { imgTemp = new Image(); imgTemp.src = p.imagenSrc; imgTemp.onload = () => { dibujarCanvas(); } }
                if (p.imagenSrc2) { imgTemp2 = new Image(); imgTemp2.src = p.imagenSrc2; imgTemp2.onload = () => { dibujarCanvas(); } }
                return { ...p, imgObj: imgTemp, imgObj2: imgTemp2 };
            });
            cambiarPantalla(0, false); 
        } catch (error) {
            alert("El archivo de proyecto no es válido."); console.error(error);
        }
    };
    reader.readAsText(file); e.target.value = ""; 
});

// --- HERRAMIENTA EXTRA: ICONO PLAY STORE 512x512 ---
btnGenerarIcono.addEventListener('click', () => {
    if (!logoUpload.files || logoUpload.files.length === 0) {
        alert("Por favor, selecciona tu logo primero en el botón de arriba.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const imgLogo = new Image();
        imgLogo.onload = function() {
            const canvasIcono = document.createElement('canvas');
            canvasIcono.width = 512;
            canvasIcono.height = 512;
            const ctxIcono = canvasIcono.getContext('2d');

            ctxIcono.drawImage(imgLogo, 0, 0, 512, 512);

            const enlace = document.createElement('a');
            enlace.download = 'icono_playstore_512x512.png';
            enlace.href = canvasIcono.toDataURL('image/png');
            enlace.click();
            logoUpload.value = ""; 
        };
        imgLogo.src = event.target.result;
    };
    reader.readAsDataURL(logoUpload.files[0]);
});

btnGenerarFeature.addEventListener('click', () => {
    if (!featureUpload.files || featureUpload.files.length === 0) {
        alert("Por favor, selecciona una imagen para el gráfico de funciones.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const imgFeature = new Image();
        imgFeature.onload = function() {
            const canvasFeature = document.createElement('canvas');
            canvasFeature.width = 1024;
            canvasFeature.height = 500;
            const ctxFeature = canvasFeature.getContext('2d');

            // Importante: Google Play no permite gráficos de funciones con fondo transparente.
            // Pintamos un fondo blanco base por si la imagen original es un PNG transparente.
            ctxFeature.fillStyle = '#ffffff';
            ctxFeature.fillRect(0, 0, 1024, 500);

            // Dibujamos la imagen subida ajustándola a las proporciones
            ctxFeature.drawImage(imgFeature, 0, 0, 1024, 500);

            const enlace = document.createElement('a');
            enlace.download = 'grafico_funciones_1024x500.png';
            enlace.href = canvasFeature.toDataURL('image/png');
            enlace.click();
            
            featureUpload.value = ""; 
        };
        imgFeature.src = event.target.result;
    };
    reader.readAsDataURL(featureUpload.files[0]);
});

// --- INICIALIZACIÓN ---
renderizarBotonesPantallas();
actualizarUIFondo();
cargarMockup();