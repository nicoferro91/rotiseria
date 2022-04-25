
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

sessionStorage.setItem("MI_MENU",JSON.stringify(menuBase));
let menu = JSON.parse(sessionStorage.getItem("MI_MENU"));


displayMenu(menu);

let id = 1;

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
