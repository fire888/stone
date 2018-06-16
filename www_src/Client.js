
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

 
'use strict'


class Client {

  constructor() {
    this.responseError = () => {}
  }
  
  getSignIfConnectFirst( updateGame ) {	  
    $.get( '/api/session/hello' )
      .fail(() => { this.responseError() })
      .done(( result ) => { updateGame( result ) })
  }  

  sendSignToFindEnemy( updateGame ) {
    $.post( '/api/user/find-game' )
      .fail(() => { this.responseError() })
      .then(( result ) => { updateGame( result ) })
  }

  getSignAboutUpdateGameResult( updateGame ) {
    $.get('/api/game')
      .fail(() => { this.responseError() })     
      .done(( results ) => { updateGame( results ) })
  }

  sendHeroChoice( choice, updateGame ) { 
    $.post( '/api/game/move?choice=' + choice)
      .fail(() => { this.responseError() })     
      .then(( result ) => { updateGame( result ) })      
  }

  sendReadyForNextRound( updateGame ) {  
    $.post( '/api/game/next-round' )
      .fail(() => { this.responseError() })      
      .then(( result ) => { updateGame( result ) })  
  }

  postEnemyIsDisconnected() {
    $.post( '/api/game/enemy-disconnected' )
      .fail(() => { this.responseError() })     
      .then(( result ) => {})     
    }

  postWinnerResultFatality( resultFatality, updateGame ) {
    $.post( '/api/game/fatality?is=' + resultFatality )      
      .then(( result ) => { updateGame( result ) })    		
  }

  loserWaitResultFatality( updateGame ) {    
    $.post( '/api/game/isFatalityDoneForLoser' )
      .then(( result ) => { updateGame( result ) })
  }

  setFunctionResponseError( func ) { this.responseError = func }  
}


export default Client



