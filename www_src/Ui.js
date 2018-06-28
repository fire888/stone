
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


class Ui {

  constructor() {
    this.line = '<br/>--------------------------------------------------------------<br/>';
    this.intervalAnimation = null 
  }

  init() {
    $( "<div id='ui'></div>" ).appendTo( "body" )
    $( "<div id='info'></div>" ).appendTo( "#ui" )

    $( '<div id="head"></div>').appendTo( 'body' )
    $( '<p id="startName">STONE<br/>SCISSORS<br/>PAPER</p>').appendTo( '#head' )

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
    console.log( h )
    let step = h/20
    $( '#buttonsChoiceWrapper' ).css( { 'height': step*2.5 + 'px' } )    
    $( '.buttonsChoice' ).css({ 
        'width'  : step*2.8 + 'px',
        'height' : step*2.3 + 'px' 
      }) 
    $( '#buttonSearchWrapper' ).css( { 'height': step*2.5 + 'px' } )   
    $( '#buttonSearch').css({ 
        'height' : step*2.3 + 'px',
        'width'  : step*8.5 + 'px' 
      })      
  }
  
  clickButtonSearchEnemy( updateGame ) {
    $( '#buttonSearch' ).click(() => {
        $( '#head' ).append( '<p id ="searchingProcess">Searching enemy...</p>' )
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
    $( '<p id="playerName">you name: <span id="name">' + name + '</span></p>' ).appendTo( '#head' )
  }

  setMessageSearchEnemy( name ) {
    $( '#startName' ).remove()
    $( '#searchingProcess' ).remove()
    $( '#info' ).append( 'ok.' + this.line + 'Find Enemy: ' + name)
  }

  setMessageEnemyMadeChoice() {
    $( '#info' ).append( 'Enemy made choice.' )
  }

  setMessageChoiceHero( choice ) {
    $( '#info' ).append( 'You: ' + choice + '<br/>' )	
  }

  setMessageStartFatality() {
    $( '#info' ).append( '<br/>Fatality: ' )
  }
    
  drawRoundResult( lastRoundResult ) {
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


export default Ui

