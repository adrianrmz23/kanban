const listaPendientes = document.getElementById("pendiente");
const listaProceso = document.getElementById("proceso");
const listaTerminado = document.getElementById("terminado");
const inputTareas = document.getElementById("task-title");
const btnTareas = document.getElementById("add-task-btn");
const contadorPendiente = document.getElementById("contador-pendiente");
const contadorProceso = document.getElementById("contador-proceso");
const contadorTerminado = document.getElementById("contador-terminado");
const selectPrioridad = document.getElementById("task-priority");
const fechaTarea = document.getElementById("task-date");

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
let idTareaEditando = null;

function renderizarTareas() {
    listaPendientes.innerHTML = '';
    listaProceso.innerHTML = '';
    listaTerminado.innerHTML = '';
    let conteo = { pendiente: 0, proceso: 0, terminado: 0 };

    tareas.forEach(tarea => {
        //console.log(tarea);
        document.getElementById(tarea.estado).innerHTML += `
            <div id="${tarea.id}" draggable="true" ondragstart="iniciarArrastre(event)" class="bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing mb-4 relative group">
                <div class="flex justify-between items-start mb-3">
                    <span class="inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider p-${tarea.prioridad}">
                        Prioridad ${tarea.prioridad}
                    </span>
                    
                    <div class="flex gap-1">
                        <button 
                            onclick="cargarDatosTarea('${tarea.id}')" 
                            class="text-slate-400 hover:text-indigo-600 transition-colors p-1 relative z-10 hover:cursor-pointer" 
                            title="Editar tarea">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>

                        <button id="delete"
                            onclick="eliminarTarea('${tarea.id}')" 
                            class="text-slate-400 hover:text-red-500 transition-colors p-1 relative z-10 hover:cursor-pointer" 
                            title="Eliminar tarea">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </button>
                    </div>
                </div>

                <p class="text-slate-700 leading-relaxed font-medium">${tarea.titulo}</p>
                
                <div class="mt-4 flex items-center text-slate-400 text-xs">
                    <span class="flex items-center gap-1">🕒 ${calcularDias(tarea.fecha)} días restantes</span>
                </div>
            </div>
        `;
        conteo[tarea.estado]++;
    });

    contadorPendiente.innerHTML = conteo.pendiente;
    contadorProceso.innerHTML = conteo.proceso;
    contadorTerminado.innerHTML = conteo.terminado;

    localStorage.setItem("tareas", JSON.stringify(tareas));
}


function iniciarArrastre(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function permitirSoltar(event) {
    event.preventDefault();
}

function soltarTarea(event) {
    const idTarea = event.dataTransfer.getData("text");
    const idColumna = event.currentTarget.id;
    const tareaMovida = tareas.find(tarea => tarea.id === idTarea);
    tareaMovida.estado = idColumna;
    renderizarTareas();
}

function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

btnTareas.addEventListener("click", function (e) {

    e.preventDefault();

    if (idTareaEditando !== null) {

        const tareaEditable = tareas.find(tarea => tarea.id === idTareaEditando);
        tareaEditable.titulo = inputTareas.value;
        tareaEditable.prioridad = selectPrioridad.value;
        tareaEditable.fecha = fechaTarea.value;

        idTareaEditando = null;

    } else {

        if (!inputTareas.value) {
            return;
        }

        const uniqueId = generateUniqueId();

        let objTarea = {
            id: uniqueId,
            titulo: inputTareas.value,
            prioridad: selectPrioridad.value,
            fecha: fechaTarea.value,
            estado: "pendiente"
        }

        tareas.push(objTarea);
    }

    inputTareas.value = '';
    selectPrioridad.value = '';
    fechaTarea.value = '';
    renderizarTareas();

});

function eliminarTarea(id) {
    tareas = tareas.filter(tarea => tarea.id != id);
    renderizarTareas();
}

function calcularDias(fechaLimite) {
    const diferenciaDias = new Date(fechaLimite) - Date.now();
    const diasRestantes = diferenciaDias / (1000 * 60 * 60 * 24);
    return Math.ceil(diasRestantes);
}

function cargarDatosTarea(id) {

    const found = tareas.find(tarea => tarea.id === id);
    inputTareas.value = found.titulo;
    selectPrioridad.value = found.prioridad;
    fechaTarea.value = found.fecha;

    idTareaEditando = id;
}

renderizarTareas();