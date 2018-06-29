
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
timerMargin = null

class Ui {

  constructor() {
    this.line = '<br/>--------------------------------------------------------------<br/>';
    this.intervalAnimation = null
    this.round = 0 
  }

  init() {
    $( "<div id='ui'></div>" ).appendTo( "body" )
    $( "<div id='info'></div>" ).appendTo( "#ui" )
    
    $( '<div id="uiWrapper"></div>').appendTo( 'body' )
    $( '<div id="scoreWrapper"></div>' ).appendTo( '#uiWrapper' )
    $( '<div id="score"></div>' ).appendTo( '#scoreWrapper' )
    $( '<div id="enemyName" class="playersNames"></div>' ).appendTo( '#score' )
    $( '<div id="playerName" class="playersNames"></div>' ).appendTo( '#score' )
    $( '<div id="scores"></div>').appendTo( '#score' )

    $( '<div id="buttonSearchWrapper"></div>' ).appendTo( 'body' )
    $( '<button id="buttonSearch"></button>' ).appendTo( '#buttonSearchWrapper' ) 
    $( '<img src="app/imgs/btnStart.png"/>' ).appendTo( '#buttonSearch' ) 
    $( '<p>Search enemy</p>' ).appendTo( '#buttonSearch' )
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
    $( '#buttonsChoiceWrapper' ).css( { 'height': step*2.5 + 'px' } )    
    $( '.buttonsChoice' ).css({ 
        'width':      step*2.8 + 'px',
        'height':     step*2.3 + 'px' 
      }) 
    $( '#buttonSearchWrapper' ).css( { 'height': step*2.5 + 'px' } )   
    $( '#buttonSearch').css({ 
        'height':     step*2.3 + 'px',
        'width':      step*8.5 + 'px' 
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
    $( '.roundTimer' ).css({
      'width':       step*4 + 'px', 
      'height':      step*0.5 + 'px',
      'margin':      step*0.1 + 'px'    
    })
    $( '#timerLine' ).css({
      'width':   step*4 + 'px', 
      'height':   step*0.5 + 'px'           
    })          
    
  }
  
  clickButtonSearchEnemy( updateGame ) {
    $( '#buttonSearch' ).click(() => {
      $( '#enemyName' ).html( 'enemy searching ... ' )
      this.resizeUi()
      $( '#buttonSearch' ).hide()
      updateGame()
    })
  }

  clickButtonsChoiceHero( updateGame, isStatePlay ) {
    $( '.buttonsChoice' ).click(( e ) => {
      if ( isStatePlay() ) {
        this.redrawChoiceButtons( e.target.value )        
      }  
      updateGame( e )			
    })  
  } 
    
  setConnectionMessage( name ) {
    $( '#playerName' ).html( 'you<br/><span class="namePl">' + name + '</span>' )
    this.resizeUi()
  }

  setMessageSearchEnemy( name ) {
    $( '#enemyName' ).html( 'enemy<br/><span class="namePl"> ' + name + '</span>' )
    this.resizeUi()
  }



  startAnimationRoundTimer( t ) {
    $( '<div class="roundTimer" id="r' + this.round + '"></div>').appendTo( '#scores' )
    $( '<div id="timerLine">11</div>' ).appendTo( '#r' + this.round ) 
    timerMargin = t
    this.resizeUi()  
    animationRoundTimer()
  }

  stopAnimationRoundTimer() {
    clearTimeout( timerRound )
  }


  setMessageEnemyMadeChoice() {
    $( '#info' ).append( 'Enemy made choice.' )
  }

  setMessageChoiceHero( choice ) {
    $( '#info' ).append( 'you ' + choice + '<br/>' )	
  }

  setMessageStartFatality() {
    $( '#info' ).append( '<br/>Fatality: ' )
  }
    
  drawRoundResult( lastRoundResult ) {
    this.stopAnimationRoundTimer()
    this.round ++
    $( '#lineTimer' ).remove()
    $('#info').append(
      '<br/>Your: ' + lastRoundResult.myChoice + 
      ' / Enemy: ' + lastRoundResult.enemyChoice + 
      ' / Winner: ' + lastRoundResult.winner + '<br/>'
    ) 
  }



  showButtonSearch() { $( '#buttonSearch' ).show() }  

  hideButtonSearch() { $( '#buttonSearch' ).hide() }   





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
  





  addLine() { $( '#info' ).append( this.line + 'Round:<br/>' ) }

  addValueFatality( val ) { $('#info').append( ' ' + val ) }

  setMessBeforeFatality() { $( '#info' ).append( '<br/>wait Death...' ) }

  setMessageEnd( mess ) { $('#info').append( '<br>' + mess + '</br>' ) }

  clearScreen() { $('#info').html('') }

  startAnimationWait() {
    $('<div/>',{ 'id' : 'loadBar' }).appendTo('#info')	
    this.intervalAnimation = setInterval( () => { this.waitProgress() }, 1000 )
  }
  
  waitProgress() { $('#loadBar').append('*')	}
  
  stopAnimationWait() {
    clearInterval( this.intervalAnimation )
    $('#loadBar').remove()
  }  
}


const animationRoundTimer = () => {
  timerMargin -= 70
 // let line = document.getElementById( 'timerLine' )
 // console.log( line.style.marginRight )
 // line.style.marginRight = 7000/timerMargin*line.style.width + 'px' !----------------- 
  timerRound = setTimeout( animationRoundTimer, 100 )
}

export default Ui

