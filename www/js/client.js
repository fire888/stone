/***********************************************;
*  Project        : STONE
*  Program name   : Client
*  Author         : www.otrisovano.ru
*  Date           : 01.11.2017 
*  Purpose        : game client   
***********************************************/	

class Client {

  constructor() {}

  sendSignToFindEnemy( updateGame ) {
    $.post( '/api/user/find-game' )
      .then(( result ) => {
        updateGame( result )
    })
  }
  
  getSignIfConnectFirst( updateGame ) {	  
    $.get( '/api/session/hello' )
      .done(( result ) => {		  
        updateGame( result )					
      })
  }  

  getSignAboutUpdateGameResult( updateGame ) {
    $.get('/api/game').done(( results ) => {
      updateGame( results )
    })
  }

  sendHeroChoice( choice, updateGame ) { 
    console.log( choice )	
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

