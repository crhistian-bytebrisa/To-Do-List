let inpB = document.getElementById("buscart");
let select = document.getElementById("filtro");
let inpT = document.getElementById("titulo");
let inpD = document.getElementById("descripcion");
let mostarbtn = document.getElementById("agregar");
let enviarbtn = document.getElementById("enviar");
let salirbtn = document.getElementById("salir");
let divItems = document.getElementById("items");
let menuAdd = document.getElementById("menu-add");
let conteo = document.getElementById("conteo");
let lista = localStorage.getItem("lista") != null? JSON.parse(localStorage.getItem("lista")) : [];
let id = localStorage.getItem("id") != null? Number(localStorage.getItem("id")) : 0;
let listaActual = lista;

MostrarLista();   

//Guarda los datos en el Local Storage
function GuardarDatos()
{
    localStorage.setItem("lista", JSON.stringify(lista));
    localStorage.setItem("id",id);
}

function Contador(){
    let pendientes = lista.filter(x => x.completa === false);
    conteo.textContent = pendientes.length;
}

//Valida los datos cuando crear una tarea
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

//Busca la tarea que contenga el texto que le mandes
function Buscar() {
    let texto = inpB.value;
    let filtro = select.value;
    NuevaLista = lista.filter(x => x.titulo.trim().toUpperCase().includes(texto.trim().toUpperCase()));

    if(filtro === "Todas")
    {
        listaActual = NuevaLista;
    }
    if(filtro === "Pendientes")
    {
        listaActual = NuevaLista.filter(x => x.completa === false);    
    }
    if(filtro === "Completas")
    {
        listaActual = NuevaLista.filter(x => x.completa === true);    
    }   

    MostrarLista();
}

//Se encarga tomar los datos de los inputs (titulu y descripcion) y crea la tarea
//en el apartado visual y en el Local Storage
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
    inpT.value = "";
    inpD.value = "";
    OcultarMenu();
    Buscar();
    Contador();
}

//Introduces la clase tarea que se saca del Local Storage y te devuelve el componente
//de la misma, con los botones funcionando y demas
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
        EliminarTarea(divItems,vista)
    };
    eliminar.classList.add("delete-button")
    abajo.appendChild(eliminar);

    if(!tarea.completa)
    {
        terminar.textContent = "Terminar";  
        terminar.id = "BTT" + tarea.id;
        terminar.onclick = () => {
            CompletarTarea(vista)        
        };
        terminar.classList.add("complete-button")
        abajo.appendChild(terminar);
    }
    else{        
        vista.classList.add("complete-card")
    }

    arriba.id = "SectionU" + tarea.id;
    arriba.classList.add("section-up");

    abajo.id = "SectionD" + tarea.id;
    abajo.classList.add("section-down");

    vista.append(arriba,abajo);
    vista.classList.add("task-card");
    return vista;    
}

//Se encarga de eliminar la tarea de la parte visual y el Local Storage, el div es el divItems
//para poder saber el padre de la card, que es el componente creado de la tarea de ahi sacaremos 
//el elemento HTML para eliminar del padre (div) y el id de la tarea
function EliminarTarea(div, card)
{
    if(confirm("Estas seguro de eliminar esta tarea?"))
    {
        let id = Number(card.id.replace("div",""));
        let index = lista.findIndex(x => x.id == id);
        if(index != null)
        {
            lista.splice(index,1);
            GuardarDatos();
        }       
        div.removeChild(card);
    }
}

//Te completa la tarea tanto en el Local Storage como en el apartado visual, la card es el componente,
//se nececita para poder cambiarle su clase, y tomar su ID para los cambios.
function CompletarTarea(card)
{
    let id = Number(card.id.replace("div",""));
    let cardsection = document.getElementById("SectionD"+id);
    let botonterminar = document.getElementById("BTT"+id);
    if(confirm("Estas seguro que la completaste?"))
    {        
        let index = lista.findIndex(x => x.id == id);
        if(index != null)
        {
            lista[index].completa = true;
            cardsection.removeChild(botonterminar);
            GuardarDatos();
        }
        card.classList.add("complete-card");
        Contador();
    }
}

//Simplemente crea todos los componentes en base a tu datos del Local Storage, se ejecuta recien se abre la web
function MostrarLista(){
    divItems.innerHTML = '';
    divItems.classList.add("box-items")
    listaActual.forEach((x) => {
        divItems.appendChild(CrearComponente(x));
    });
    Contador();
}

function MostrarMenu(){
    menuAdd.classList.remove("oculto");
    menuAdd.classList.add("mostrar");
}

function OcultarMenu(){
    menuAdd.classList.remove("mostrar");
    menuAdd.classList.add("oculto");
}

enviarbtn.addEventListener("click",() => {
    AgregarTarea();    
})

inpB.addEventListener("input", () =>{
    Buscar();
})

inpT.addEventListener("keydown", (event) =>{
    if(event.key == "Enter")
    {
        AgregarTarea()
    }
})

mostarbtn.addEventListener("click", () =>{
    if(menuAdd.classList.contains("oculto"))
    {
        MostrarMenu();
    } else
    {
        inpT.value = "";
        inpD.value = "";
        OcultarMenu();
    }
})

salirbtn.addEventListener("click", () =>{
    inpT.value = "";
    inpD.value = "";
    OcultarMenu();
})

select.addEventListener("change", () =>{
    Buscar();
})