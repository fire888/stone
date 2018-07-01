
/*******************************************************************;
 *              _        *  Project        :  STONE    
 *        _____/\_\      * -----------------------------------------;
 *       /\   / / /      *  Program name   :  user interface
 *    __/_ \  \/_/ \     * -----------------------------------------;
 *   /\___\ \_______\    *  Author         :  www.otrisovano.ru
 *   \/___/ /  __   /    * -----------------------------------------;
 *      \  /  /\ \ /     *  Date           :  10.16.2018 
 *       \/___\ \_\      * -----------------------------------------;
 *             \/_/      *  Purpose        :  game 2d
 *                       * -----------------------------------------;
 *                       *  License        :  MIT         
 *******************************************************************/


'use strict'

let timerRound = null, 
timerMargin = null,
timerWidth = null

class Ui {

  /** INIT *********************************************************/

  constructor() {
    this.intervalAnimation = null
    this.round = 0
  }

  init() {    
    $( '<div id="uiWrapper"></div>').appendTo( 'body' )
    $( '<div id="scoreWrapper"></div>' ).appendTo( '#uiWrapper' )
    $( '<div id="score"></div>' ).appendTo( '#scoreWrapper' )
    $( '<div id="enemyName" class="playersNames"></div>' ).appendTo( '#score' )
    $( '<div id="playerName" class="playersNames"></div>' ).appendTo( '#score' )
    $( '<div id="scores"></div>').appendTo( '#score' )
    $( '<div id="result"></div>').appendTo( '#score' )      
    $( '<div id="fatality"></div>').appendTo( '#score' )    

    $( '<div id="buttonSearchWrapper"></div>' ).appendTo( 'body' )

    $( '<button id="buttonStart"></button>' ).appendTo( '#buttonSearchWrapper' )  
    $( '#buttonStart' ).hide()

    $( '<button id="buttonSearch"></button>' ).appendTo( '#buttonSearchWrapper' ) 
    $( '<img src="app/imgs/btnStart.png"/>' ).appendTo( '#buttonSearch' ) 
    $( '<p id="searchText" >Search enemy</p>' ).appendTo( '#buttonSearch' )
    this.hideButtonSearch()

    $( "<div id='buttonsChoiceWrapper'></div>" ).appendTo( "body" )    
    $( "<button class='buttonsChoice' id='stone' value='stone'><img src='app/imgs/btnStone.png'/></button>" ).appendTo( "#buttonsChoiceWrapper" ) 
    $( "<button class='buttonsChoice' id='scissors' value='scissors'><img src='app/imgs/btnSnipe.png'/></button>" ).appendTo( "#buttonsChoiceWrapper" )    
    $( "<button class='buttonsChoice' id='paper' value='paper'><img src='app/imgs/btnPaper.png'/></button>" ).appendTo( "#buttonsChoiceWrapper" )
    this.hideButtonsChoice()
    
    this.resizeUi()                              
  }

  resizeUi() {
    let h = window.innerHeight
    let step = h/20
    $( '#buttonStart').css({ 
        'height':      step*2.3 + 'px',
        'width':       step*8.5 + 'px', 
        'font-size':   step*0.7 + 'px'      
      })    
    $( '#buttonsChoiceWrapper' ).css( { 'height': step*2.5 + 'px' } )    
    $( '.buttonsChoice' ).css({ 
        'width':       step*2.8 + 'px',
        'height':      step*2.3 + 'px' 
      }) 
    $( '#buttonSearchWrapper' ).css( { 'height': step*2.5 + 'px' } )   
    $( '#buttonSearch').css({ 
        'height':      step*2.3 + 'px',
        'width':       step*8.5 + 'px' 
      })
    $( '#searchText' ).css({
        'font-size':   step*0.7 + 'px', 
        'margin-top':  step*0.8 + 'px'           
      })  
    $( '#scoreWrapper' ).css( { 'width': step*10 + 'px' } )   
    $( '#score' ).css({ 
        'width':       step*7 + 'px',
        'margin-left': step*7 + 'px',
        'margin-top':  step*0.7 + 'px'
      })
    $( '.playersNames' ).css({
        'height':      step*1.1 + 'px',
        'font-size':   step*0.3 + 'px'
      }) 
    $( '.namePl' ).css({
        'font-size':   step*0.5 + 'px'     
    })
    timerWidth = step*3         
    $( '.roundTimer' ).css({
        'width':       timerWidth + 'px', 
        'height':      step*0.8 + 'px',
        'margin-top':  step*0.1 + 'px'    
      })
    $( '#timerLine' ).css({
        'width':       timerWidth*1.5 + 'px', 
        'height':      step + 'px'           
      })
    $( '#result' ).css({
        'font-size':   step*0.3 + 'px'
      })     
    $( '#fatalitySigns' ).css({
        'height':      step*0.8 + 'px'
      })         
    
  }
  
  initStartButton( updateGame ) {
    $( '#buttonStart' ).show()
    $( '#buttonStart' ).click(() => {
      $( '#buttonStart' ).remove()
      updateGame()
    }) 
  }


  /** START GAME ***************************************************/

  setConnectionMessage( name ) {
    $( '#playerName' ).html( 'you<br/><span class="namePl">' + name + '</span>' )
    this.resizeUi()
  }

  clickButtonSearchEnemy( updateGame ) {
    $( '#buttonSearch' ).click(() => {         
      updateGame()
      $( '#buttonSearch' ).hide()       
      $( '#enemyName' ).html( 'enemy searching ... ' )  
      this.resizeUi()           
    })
  }
    
  setMessageSearchEnemy( name ) {
    $( '#enemyName' ).html( 'enemy<br/><span class="namePl"> ' + name + '</span>' )
    this.resizeUi()
  }

  showButtonSearch() { $( '#buttonSearch' ).show() }  

  hideButtonSearch() { $( '#buttonSearch' ).hide() }    


  /* ROUND *********************************************************/

  startAnimationRoundTimer( t ) {
    $( '<div class="roundTimer" id="r' + this.round + '"></div>').appendTo( '#scores' )
    $( '<div id="timerLine"></div>' ).appendTo( '#r' + this.round )

    if ( this.round > 6 ) { 
      let delRound = this.round-7      
      $( '#r'+ delRound ).remove()
    }
    
    timerMargin = t
    this.resizeUi()  
    animationRoundTimer()
  }

  clickButtonsChoiceHero( updateGame, isRedrawButtons ) {
    $( '.buttonsChoice' ).click(( e ) => {
      if ( isRedrawButtons() ) {
        this.redrawChoiceButtons( e.target.value )   
      }
      updateGame( e )	
    })  
  } 

  showButtonsChoice() { $( '#buttonsChoiceWrapper' ).show() }

  redrawChoiceButtons( vall ) {
    if ( vall === 'stone' ) {
      $( '#scissors' ).html( '<img src="app/imgs/btnSnipe_b.png"/>' )  
      $( '#paper' ).html( '<img src="app/imgs/btnPaper_b.png"/>' )        
    }
    if ( vall === 'scissors' ) {
      $( '#stone' ).html( '<img src="app/imgs/btnStone_b.png"/>' )  
      $( '#paper' ).html( '<img src="app/imgs/btnPaper_b.png"/>' )        
    }  
    if ( vall == 'paper' ) {
      $( '#stone' ).html( '<img src="app/imgs/btnStone_b.png"/>' )  
      $( '#scissors' ).html( '<img src="app/imgs/btnSnipe_b.png"/>' )        
    }
    if ( vall === 'show') {
      $( '#stone' ).html( '<img src="app/imgs/btnStone.png"/>' )  
      $( '#scissors' ).html( '<img src="app/imgs/btnSnipe.png"/>' )
      $( '#paper' ).html( '<img src="app/imgs/btnPaper.png"/>' )            
    }   
  } 
  
  hideButtonsChoice() { $( '#buttonsChoiceWrapper' ).hide() }  

  stopAnimationRoundTimer() {
    clearTimeout( timerRound )
  }

  drawRoundResult( lastRoundResult ) {
    this.stopAnimationRoundTimer()
    $( '#timerLine' ).remove()
    let myChoice = getChiocePict( lastRoundResult.myChoice )
    let enChoice = getChiocePict( lastRoundResult.enemyChoice )
    $( '#r' + this.round ).html( enChoice + ' <img src="app/imgs/points.png"> ' + myChoice )
    $( '#r' + this.round ).css( { 'background-color': getBackColor( lastRoundResult.winner ) } )  
    this.round ++     
  }


  /* END GAME ******************************************************/

  setMessageStartFatality( v ) {
    if ( v === 'me' ) {
      $( '<div style="color: #dfa43c"><br/><br/>You WIN !<br/><br/></div>' ).appendTo( '#result' )  
      $( '<div style="color: #ff0000">Fatality:<br/><br/> </div>' ).appendTo( '#fatality' )  
      $( '<div id="fatalitySigns"></div>' ).appendTo( '#fatality' )
      this.resizeUi()          
    }
    if ( v === 'enemy' ) {
      $( '<div style="color: #dfa43c"><br/><br/>You LOSE.<br/><br/></div>' ).appendTo( '#result' )  
      $( '<div style="color: #ff0000">Fatality...<br/><br/> </div>' ).appendTo( '#fatality' )  
    }    
  }
    
  addValueFatality( val ) { 
    $( getChiocePict( val ) ).appendTo( '#fatalitySigns' ) 
  }

  setMessage( mess ) {
    let h = document.getElementById( 'result' )
    if ( h.innerHTML != '' ) return
    $('#result').append( '<br>' + mess + '</br>' ) 
  }

  removeFatalityBar() {
    $( '#fatality' ).html( '' ) 
  }

  clearScreen() {
    clearTimeout( timerRound )
    $( '#result' ).html( '' ) 
    $( '#scores' ).html( '' ) 
    $( '#enemyName' ).html( '' ) 
  }
}
  



const animationRoundTimer = () => {
  let m = timerWidth - timerMargin/7000*timerWidth
  $( '#timerLine' ).css( { 'marginLeft': m  + 'px' } )  
  timerMargin -= 100  
  timerRound = setTimeout( animationRoundTimer, 100 )
}

const getChiocePict = v => {
  if ( v == 'stone' ) return '<img src="app/imgs/btnStone.png"/>'
  if ( v == 'scissors' ) return '<img src="app/imgs/btnSnipe.png"/>'
  if ( v == 'paper' ) return '<img src="app/imgs/btnPaper.png"/>'
  if ( v == 'timeout' ) return '<img src="app/imgs/btnStart.png"/>'  
}

const getBackColor = v => {
  if ( v == 'me' ) return '#958d0d' 
  if ( v == 'enemy' ) return '#5e2208' 
  if ( v == 'draw' ) return '#404040'     
}




export default Ui

