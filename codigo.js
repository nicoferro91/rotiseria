
let pedido ="si";
let cantidad;
let producto;
let descuento;
let total;
let precio;
let envio=50;
pedido = prompt("Queres pedir algo? si/no");
while (pedido=="si")
{
    if(pedido!="si")
    {
        break;
    }
    alert("Elegi un producto del menu");
    producto = prompt("Elegi un producto:\n hamburguesa - $400 \n milanesa - $500 \n empanadas - $150 \n Envio: $50");
    while((producto=="hamburguesa")||(producto=="milanesa")||(producto=="empanadas"))
    {
        cantidad = parseInt(prompt("Que cantidad queres?"));
        while((isNaN(cantidad)||(cantidad<1)))
        {
            alert("Ingresa un numero positivo")
            cantidad = parseInt(prompt("Que cantidad queres?"));
        }
        
        {
            if (producto=="empanadas")
            {
                let carne=0;
                let pollo=0;
                for (let i=1; i<=cantidad; i++) 
                {
                    let gusto = prompt("La empanada "+i+" de carne o pollo?");
                    if(gusto=="carne") carne++;
                    else pollo++;
                }
                precio = 150;
                alert("Tu pedido: "+carne+" empanadas de carne y "+pollo+" empanadas de pollo");
            }
            else
            {
                if(producto=="hamburguesa")
                {
                    precio=400;
                }
                else
                {
                    precio=500;
                }
                if(cantidad>1)
                {
                    alert("Tu pedido: "+cantidad+" "+producto+"s");
                }
                else
                {
                    alert("Tu pedido: "+cantidad+" "+producto);
                }
            }
            pedido = "no";
            producto = "no";
            // break;
        }
        codigo = prompt("Ingresa un codigo de descuento si tenes.(<1234>)");
        if (codigo=="1234")
        {
            alert("Descuento de 10%!");
            descuento=0.9;
        }
        else
        {
            alert("Codigo no valido");
            descuento=1;
        }
        total = importe(cantidad,precio,descuento,envio)
    
        alert("Tu total es: "+total);
    }
}

const bebidas = [{id: 1, producto:"Cerveza"},
                 {id: 2, producto:"Gaseosa"},
                 {id: 3, producto:"Agua"},
                 {id: 4, producto:"Limonada"}];

bebidas.push({id:5, producto:"Licuado"});

for (const producto of bebidas)
{
    console.log(producto.producto);
}

function importe(cantidad,precio,descuento,envio)
{
    return cantidad * precio * descuento + envio;
}
