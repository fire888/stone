
/*******************************************************************;
 *              _        *  Project        :  STONE
 *        _____/\_\      * -----------------------------------------;
 *       /\   / / /      *  Program name   :  client
 *    __/_ \  \/_/ \     * -----------------------------------------;
 *   /\___\ \_______\    *  Author         :  www.otrisovano.ru
 *   \/___/ /  __   /    * -----------------------------------------;
 *      \  /  /\ \ /     *  Date           :  01.11.2017 
 *       \/___\ \_\      * -----------------------------------------;
 *             \/_/      *  Purpose        :  game 2d
 *                       * -----------------------------------------;
 *                       *  License        :  MIT         
 *******************************************************************/	

class Client {

  constructor() {}


  getSignIfConnectFirst( updateGame ) {	  

    $.get( '/api/session/hello' )
      .done(( result ) => {		  
        updateGame( result )					
      })
  }  


  sendSignToFindEnemy( updateGame ) {

    $.post( '/api/user/find-game' )
      .then(( result ) => {
        updateGame( result )
    })
  }


  getSignAboutUpdateGameResult( updateGame ) {

    $.get('/api/game').done(( results ) => {
      updateGame( results )
    })
  }


  sendHeroChoice( choice, updateGame ) { 

    $.post( '/api/game/move?choice=' + choice)
      .then(( result ) => { 
        updateGame( result ) 
      }) 
  }


  sendReadyForNextRound( updateGame ) {  

    $.post( '/api/game/next-round' )
      .then(( result ) => {
        updateGame( result )
      })
  }


  postEnemyIsDisconnected() {

    $.post( '/api/game/enemy-disconnected' )
      .then(( result ) => {
      })  
  }


  postWinnerResultFatality( resultFatality, updateGame ) {

    $.post( '/api/game/fatality?is=' + resultFatality )
      .then(( result ) => {
        updateGame( result )	
      })		
  }


  loserWaitResultFatality( updateGame ) {
    
    $.post( '/api/game/isFatalityDoneForLoser' )
      .then(( result ) => {
        updateGame( result )
      })	
  }
}

export default Client

