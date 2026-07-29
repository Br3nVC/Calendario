// ======================================
// CONFIGURACIÓN
// ======================================

const LLAVE_ADMIN = "ADMIN2026";

const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
];

const hoy = new Date();

let mesActual = hoy.getMonth();
let añoActual = hoy.getFullYear();

let fechaSeleccionada = "";

let usuarioActual = "visitante";

// ======================================
// ELEMENTOS DEL DOM
// ======================================

const contenedorDias = document.getElementById("dias");
const tituloMes = document.getElementById("mes");

const estadoUsuario = document.getElementById("estadoUsuario");

const panelAdmin = document.getElementById("panelAdmin");

const btnLogin = document.getElementById("btnLogin");

const btnLogout = document.getElementById("btnLogout");

const ventanaLogin = document.getElementById("ventanaLogin");

const inputLlave = document.getElementById("llaveLogin");

const errorLogin = document.getElementById("errorLogin");


document.getElementById("btnLogin")
.addEventListener("click", abrirLogin);

document.getElementById("btnLogout")
.addEventListener("click", cerrarSesion);

document.getElementById("btnMes")
.addEventListener("click", () => {
    mostrarVista("mes");
});

document.getElementById("btnAnio")
.addEventListener("click", () => {
    mostrarVista("año");
});

document.getElementById("btnEntrar")
.addEventListener("click", validarLogin);

document.getElementById("btnCancelarLogin")
.addEventListener("click", cerrarLogin);


// ======================================
// LOGIN
// ======================================

function abrirLogin() {

    inputLlave.value = "";

    errorLogin.textContent = "";

    ventanaLogin.style.display = "flex";

    inputLlave.focus();

}

function cerrarLogin() {

    ventanaLogin.style.display = "none";

    inputLlave.value = "";

    errorLogin.textContent = "";

}

function validarLogin() {

    const llave = inputLlave.value.trim();

    if (llave === LLAVE_ADMIN) {

        usuarioActual = "admin";

        sessionStorage.setItem("usuario", "admin");

        actualizarInterfazUsuario();

        cerrarLogin();

        alert("Bienvenido Administrador");

        return;

    }

    errorLogin.textContent = "Llave incorrecta";

}

function cerrarSesion() {

    if (!confirm("¿Desea cerrar la sesión?")) {

        return;

    }

    usuarioActual = "visitante";

    sessionStorage.removeItem("usuario");

    actualizarInterfazUsuario();

    alert("Sesión cerrada");

}

// ======================================
// ACTUALIZAR INTERFAZ
// ======================================

function actualizarInterfazUsuario() {

    if (usuarioActual === "admin") {

        estadoUsuario.textContent = "Administrador";

        panelAdmin.style.display = "block";

        btnLogin.style.display = "none";

        btnLogout.style.display = "inline-block";

    }

    else {

        estadoUsuario.textContent = "Modo visitante";

        panelAdmin.style.display = "none";

        btnLogin.style.display = "inline-block";

        btnLogout.style.display = "none";

    }

}

// ======================================
// RESTAURAR SESIÓN
// ======================================

function restaurarSesion() {

    const usuario = sessionStorage.getItem("usuario");

    if (usuario === "admin") {

        usuarioActual = "admin";

    }

    else {

        usuarioActual = "visitante";

    }

    actualizarInterfazUsuario();

}

// ======================================
// EVENTOS
// ======================================

function obtenerEventos() {

    return JSON.parse(localStorage.getItem("eventos")) || {};

}

function guardarEventos(datos) {

    localStorage.setItem(
        "eventos",
        JSON.stringify(datos)
    );

}

// ======================================
// FORMATO DE FECHA
// ======================================

function formatearFecha(año, mes, dia) {

    return `${año}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

}

// ======================================
// CALENDARIO MENSUAL
// ======================================

function dibujarCalendario() {

    contenedorDias.innerHTML = "";

    tituloMes.textContent = `${meses[mesActual]} ${añoActual}`;

    const primerDia = new Date(añoActual, mesActual, 1).getDay();

    const totalDias = new Date(añoActual, mesActual + 1, 0).getDate();

    const eventos = obtenerEventos();

    // Espacios vacíos antes del primer día

    for (let i = 0; i < primerDia; i++) {

        const espacio = document.createElement("div");

        contenedorDias.appendChild(espacio);

    }

    // Crear cada día

    for (let diaNumero = 1; diaNumero <= totalDias; diaNumero++) {

        const dia = document.createElement("div");

        dia.className = "dia";

        dia.textContent = diaNumero;

        // Fecha del día

        const fecha = formatearFecha(
            añoActual,
            mesActual,
            diaNumero
        );

        // Resaltar el día actual

        if (

            diaNumero === hoy.getDate() &&
            mesActual === hoy.getMonth() &&
            añoActual === hoy.getFullYear()

        ) {

            dia.classList.add("hoy");

        }

        // Mostrar punto rojo si tiene eventos

        if (eventos[fecha] && eventos[fecha].length > 0) {

            dia.classList.add("tiene-evento");

        }

        // Mantener seleccionado

        if (fechaSeleccionada === fecha) {

            dia.classList.add("seleccionado");

        }

        // Al hacer clic

        dia.onclick = () => {

            document
                .querySelectorAll(".dia")
                .forEach(d => d.classList.remove("seleccionado"));

            dia.classList.add("seleccionado");

            fechaSeleccionada = fecha;

            document.getElementById("fechaSeleccionada").textContent = fecha;

            mostrarEventos();
        };

        contenedorDias.appendChild(dia);

    }

}

// ======================================
// BOTÓN MES ANTERIOR
// ======================================

document.getElementById("anterior").onclick = () => {

    mesActual--;

    if (mesActual < 0) {

        mesActual = 11;

        añoActual--;

    }

    fechaSeleccionada = "";

    document.getElementById("fechaSeleccionada").textContent =
        "Selecciona un día";

    dibujarCalendario();

    document.getElementById("listaEventos").innerHTML = "";

};

// ======================================
// BOTÓN MES SIGUIENTE
// ======================================

document.getElementById("siguiente").onclick = () => {

    mesActual++;

    if (mesActual > 11) {

        mesActual = 0;

        añoActual++;

    }

    fechaSeleccionada = "";

    document.getElementById("fechaSeleccionada").textContent =
        "Selecciona un día";

    dibujarCalendario();

    document.getElementById("listaEventos").innerHTML = "";

}

// ======================================
// MOSTRAR EVENTOS
// ======================================

function mostrarEventos() {

    const lista = document.getElementById("listaEventos");

    lista.innerHTML = "";

    if (fechaSeleccionada === "") {

        return;

    }

    const eventos = obtenerEventos();

    if (!eventos[fechaSeleccionada]) {

        return;

    }

    eventos[fechaSeleccionada].forEach((evento, indice) => {

        const li = document.createElement("li");

        li.textContent = evento;

        // Botón eliminar (solo administrador)

        if (usuarioActual === "admin") {

            const boton = document.createElement("button");
            
            boton.textContent = "🗑";
            
            boton.className = "btn-eliminar";


            boton.style.marginLeft = "10px";

            boton.onclick = () => {

                if (!confirm("¿Eliminar este evento?")) {

                    return;

                }

                eventos[fechaSeleccionada].splice(indice, 1);

                if (eventos[fechaSeleccionada].length === 0) {

                    delete eventos[fechaSeleccionada];

                }

                guardarEventos(eventos);

                mostrarEventos();

                dibujarCalendario();

            };

            li.appendChild(boton);

        }

        lista.appendChild(li);

    });

}

// ======================================
// AGREGAR EVENTO
// ======================================

document.getElementById("guardarEvento").onclick = () => {

    if (usuarioActual !== "admin") {

        alert("Solo el administrador puede agregar eventos.");

        return;

    }

    if (fechaSeleccionada === "") {

        alert("Seleccione un día.");

        return;

    }

    let texto = document
        .getElementById("textoEvento")
        .value
        .trim();

    if (texto === "") {

        alert("Escriba un evento.");

        return;

    }
    
    if (texto.length > 100) {

    alert("El evento no puede superar los 100 caracteres.");

    return;

}
    const eventos = obtenerEventos();

    if (!eventos[fechaSeleccionada]) {

        eventos[fechaSeleccionada] = [];

    }

    eventos[fechaSeleccionada].push(texto);

    guardarEventos(eventos);

    document.getElementById("textoEvento").value = "";

    mostrarEventos();

    dibujarCalendario();

};

// ======================================
// ACTUALIZAR EVENTOS AL CAMBIAR DE USUARIO
// ======================================

const actualizarInterfazOriginal = actualizarInterfazUsuario;

actualizarInterfazUsuario = function () {

    actualizarInterfazOriginal();

    mostrarEventos();

}

// ======================================
// CAMBIAR ENTRE VISTAS
// ======================================

function mostrarVista(vista) {

    const vistaMes = document.getElementById("vistaMes");
    const vistaAño = document.getElementById("vistaAño");

    if (vista === "mes") {

        vistaMes.style.display = "flex";
        vistaAño.style.display = "none";

        return;
    }

    vistaMes.style.display = "none";
    vistaAño.style.display = "block";

    crearCalendarioAnual();

}

// ======================================
// CALENDARIO ANUAL
// ======================================

function crearCalendarioAnual() {

    const contenedor = document.getElementById("calendarioAño");

    const titulo = document.getElementById("tituloAño");

    contenedor.innerHTML = "";

    titulo.textContent = `Calendario ${añoActual}`;

    const eventos = obtenerEventos();

    for (let mes = 0; mes < 12; mes++) {

        const caja = document.createElement("div");
        caja.className = "mini-mes";

        const nombre = document.createElement("h3");
        nombre.textContent = meses[mes];

        caja.appendChild(nombre);

        const dias = document.createElement("div");
        dias.className = "mini-dias";

        const primerDia = new Date(añoActual, mes, 1).getDay();
        const totalDias = new Date(añoActual, mes + 1, 0).getDate();

        // Espacios vacíos

        for (let i = 0; i < primerDia; i++) {

            dias.appendChild(document.createElement("div"));

        }

        // Días del mes

        for (let d = 1; d <= totalDias; d++) {

            const numero = document.createElement("div");

            numero.className = "mini-dia";

            numero.textContent = d;

            const fecha = formatearFecha(añoActual, mes, d);

            // Marcar si tiene eventos

            if (eventos[fecha]) {

                numero.style.background = "#ffb3b3";

            }
            numero.onclick = () => {
                
                mesActual = mes;
                
                fechaSeleccionada = "";
                
                document.getElementById("fechaSeleccionada").textContent = "Selecciona un día";
                
                mostrarVista("mes");
                
                dibujarCalendario();
            };


            dias.appendChild(numero);

        }

        caja.appendChild(dias);

        contenedor.appendChild(caja);

    }

}

// ======================================
// INICIALIZACIÓN
// ======================================

window.onload = () => {

    restaurarSesion();

    mostrarVista("mes");

    dibujarCalendario();

};

// ======================================
// ENTER PARA INICIAR SESIÓN
// ======================================

inputLlave.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        validarLogin();
        
    }

});

        document.addEventListener("keydown", function(e){

    if(e.key === "Escape"){

        cerrarLogin();

    }

});
