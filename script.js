let inpB = document.getElementById("buscart");
let buscarbtn = document.getElementById("buscar");
let inpT = document.getElementById("titulo");
let inpD = document.getElementById("descripcion");
let enviarbtn = document.getElementById("enviar");
let divItems = document.getElementById("items");
let lista = localStorage.getItem("lista") != null? JSON.parse(localStorage.getItem("lista")) : [];
let id = localStorage.getItem("id") != null? Number(localStorage.getItem("id")) : 0;

MostrarLista(lista);

function GuardarDatos()
{
    localStorage.setItem("lista", JSON.stringify(lista));
    localStorage.setItem("id",id);
}

function Validar() {
    let mensaje = "";
    if(inpT.value == null || inpT.value.trim() == "")
    {
        mensaje += "El campo de titulo no puede estar vacio.\n";
    }
    if(lista.find(x => x.titulo.trim().toUpperCase() == inpT.value.trim().toUpperCase()) != null)
    {
        mensaje += "El titulo '"+`${inpT.value}` +"' ya existe.\n";
    }
    if(inpD.value == null || inpD.value.trim() == "")
    {
        mensaje += "El campo de descripcion no puede estar vacio.\n";
    }   
    if(mensaje != "")
    {
        alert(mensaje);
        return false;
    }
    return true;
}

function Buscar(texto) {
    const nuevalista = 
        lista.filter(x => x.titulo.trim().toUpperCase().includes(texto.trim().toUpperCase()));
    MostrarLista(nuevalista);
}

function AgregarTarea(){
    if(!Validar())
    {
        return;
    }
    let tarea = {
        id: id,
        titulo: inpT.value,
        descripcion: inpD.value,
        completa: false
    }
    lista.push(tarea);
    id += 1;
    GuardarDatos();
    divItems.appendChild(CrearComponente(tarea));
}

function CrearComponente(tarea)
{
    let vista = document.createElement("div");
    vista.id =  "div" + tarea.id;
    let arriba = document.createElement("div");
    let abajo = document.createElement("div");
    let eliminar = document.createElement("button");
    let terminar = document.createElement("button");
    let titulo = document.createElement("h3");
    let descripcion = document.createElement("p");

    titulo.textContent = tarea.titulo;
    descripcion.textContent = tarea.descripcion;
    arriba.append(titulo,descripcion);

    eliminar.textContent = "Eliminar";
    eliminar.onclick = () =>{
        EliminarTarea(divItems,vista, tarea.id)
    };
    abajo.appendChild(eliminar);

    if(!tarea.completa)
    {
        terminar.value = tarea.id;
        terminar.textContent = "Terminar";  
        abajo.appendChild(terminar);
    }
    
    vista.append(arriba,abajo);
    return vista;    
}

function EliminarTarea(div, element, id)
{
    if(confirm("Estas seguro de eliminar esta tarea?"))
    {
        let index = lista.findIndex(x => x.id == id);
        if(index != null)
        {
            lista.splice(index,1);
            GuardarDatos();
        }       
        div.removeChild(element);
    }
}

function CompletarTarea(div, id)
{
    
}

function MostrarLista(lista){
    divItems.innerHTML = '';
    lista.forEach((x) => {
        divItems.appendChild(CrearComponente(x));
    });
}

enviarbtn.addEventListener("click",() => {
    AgregarTarea();
})

buscarbtn.addEventListener("click", () =>{
    Buscar(inpB.value);
})