var wr = document.createElement('div');
wr.id = 'startScreen';
wr.innerHTML = 'STONE<br/>SCISSORS<br/>PAPER';
wr.style.height = window.innerHeight + 'px';
wr.style.width = window.innerWidth + 'px';
wr.style.fontSize = window.innerHeight*0.04 + 'px';
wr.style.paddingTop = window.innerHeight*0.4 + 'px';  
document.body.appendChild( wr );

var loaderWrapper = document.createElement('div');
loaderWrapper.id = 'loaderWrapper';
loaderWrapper.style.width = window.innerHeight/2.5 + 'px';
loaderWrapper.style.height = window.innerHeight/100 + 'px';
loaderWrapper.style.marginTop = window.innerHeight*0.3 + 'px';
loaderWrapper.innerHTML = '<img id="loader" style="width: '+ window.innerHeight*0.8 +'px; height: 50px;" src="app/imgs/loader.png"/>';
wr.appendChild( loaderWrapper ); 

var loader = document.getElementById( 'loader' );
var margLoader = -loader.width*0.3;
var timerLoader = setTimeout( updateLoader, 30 );

function updateLoader() {
  loader.style.marginLeft = margLoader + 'px'; 
  margLoader += loader.width/100;
  if ( margLoader > -20 )   margLoader = -loader.width*0.3;
  timerLoader = setTimeout( updateLoader, 100 );  
}

function removeStartLoader() {
    clearTimeout( timerLoader );
    wr.removeChild( loaderWrapper );
}

function removeStartScreen() {
    document.body.removeChild( wr );
} 