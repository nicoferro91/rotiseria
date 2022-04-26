
function getUser()
{
    let user = document.getElementById("username");
    let ingresar = document.getElementById("submit");
    let welcome=document.getElementById("bienvenida");
    let username = localStorage.getItem("usuario");
    if(username) welcome.innerText = "Bienvenido " + username + "!";
    ingresar.addEventListener("click", ()=>{
        username=user.value;
        localStorage.setItem("usuario",username)
        welcome.innerText = "Bienvenido " + username + "!";
    })
}

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
        cant.id="cant"+contador;
        contador++;
        lista.append(cant);
    }
    let item = document.createElement("p");
    item.innerText = "Envio: $"+envio;
    lista.append(item);
}

const envio = 50;

getUser();

const menuBase = 
{
    Hamburguesa: 400,
    Milanesa: 500,
    Empanada: 150,
    Pizza: 800,
    Cerveza: 300,
    Agua: 150,
}

class Agregado {
    constructor(nombre, cantidad)
    {
        this.nombre = nombre;
        this.cantidad = cantidad;
    }
}

sessionStorage.setItem("MI_MENU",JSON.stringify(menuBase));
let menu = JSON.parse(sessionStorage.getItem("MI_MENU"));


displayMenu(menu);

let id = 1;
/*
function chequeoCompra()
{
    let carrito = document.getElementById("carrito")
    let contador = 0;
    for(let producto in menu)
    {
        let item = document.getElementById("cant"+contador)
        item.onchange = ()=> {
            let agregado = document.createElement("li")
            agregado.innerText = producto + " " + item.value
            carrito.append(agregado)

        }
        contador++;
    }
}

class Agregado {
    constructor(id, nombre, cantidad){
        this.id = id;
        this.nombre = nombre;
        this.cantidad = cantidad;
    }
}
*/
let compras = []
let i = 0;
function chequeoCompra()
{
    let i = 0;
    for(let producto in menu)
    {
        let item = document.getElementById("cant"+i)
        item.onchange = ()=> {
            let sumado = new Agregado(producto,item.value)

            if(compras.length==0) 
            {
                compras.push(sumado)
            }
            else
            {
                let falta=0;
                for(let agregados in compras)
                {
                    let nuevo = Object.values(compras[agregados])
                    nuevo = nuevo[0]
                    if(producto==nuevo)
                    {
                        compras[agregados] = sumado;
                        falta=0;
                    }
                    else
                    {
                        falta=1;
                    }
                }
                if(falta==1)
                {
                    compras.push(sumado)
                }
            }
            console.log(compras)
            updateCarrito(compras)
        }
        i++;
    }
}
chequeoCompra()

function updateCarrito(compras)
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


function hacerPedido()
{
    let botonCompra=document.getElementById("comprar");
    botonCompra.addEventListener("click", ()=>{
        let caja = document.getElementById("caja")
        let cantidades = contarCantidades();
        let importe = 0;
        for(let cantidad in cantidades)
        {
            importe += cantidades[cantidad]* Object.values(menu)[cantidad];
            if(cantidades[cantidad] > 0)
            {
                cantidades[cantidad] > 1 ? plural="s" : plural=""
                let comprado = document.createElement("li");
                comprado.innerText = cantidades[cantidad] + " " + Object.keys(menu)[cantidad] + plural
                caja.append(comprado);
            }
        }
        let recibo = document.getElementById("recibo");
        importe>envio ? recibo.innerText="$"+(importe+envio) : recibo.innerText="Elegi algo primero"
    })
}

function contarCantidades()
{
    let error = document.getElementById("recibo--error");
    error.innerText="";
    let cantidades = [];
    let cantMenu = Object.keys(menu).length;
    for (let i=0; i<cantMenu; i++)
    {
        let prod = document.getElementById("cant"+i);
        prod.value<25 ? cantidades[i] = prod.value : error.innerText="Por favor 24 unidades o menos de cada producto"
    }
    return cantidades;
}



hacerPedido();
