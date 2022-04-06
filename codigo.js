const envio = 50;

function getUser()
{
    let user = prompt("Ingresa tu nombre");
    return user;
}

function displayUser(usuario)
{
    let welcome=document.getElementById("bienvenida");
    welcome.innerText = "Bienvenido " + user + "!";
}

let user = getUser();
displayUser();

function displayMenu(menu)
{
    let lista = document.getElementById("menu__lista");
    for (let producto in menu)
    {
        let item = document.createElement("li");
        item.innerText = producto+": $"+menu[producto];
        lista.append(item);
    }
    let caja = document.getElementById("menu")
    let item = document.createElement("p");
    item.innerText = "Envio: $"+envio;
    lista.append(item);
}
const menu = 
{
    hamburguesa: 400,
    milanesa: 500,
    empanada: 150,
    pizza: 800,
    cerveza: 300,
    agua: 150,
}

displayMenu(menu);

let id = 1;
function Pedido(id, producto, cantidad)
{
    this.id = id;
    this.producto = producto;
    this.cantidad = cantidad;
    this.precio = cantidad*menu[producto];
}

const descuentos = [1234,4444,7878,6060,9999];

let importe = 0;
let pedidoTotal = [];
let producto = "a";
let cantidad = 0;
function agregarPedido()
{
    producto = elegirProducto();
    if(producto==="salir")
    {
        return producto;
    }
    cantidad = elegirCantidad();
    const nuevoPedido = new Pedido(id,producto,cantidad);
    id++;
    pedidoTotal.push(nuevoPedido);
    importe=importe+nuevoPedido.precio;
    let recibo = document.getElementById("recibo");
    let compra = document.createElement("li");
    compra.innerText = cantidad+" "+producto+": $"+nuevoPedido.precio;
    recibo.append(compra);
    if((confirm("Queres pedir algo mas?")))
    {
        agregarPedido();
    }
}

function elegirProducto()
{
    producto = prompt("Elegi un producto o salir");
    if (producto==="salir")
    {
        return producto;
    }

    else if(!(producto in menu))
    {
        alert("El producto ingresado no existe");
        return elegirProducto();        
    }
    else
    {
        return producto;
    }
}

function elegirCantidad()
{
    cantidad = parseInt(prompt("Elegi la cantidad"));
    if(isNaN(cantidad))
    {
        alert("Por favor ingrese un numero");
        return elegirCantidad(cantidad);
    }
    else if(cantidad < 1)
    {
        alert("Por favor ingrese una cantidad mayor a cero");
        return elegirCantidad(cantidad);
    }
    else if(cantidad > 50)
    {
        alert("Por favor menos de 50");
        return elegirCantidad(cantidad);
    }
    else
    {
        return cantidad;
    }
}
agregarPedido();
const codigo = prompt("Ingresa un codigo de descuento si tenes.(<1234>)");

let descuento=1;
if(descuentos.includes(parseInt(codigo)))
{
    alert("Descuento de 10%!");
    descuento=0.9;
}
else
{
    alert("Lo sentimos, ese codigo no es válido");
    descuento=1;
}

let recibo = document.getElementById("recibo");
let importeTotal = document.createElement("li");
importeTotal.innerText = "Tu total a pagar: $"+importe;
recibo.append(importeTotal);