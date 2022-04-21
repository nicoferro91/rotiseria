const envio = 50;

function getUser()
{
    let user = document.getElementById("username");
    let ingresar = document.getElementById("submit");
    let welcome=document.getElementById("bienvenida");
    let username = localStorage.getItem("usuario");
    if(username) welcome.innerText = "Bienvenido " + username + "!";
    ingresar.addEventListener("click", displayUser)
    function displayUser()
    {
        let username=user.value;
        localStorage.setItem("usuario",username)
        let welcome=document.getElementById("bienvenida");
        welcome.innerText = "Bienvenido " + username + "!";
    }
}

getUser();

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
    let caja = document.getElementById("menu")
    let item = document.createElement("p");
    item.innerText = "Envio: $"+envio;
    lista.append(item);
}



const menuBase = 
{
    hamburguesa: 400,
    milanesa: 500,
    empanada: 150,
    pizza: 800,
    cerveza: 300,
    agua: 150,
}

sessionStorage.setItem("MI_MENU",JSON.stringify(menuBase));
let menu = JSON.parse(sessionStorage.getItem("MI_MENU"));


displayMenu(menu);

let id = 1;

function hacerPedido()
{
    let botonCompra=document.getElementById("comprar");
    botonCompra.addEventListener("click", ()=>{
        let cantidades = contarCantidades();
        let importe = 0;
        for(let cantidad in cantidades)
        {
            importe += cantidades[cantidad]* Object.values(menu)[cantidad];
        }
        let recibo = document.getElementById("recibo");
        importe>envio ? recibo.innerText="$"+(importe+envio) : recibo.innerText=""
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
    console.log(cantidades)
    let cantSpread = {...cantidades}
    console.log(cantSpread)
    return cantidades;
}

hacerPedido();
