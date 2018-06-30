let wr = document.createElement('div')
wr.id = 'startScreen'
wr.innerHTML = 'STONE<br/>SCISSORS<br/>PAPER'
document.body.appendChild( wr )
wr.style.height = window.innerHeight + 'px'
wr.style.width = window.innerWidth + 'px'
wr.style.fontSize = window.innerHeight*0.04 + 'px'
wr.style.paddingTop = window.innerHeight*0.04 + 'px'  

let loaderWrapper = document.createElement('div')
loaderWrapper.id = 'loaderWrapper'
loaderWrapper.style.width = window.innerHeight/6 + 'px'
loaderWrapper.style.height = window.innerHeight/30 + 'px'
loaderWrapper.style.marginTop = window.innerHeight/7 + 'px'
wr.appendChild( loaderWrapper ) 

loaderWrapper.innerHTML = '<img id="loader" src="app/imgs/loader.png"/>'

let loader = document.getElementById( 'loader' )
let margLoader = -300

const updateLoader = () => {
  loader.style.marginLeft = margLoader + 'px' 
  margLoader += 3
  if ( margLoader > -20 )   margLoader = -290
  timerLoader = setTimeout( updateLoader, 100 )  
}

let timerLoader = setTimeout( updateLoader, 30 )

const removeStartLoader = () => {
    clearTimeout( timerLoader )
    wr.removeChild( loaderWrapper )
}

const removeStartScreen = () => {
    document.body.removeChild( wr )
} 