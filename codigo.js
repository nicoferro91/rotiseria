let pedido ="si";
let cantidad;
let producto;
while (pedido=="si")
{
    pedido = prompt("Queres pedir algo? si/no");
    if(pedido!="si")
    {
        break;
    }
    
    alert("elegi un producto del menu");
    
    producto = prompt("Elegi un producto: hamburguesa, milanesa o empanadas");

    while((producto=="hamburguesa")||(producto=="milanesa")||(producto=="empanadas"))
    {
        cantidad = parseInt(prompt("Que cantidad queres?"));
        if(isNaN(cantidad))
        {
            alert("Ingresa un numero")
        }
        else
        {
            if (producto=="empanadas")
            {
                let carne=0;
                let pollo=0;
                for (let i=1; i<=cantidad; i++ ) 
                {
                    let gusto = prompt("La empanada "+i+" de carne o pollo?");
                    if(gusto=="carne") carne++;
                    else pollo++;
                }
                alert("Tu pedido: "+carne+" empanadas de carne y "+pollo+" empanadas de pollo");
            }
            else
            {
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
            break;
        }
    }
}
