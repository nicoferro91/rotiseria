let activo = true;
let parar = false;
let creador = document.getElementById("empezar")
creador.onclick = ()=> {
    if(activo) {
    let universo = document.getElementById("cancha");
    let pelota = document.createElement("div");
    pelota.innerText = "pizza";
    pelota.setAttribute("class","pelota")
    pelota.setAttribute("id","pelota")
    universo.append(pelota)
    movimientoPelota();
    activo = false;
    parar = false;
    }
}

let reinicio = document.getElementById("reiniciar")
reinicio.onclick = ()=> {
    let finisher = document.getElementById("pelota")
    finisher.remove();
    activo = true;
    parar = true;
    let anotar=document.getElementById("puntajeRival");
    anotar.innerText=0;
    anotar=document.getElementById("puntajeJugador");
    anotar.innerText=0;
}

// mitad del ancho de jugador
let ancho = 40;
// radio de pelota
let radio = 20;
let rivalPosition = 200;
let playerPosition = 200;
let playerSpeed = 4;
let maxSpeed = 5;

document.addEventListener('keydown', (event) => {
    const tecla = event.key;
    let jugador = document.getElementById("jugador")
    switch(tecla){
        case "ArrowLeft":
            playerPosition = playerPosition - playerSpeed
            jugador.style.left = playerPosition - ancho + "px";
            break;
        case "ArrowRight":
            playerPosition = playerPosition + playerSpeed
            jugador.style.left = playerPosition - ancho + "px";
            break;
    }
    if(playerPosition<ancho) playerPosition = ancho;
    if(playerPosition>400-ancho) playerPosition = 400-ancho;
  });

function rival(pelota) {
    if((pelota-100)>rivalPosition) rivalPosition = rivalPosition + playerSpeed;
    else rivalPosition = rivalPosition - playerSpeed;
    let rival = document.getElementById("rival");
    rival.style.left = rivalPosition - ancho + "px";
}

function movimientoPelota() {
    let id = null;
    const pelota = document.getElementById("pelota");
    pelota.style.opacity = "100";
    let xpos = 150;
    let ypos = 150;
    let xSpeed = 2;
    let ySpeed = 2;
    clearInterval(id);
    id = setInterval(frame, 16);
    function frame() {
        if(parar==true) clearInterval(id);
        xpos += xSpeed;
        ypos += ySpeed;
        pelota.style.left = xpos - radio + "px";
        pelota.style.top = ypos - radio + "px";
        rival(xpos);
        if(xpos>(500-radio)||xpos<(100+radio)) 
        {
            let color = colorRandom();
            pelota.style.backgroundColor = "#"+color;
            xSpeed = -xSpeed;
        }
        if(ypos>(700-radio)) 
        {
            let color = colorRandom();
            pelota.style.backgroundColor = "#"+color;
            ySpeed = -ySpeed
            if((Math.abs(ySpeed))<maxSpeed)
            {
                ySpeed = ySpeed*1.2;
                xSpeed = xSpeed*1.2;
            }
            let distancia = Math.abs((xpos-100)-playerPosition)
            if(distancia>50)
            {
                let anotar=document.getElementById("puntajeRival");
                let puntaje = anotar.innerText;
                puntaje++;
                anotar.innerText = puntaje;
            }
        }
        if(ypos<(100+radio)) 
        {
            let color = colorRandom();
            pelota.style.backgroundColor = "#"+color;
            ySpeed = -ySpeed
            if((Math.abs(ySpeed))<maxSpeed)
            {
                ySpeed = ySpeed*1.2;
                xSpeed = xSpeed*1.2;
            }
            let distancia = Math.abs((xpos-100)-rivalPosition)
            if(distancia>50)
            {
                let anotar=document.getElementById("puntajeJugador");
                let puntaje = anotar.innerText;
                puntaje++;
                anotar.innerText = puntaje;
            }
        }
    }    
  }
  function colorRandom() {
    let colorRandom = Math.floor(Math.random()*16777215).toString(16);
    return colorRandom;
}