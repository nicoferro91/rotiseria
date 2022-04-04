
const menu = 
{
    hamburguesa: 400,
    milanesa: 500,
    empanada: 150,
    pizza: 800,
    cerveza: 300,
    agua: 150,
}
const envio = 50;
let id = 1;
function Pedido(id, nombre, cantidad)
{
    this.id = id;
    this.nombre = nombre;
    this.cantidad = cantidad;
    this.precio = cantidad*menu[nombre];
}

const descuentos = [1234,4444,7878,6060,9999];

alert("Nuestro menu: "+JSON.stringify(menu, null, 4)+"Envio: 50");

let importe = 0;
let pedidoTotal = [];
function agregarPedido()
{
    const nuevoPedido = new Pedido(id,prompt("Que queres pedir?"),parseInt(prompt("ingrese cantidad")));
    if(!(nuevoPedido.nombre in menu))
    {
        alert("El producto ingresado no existe");
    }
    else
    {
        if(nuevoPedido.cantidad < 1)
        {
            alert("Por favor ingrese una cantidad mayor a cero")
        }
        else if(nuevoPedido.cantidad > 50)
        {
            alert("Parece que te equivocaste con la cantidad")
        }
        else
        {
            id++;
            pedidoTotal.push(nuevoPedido);
            importe=importe+nuevoPedido.precio;
        }
    }
}

let pedir = true;
while(pedir)
{
    agregarPedido();
    if(!(confirm("Queres pedir algo mas?")))
    {
        pedir = false;
    }
}
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
importe=importe*descuento+envio;
alert("Tu pedido: "+JSON.stringify(pedidoTotal, null, 4)+"Tu importe final: "+importe+" Tu pedido esta en camino");
