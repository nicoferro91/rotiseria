let compraFinalizada = false;

// Recibimos el input del usuario
function getUser() {
    let nombre = sessionStorage.getItem("miNombre");
    if(!nombre) 
    {
        (async () => {
            await Swal.fire({
            title: 'Contanos tu nombre',
            input: 'text',
            inputPlaceholder: 'Nombre...',
            inputValidator: (value) => {
                if (!value) {
                return "Escribi algo!"
                }
                else if(value.length>10) {
                    return "10 caracteres o menos por favor"
                }
                displayUser(value);
            }
            })
        })()
    }
    else {
        displayUser(nombre)
    }
}
getUser();

// Mostramos el nombre del usuario
function displayUser(nombre) {
    sessionStorage.setItem("miNombre", nombre)
    let welcome=document.getElementById("bienvenida");
    welcome.innerText = "Bienvenido " + nombre + "!";
}

// Chequeamos si la compra ya fue hecha
function compraVieja() {
    let compraAnterior = JSON.parse(sessionStorage.getItem("miCompra"))
    if(compraAnterior)
    {
        crearRecibo(compraAnterior);
        compraFinalizada = true;
    }
}

// Chequeamos una compra parcial, que sumo al carrito pero no compró
let carritoKiller = false;
function compraParcial() {
    let compraParcial = JSON.parse(sessionStorage.getItem("miCompraParcial"));
    if(compraParcial!==0)
    {
        console.log("compra parcial encontrada")
        displayCarrito()
        for(let item in compraParcial)
        {
            let cambio = document.getElementById("cant"+item);
            cambio.setAttribute("value",compraParcial[item]);
            let carrito = document.getElementById("carrito");
            if(compraParcial[item]>0)
            {
                let comprado = document.createElement("li");
                comprado.innerText = Object.keys(menuBase)[item]+ ": " + compraParcial[item];
                carrito.append(comprado)                
            }                      
        }

    }
    else
    {
        console.log("compra parcial NO encontrada")
    }
}

function cargarParcial(clase){
    const items = document.getElementsByClassName(clase);
    while(items.length > 0){
        items[0].parentNode.removeChild(items[0]);
    }
}



// Cargando el menu
function displayMenu(menu)
{
    let contador = 0;
    let lista = document.getElementById("menu__lista");
    for (let producto in menu)
    {
        let item = document.createElement("li");
        item.innerText = producto+": $"+menu[producto];
        lista.append(item);
        let cant = document.createElement("input");
        cant.setAttribute("type","number");
        cant.setAttribute("min","0");
        cant.setAttribute("max","24");
        cant.setAttribute("oninput","this.value = Math.abs(this.value)");
        cant.setAttribute("step","1");
        cant.setAttribute("class","pedido");
        cant.setAttribute("value","0")
        cant.id="cant"+contador;
        contador++;
        lista.append(cant);
    }
    let item = document.createElement("p");
    item.innerText = "Envio: $"+envio;
    lista.append(item);
}
const envio = 50;

// Cargamos el menu que es un objeto
let url = "data/menuBase.json";
fetch(url)
.then((res)=>res.json())
.then((data)=> menuBase = data)
const getMenu = (menu) => new Promise( (resolve, reject) => {
        let loadingMenu = document.getElementById("menu")
        let loading = document.createElement("h3")
        loading.innerText = "Cargando menu..."
        loading.id = "cargandoMenu"
        loadingMenu.append(loading)
        setTimeout(() => {
            if(menu)
            {
                resolve("menu cargado")                
            }
            else
            {
                reject("error con menu")
            }
        }, 500);
    });

getMenu(menu)
    .then((response)=>{
        console.log(response) 
        displayMenu(menuBase)
        // Ejecutamos las funciones principales
        compraParcial()
        compraVieja()
        chequeoCompra()
        hacerPedido() })
    .catch((error)=>{
        console.log(error)})
    .finally( ()=>{
        loading = document.getElementById("cargandoMenu");
        loading.remove();
    })

// Para cada producto nuevo
class Agregado {
    constructor(nombre, cantidad) 
    {
        this.nombre = nombre;
        this.cantidad = cantidad;
    }
}

let id = 1;
let compras = []
let i = 0;

// El chequeo de cada producto
function chequeoCompra()
{
    let i = 0;
    for(let producto in menuBase)
    {
        let item = document.getElementById("cant"+i)
        item.onchange = ()=> 
        {
            displayCarrito();
            // Limitamos a 24 unidades de cada producto
            if(item.value>24) item.value=24;
            let sumado = new Agregado(producto,item.value)
            if(compras.length==0) compras.push(sumado)
            else {
                let falta=0;
                for(let agregados in compras)
                {
                    let nuevo = (Object.values(compras[agregados]))[0]
                    // Chequeamos si el nuevo producto ya está en el carrito para no repetir
                    if(producto==nuevo) {
                        compras[agregados] = sumado;
                        falta=0;
                    }
                    else falta=1;
                }   // Si falta lo agregamos al array sumado
                if(falta==1)
                {
                    compras.push(sumado)
                }
            }   // Antes de mandar removemos los productos con cantidad cero
            for(let agregados in compras)
            {
                let chequeoCero = (Object.values(compras[agregados]))[1]
                if(chequeoCero==0)
                {
                    compras.splice(agregados, 1)
                }
            }
            updateCarrito(compras)
        }
        i++;
    }
}

function displayCarrito()
{
    let carrito = document.getElementById("carrito-box");
    carrito.style.opacity = "100";
}

// Vamos actualizando el carrito borrando lo que habia antes para no duplicar
function updateCarrito()
{
    if(!compraFinalizada)
    {
        let carrito = document.getElementById("carrito");
        while(carrito.firstChild)
        {
            carrito.firstChild.remove()
        }
        let cantidades = contarCantidades();
        for(let item in cantidades)
        {
            if(cantidades[item]>0)
            {
                let comprado = document.createElement("li");
                comprado.innerText = Object.keys(menuBase)[item]+ ": " + cantidades[item];
                carrito.append(comprado)
            }
        }
    }
}
            
// El checkout al comprar
function hacerPedido()
{
    let botonCompra=document.getElementById("botonCompra");
    botonCompra.addEventListener("click", ()=>{
        if (!compraFinalizada)
        {   // Chequeamos que el usuario haya comprado por lo menos un producto al comprar
            let cantidades = contarCantidades();
            if (cantidades==0)
            {
                Swal.fire({
                    icon: 'error',
                    text: 'Comprá un producto por lo menos',
                })
            }
            else
            {
                Swal.fire({
                title: 'Estas seguro?',
                text: "No se aceptan devoluciones",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, comprar!'
                }).then((result) => {
                if (result.isConfirmed) 
                {
                    compraFinalizada = true;
                    guardarCompra(cantidades);
                    crearRecibo(cantidades);
                    Swal.fire(  'Perfecto!',
                                'Ya estamos haciendo tu pedido',
                                'success' )
                }})
            }
        }
        else
        {   // Mensaje de error cuando el usuario clickea comprar despues de haber comprado
            Swal.fire({
                icon: 'error',
                title: 'Paciencia',
                text: 'Tu pedido ya está en camino!',
                footer: '<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Por que tengo que esperar tanto?</a>'
            })
        }
    }
    )
}

// Contamos las cantidades de cada input
function contarCantidades()
{
    let cantTotal = 0;
    let error = document.getElementById("recibo--error");
    error.innerText="";
    let cantidades = [];
    let cantMenu = Object.keys(menuBase).length;
    for (let i=0; i<cantMenu; i++)
    {
        let prod = document.getElementById("cant"+i);
        prod.value<25 ? cantidades[i] = prod.value : cantidades[i] = 24;
        cantTotal = cantTotal + parseInt(prod.value)
    }
    if(cantTotal==0) return 0;
    else return cantidades;
}

// Creamos el recibo de la compra
function crearRecibo(cantidades) {
    let caja = document.getElementById("caja")
    let importe = 0;
    while(caja.firstChild) carrito.firstChild.remove();
    for(let cantidad in cantidades)
    {
        importe += cantidades[cantidad]* Object.values(menuBase)[cantidad];
        if(cantidades[cantidad] > 0)
        {
            cantidades[cantidad] > 1 ? plural="s" : plural=""
            let comprado = document.createElement("li");
            comprado.setAttribute("class","itemRecibo")
            comprado.innerText = cantidades[cantidad] + " " + Object.keys(menuBase)[cantidad] + plural
            caja.append(comprado);
        }
    }
    let recibo = document.getElementById("recibo");
    let total = document.createElement("li");
    total.setAttribute("class","itemRecibo")
    total.innerText="$"+(importe+envio);
    recibo.append(total);
    nutriBoton(cantidades);
}

// Display de informacion nutricional
// Queria usar una API para esto pero no encontré una gratis que me funcione
function nutriBoton(cantidades)
{
    let nutribox = document.getElementById("nutribox");
    let nutribtn = document.createElement("input");
    nutribtn.setAttribute("type","submit");
    nutribtn.setAttribute("class","info-nutri");
    nutribtn.setAttribute("value","Informacion nutricional");
    nutribox.append(nutribtn);
    nutribtn.addEventListener("click", ()=>calcularNutricion(cantidades))
}

let nutricion = 
{
    Calorias: 0,
    Carbohidratos: 0,
    Proteinas: 0,
    Grasas: 0,
}
let nutriUsada = false;
function calcularNutricion(cantidades)
{
    if(!nutriUsada)
    {
        nutriUsada = true;
        let url = "data/infoNutri.json";
        fetch(url)
        .then((res)=>res.json())
        .then((data)=>
        {
            // let cantidades = contarCantidades();
            for(let item in data)
            {
                nutricion.Calorias += data[item].calorias*cantidades[item];
                nutricion.Carbohidratos += data[item].carbohidratos*cantidades[item];
                nutricion.Proteinas += data[item].proteinas*cantidades[item];
                nutricion.Grasas += data[item].grasas*cantidades[item];
            }
            let nutribox = document.getElementById("nutribox");
            for(let info in nutricion)
            {
                let nutri = document.createElement("li");
                nutri.innerText = info + ": " + nutricion[info]
                nutri.setAttribute("class","nutricion")
                nutribox.append(nutri)
            }
        });
    }
}

// Guardamos la compra en session storage
function guardarCompra(cantidades) {
    const cantJSON = JSON.stringify(cantidades)
    sessionStorage.setItem("miCompra", cantJSON);
}

// Reiniciar y borrar storage
reiniciar();
function reiniciar() {
    let reinicio = document.getElementById("botonReinicio")
    reinicio.addEventListener("click", ()=>{
        console.log("reinicio")
        sessionStorage.removeItem("miCompra");
        sessionStorage.removeItem("miNombre");
        sessionStorage.removeItem("miCompraParcial");
        getUser();
        compraFinalizada = false;
        nutriUsada = false;
        borrarClase("nutricion")
        borrarClase("itemRecibo")
        borrarClase("info-nutri")
        let i=0;
        for(let item in menuBase)
        {
            let borrando = document.getElementById("cant"+i)
            borrando.setAttribute("value","0")
            i++;
        }
        })
}

function borrarClase(clase){
    const items = document.getElementsByClassName(clase);
    while(items.length > 0){
        items[0].parentNode.removeChild(items[0]);
    }
}
jugar();
function jugar() {
    let jugar = document.getElementById("botonJuego")
    jugar.addEventListener("click", ()=>{
        console.log("juego empezado");
        window.location.href = "pages/minijuego.html"
        if(!compraFinalizada)
        {
            let compraParcial = contarCantidades();
            compraParcial = JSON.stringify(compraParcial)
            sessionStorage.setItem("miCompraParcial",compraParcial)
        }
    })
}