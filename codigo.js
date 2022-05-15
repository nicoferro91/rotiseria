// Recibimos el input del usuario y lo mostramos
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
        getUser(value);
      }
    })   
    })()

function getUser(nombre) {
    let welcome=document.getElementById("bienvenida");
    welcome.innerText = "Bienvenido " + nombre + "!";
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
let url = "menuBase.json";
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
let primeraCompra = false;

// El chequeo de cada producto
function chequeoCompra()
{
    let i = 0;
    for(let producto in menuBase)
    {
        let item = document.getElementById("cant"+i)
        item.onchange = ()=> 
        {
            if(!primeraCompra)
            {
                primeraCompra=true;
                displayCarrito();
            }
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
                }
                // Si falta lo agregamos al array sumado
                if(falta==1)
                {
                    compras.push(sumado)
                }
            }
            // Antes de mandar removemos los productos con cantidad cero
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
    console.log("aparece el carrito")
    carrito.style.opacity = "100";
    /*
    let id = null;
    let pos = 0;
    clearInterval(id)
    id = setInterval(frame,5);
    function frame() {
        if(pos == 350) clearInterval(id)
        else {
            pos++;
            carrito.style.top = pos + "px";
            carrito.style.left = pos + "px";
            carrito.style.backgroundColor = "blue";
        }
    }
    */
}

// Vamos actualizando el carrito borrando lo que habia antes para no duplicar
function updateCarrito(compras)
{
    if(!compraFinalizada)
    {
        let carrito = document.getElementById("carrito")
        while(carrito.firstChild)
        {
            carrito.firstChild.remove()
        }
        for(let comprados in compras)
        {
            let comprado = document.createElement("li");
            comprado.innerText = Object.values(compras[comprados])[0] + ": " + Object.values(compras[comprados])[1]
            carrito.append(comprado)
        }
    }
}
let compraFinalizada = false;
let finalizado = false;

// Chequeamos que el usuario haya comprado por lo menos un producto al comprar
function chequeoCompraVacia()
{
    let compraVacia = false;
    return compraVacia;
}

// El checkout al comprar
function hacerPedido()
{
    let botonCompra=document.getElementById("comprar");
    botonCompra.addEventListener("click", ()=>{
        if (!finalizado)
        {
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
                    finalizado = true;
                    compraFinalizada = true;
                    nutriBoton();
                    Swal.fire(  'Perfecto!',
                                'Ya estamos haciendo tu pedido',
                                'success' )
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
                            comprado.innerText = cantidades[cantidad] + " " + Object.keys(menuBase)[cantidad] + plural
                            caja.append(comprado);
                        }
                    }
                    let recibo = document.getElementById("recibo");
                    recibo.innerText="$"+(importe+envio);
                }})
            }
        }
        else
        {
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

function nutriBoton()
{
    let nutribox = document.getElementById("nutribox");
    let nutribtn = document.createElement("input");
    nutribtn.setAttribute("type","submit");
    nutribtn.setAttribute("class","info-nutri");
    nutribtn.setAttribute("value","Informacion nutricional");
    nutribox.append(nutribtn);
    nutribtn.addEventListener("click", ()=>calcularNutricion())
}

let nutricion = 
{
    Calorias: 0,
    Carbohidratos: 0,
    Proteinas: 0,
    Grasas: 0,
}
let nutriUsada = false;
function calcularNutricion()
{
    if(!nutriUsada)
    {
        nutriUsada = true;
        let url = "infoNutri.json";
        fetch(url)
        .then((res)=>res.json())
        .then((data)=>
        {
            let cantidades = contarCantidades();
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