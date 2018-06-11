
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

class Ui {

  constructor() {

    this.line = '<br/>--------------------------------------------------------------<br/>';
    this.intervalAnimation = null 
  }


  init() {

    $( "<div id='ui'></div>" ).appendTo( "body" )
    $( "<div id='info'></div>" ).appendTo( "#ui" )
    $( "<button id='buttonSearch'>search Enemy</button>" ).appendTo( "#ui" )
    $( '#buttonSearch' ).hide()     
    $( "<button class='buttonsChoice' value='stone'>stone</button>" ).appendTo( "#ui" ) 
    $( "<button class='buttonsChoice' value='scissors'>scissors</button>" ).appendTo( "#ui" )    
    $( "<button class='buttonsChoice' value='paper'>paper</button>" ).appendTo( "#ui" )
    $( '.buttonsChoice' ).hide()                                 
  }
  

  clickButtonSearchEnemy( updateGame ) {

    $( '#buttonSearch' ).click(() => {
        $( '#info' ).append( 'Searching enemy:...' )
        $( '#buttonSearch' ).hide()
        updateGame()
      })
  }


  clickButtonsChoiceHero( updateGame, isHideButtons ) {

    $( '.buttonsChoice' ).click(( e ) => {
      if ( isHideButtons() ) {
        $( '.buttonsChoice' ).hide()          
      }  
      updateGame( e )			
    })  
  } 
  
  
  setConnectionMessage( name ) {

    $( '#info' ).append( 'Connecting done! <br/>' + 'your name: ' + name + this.line )
  }


  setMessageSearchEnemy( name ) {

    $( '#info' ).append( 'ok.' + this.line + 'Find Enemy: ' + name)
  }


  setMessageEnemyMadeChoice() {

    $( '#info' ).append( 'Enemy made choice.' )
  }


  setMessageChoiceHero( choice ) {

    $( '#info' ).append( 'You: ' + choice + '<br/>' )	
  }

  setMeccageStartFatality() {

    $( '#info' ).append( '<br/>Fatality: ' );
  }
    
  
  drawRoundResult( lastRoundResult ) {

    $('#info').append(
      '<br/>Your: ' + lastRoundResult.myChoice + 
      ' / Enemy: ' + lastRoundResult.enemyChoice + 
      ' / Winner: ' + lastRoundResult.winner + '<br/>'
    ) 
  }


  showButtonSearch() {

    $( '#buttonSearch' ).show()
  }  


  hideButtonSearch() {

    $( '#buttonSearch' ).hide()
  }   


  showButtonsChoice() {

    $( '.buttonsChoice' ).show()
  }


  hideButtonsChoice() {

    $( '.buttonsChoice' ).hide()
  }  
  

  addLine() {

    $( '#info' ).append( ui.line + 'Round:<br/>' )    
  }


  addValueFatality( val ) {

    $('#info').append( ' ' + val )
  }


  setMessBeforeFatality() {

    $( '#info' ).append( '<br/>wait Death...' )  
  }


  setMessageEnd( mess ) {

    $('#info').append( '<br>' + mess + '</br>' )
  }


  clearScreen() {
  
    $('#info').html('')
  }


  startAnimationWait() {

    $('<div/>',{ 'id' : 'loadBar' }).appendTo('#info');	
    this.intervalAnimation = setInterval( () => { this.waitProgress() }, 1000 )
  }
  

  waitProgress() { 

    $('#loadBar').append('*');	
  }
  

  stopAnimationWait() {

    clearInterval( this.intervalAnimation );
    $('#loadBar').remove();	
  }  
}

export default Ui